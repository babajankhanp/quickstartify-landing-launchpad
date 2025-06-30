import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  NodeToolbar,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Loader2,
  Grid3X3,
  Maximize2
} from 'lucide-react';
import { TooltipNode } from '@/components/flow-builder/nodes/TooltipNode';
import { ModalNode } from '@/components/flow-builder/nodes/ModalNode';
import { HotspotNode } from '@/components/flow-builder/nodes/HotspotNode';
import { ChecklistNode } from '@/components/flow-builder/nodes/ChecklistNode';
import { BranchNode } from '@/components/flow-builder/nodes/BranchNode';
import { DelayNode } from '@/components/flow-builder/nodes/DelayNode';
import { ApiTriggerNode } from '@/components/flow-builder/nodes/ApiTriggerNode';
import { ABSwitchNode } from '@/components/flow-builder/nodes/ABSwitchNode';
import { NodeEditorModal } from '@/components/flow-builder/NodeEditorModal';
import { EnhancedToolbar } from '@/components/flow-builder/EnhancedToolbar';
import { EnhancedSidebar } from '@/components/flow-builder/EnhancedSidebar';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { 
  Flow, 
  FlowStep, 
  Milestone, 
  StepAction, 
  convertJsonToMilestones, 
  convertJsonToStepActions,
  convertMilestonesToJson,
  convertStepActionsToJson,
  generateUUID
} from '@/integrations/supabase/models';
import { Json } from '@/integrations/supabase/types';

// Type for node data to ensure consistency
interface NodeData {
  label: string;
  content?: string;
  milestones?: Milestone[];
  actions?: StepAction[];
  styling?: {
    background?: string;
    border?: string;
    textColor?: string;
    [key: string]: any;
  };
  dom_selector?: string;
  page_url?: string;
  targeting_rules?: Record<string, any>;
  [key: string]: any;
}

// Type for application nodes
interface AppNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: NodeData;
}

// Define custom node types
const nodeTypes = {
  tooltip: TooltipNode,
  modal: ModalNode,
  hotspot: HotspotNode,
  checklist: ChecklistNode,
  branch: BranchNode,
  delay: DelayNode,
  apiTrigger: ApiTriggerNode,
  abSwitch: ABSwitchNode,
};

// Create UUID-based default nodes
const initialNodes: AppNode[] = [
  {
    id: generateUUID(),
    type: 'modal',
    position: { x: 250, y: 5 },
    data: { 
      label: 'Welcome Modal',
      content: 'Welcome to your onboarding flow!',
      milestones: [
        {
          id: generateUUID(),
          title: 'Welcome',
          subtitle: 'Get started with our product',
          formFields: [
            {
              id: generateUUID(),
              name: 'name',
              type: 'text',
              required: true,
              validation: '',
              placeholder: 'Enter your name',
              isButton: false
            },
            {
              id: generateUUID(),
              name: 'start-button',
              type: 'button',
              required: false,
              validation: '',
              placeholder: '',
              isButton: true,
              buttonLabel: 'Get Started',
              buttonAction: 'next',
              buttonCollectMetrics: true
            }
          ]
        }
      ],
      styling: {
        background: 'bg-white',
        border: 'border-purple-200',
        textColor: 'text-foreground'
      },
      dom_selector: '',
      page_url: '',
      actions: [],
      targeting_rules: {}
    },
  },
];

// Default flow initial edges
const initialEdges = [];

const FlowBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [flowName, setFlowName] = useState("My Onboarding Flow");
  const [flowDescription, setFlowDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flow, setFlow] = useState<Flow | null>(null);
  const [flowSteps, setFlowSteps] = useState<FlowStep[]>([]);
  
  // Handle node selection
  const onNodeClick = useCallback((_, node: AppNode) => {
    setSelectedNode(node);
    setIsEditorModalOpen(true);
  }, []);
  
  // Handle connection of nodes
  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      animated: true,
      style: { stroke: '#9b87f5' },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);
  
  // Add a new node on drag from sidebar
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Handle drop of new nodes
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      
      const nodeType = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');
      
      if (!nodeType || !reactFlowInstance) {
        return;
      }
      
      // Get position from drop event
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      // Generate a unique UUID
      const newNode = {
        id: generateUUID(),
        type: nodeType,
        position,
        data: { 
          label, 
          content: `New ${label} content`,
          milestones: [],
          actions: [],
          styling: {
            background: 'bg-white',
            border: 'border-purple-200',
            textColor: 'text-foreground'
          },
          dom_selector: '',
          page_url: '',
          targeting_rules: {}
        },
      };
      
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );
  
  // Load flow data from Supabase
  useEffect(() => {
    async function fetchFlowData() {
      if (!id || !user || id === ':id') {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Fetch flow data
        const { data: flowData, error: flowError } = await supabase
          .from('flows')
          .select('*')
          .eq('id', id)
          .single();
        
        if (flowError) throw flowError;
        
        // Add missing properties to match Flow interface
        const typedFlow = {
          ...flowData,
          name: flowData.title || flowData.name || 'Untitled Flow',
          status: flowData.status || 'draft'
        } as Flow;
        
        setFlow(typedFlow);
        setFlowName(typedFlow.title || typedFlow.name);
        setFlowDescription(typedFlow.description || "");
        
        // Fetch flow steps
        const { data: stepsData, error: stepsError } = await supabase
          .from('flow_steps')
          .select('*')
          .eq('flow_id', id)
          .order('position', { ascending: true });
        
        if (stepsError) throw stepsError;
        
        // Set flow steps converting from DB model to app model
        const appFlowSteps = stepsData?.map(step => {
          // Safe casting of JSON fields to typed objects
          const styling = step.styling as Record<string, any> || {};
          const milestones = styling && styling.milestones 
            ? convertJsonToMilestones(styling.milestones as Json)
            : [];
            
          const actions = styling && styling.actions 
            ? convertJsonToStepActions(styling.actions as Json)
            : [];
            
          return {
            ...step,
            step_type: step.step_type as FlowStep['step_type'], // Cast to specific type
            milestones: milestones,
            actions: actions
          } as FlowStep;
        }) || [];
        
        setFlowSteps(appFlowSteps);
        
        if (appFlowSteps && appFlowSteps.length > 0) {
          // Convert flow steps to nodes and edges
          const flowNodes: AppNode[] = appFlowSteps.map(step => {
            const styling = step.styling as Record<string, any> || {};
            const posX = styling && styling.position_x
              ? Number(styling.position_x)
              : 0;
              
            const posY = styling && styling.position_y
              ? Number(styling.position_y)
              : 0;
            
            // Ensure we create properly typed NodeData object
            const nodeData: NodeData = {
              label: step.title,
              content: step.content || '',
              milestones: step.milestones || [],
              actions: step.actions || [],
              styling: {
                background: styling?.background || 'bg-white',
                border: styling?.border || 'border-purple-200',
                textColor: styling?.textColor || 'text-foreground'
              },
              dom_selector: step.dom_selector || '',
              page_url: step.page_url || '',
              targeting_rules: step.targeting_rules || {}
            };
              
            return {
              id: step.id,
              type: step.step_type,
              position: {
                x: posX,
                y: posY,
              },
              data: nodeData
            };
          });

          // Create edges from flow step connections if they exist
          const flowEdges = [];
          appFlowSteps.forEach(step => {
            const styling = step.styling as Record<string, any> || {};
            const connections = styling?.connections || [];
                               
            if (connections && Array.isArray(connections)) {
              connections.forEach((connection: any) => {
                flowEdges.push({
                  id: `e-${step.id}-${connection.target}`,
                  source: step.id,
                  target: connection.target,
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                  },
                  animated: true,
                  style: { stroke: '#9b87f5' },
                });
              });
            }
          });

          setNodes(flowNodes.length > 0 ? flowNodes : initialNodes);
          setEdges(flowEdges);
        }
      } catch (error) {
        console.error('Error loading flow:', error);
        toast({
          title: "Error loading flow",
          description: "Could not load flow data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchFlowData();
  }, [id, user]);
  
  // Convert complex objects to JSON-serializable format
  const prepareStepStylingForSave = (node: AppNode) => {
    // Extract connections for this node
    const nodeConnections = edges
      .filter(edge => edge.source === node.id)
      .map(edge => ({
        target: edge.target,
        condition: edge.data?.condition
      }));
    
    // Create a new styling object that is JSON serializable
    return {
      position_x: node.position.x,
      position_y: node.position.y,
      connections: nodeConnections,
      background: node.data.styling?.background || 'bg-white',
      border: node.data.styling?.border || 'border-purple-200',
      textColor: node.data.styling?.textColor || 'text-foreground',
      // Convert complex objects to JSON-serializable format
      milestones: convertMilestonesToJson(node.data.milestones || []),
      actions: convertStepActionsToJson(node.data.actions || [])
    };
  };
  
  // Handle saving flow
  const saveFlow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save flows",
        variant: "destructive"
      });
      return;
    }
    
    if (!flowName.trim()) {
      toast({
        title: "Flow name required",
        description: "Please provide a name for your flow",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    
    try {
      // Create or update the flow
      let flowId = id;
      
      if (!flowId || flowId === 'new' || flowId === ':id') {
        // Create a new flow
        const { data: newFlow, error: flowError } = await supabase
          .from('flows')
          .insert({
            name: flowName,
            title: flowName,
            description: flowDescription,
            status: 'draft',
            is_draft: true,
            is_active: false,
            user_id: user.id,
            version: 1,
            branding_config: {
              logo_url: '/placeholder.svg',
              primary_color: '#9b87f5',
              secondary_color: '#7e69ab',
              background_style: 'gradient',
              background_gradient: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
              card_style: 'rounded',
              font_family: 'Inter, sans-serif',
            }
          })
          .select();
        
        if (flowError) throw flowError;
        
        flowId = newFlow[0].id;
        setFlow(newFlow[0]);
        
        // Update the URL to the new flow ID
        navigate(`/builder/${flowId}`, { replace: true });
      } else {
        // Update existing flow
        const { error: updateError } = await supabase
          .from('flows')
          .update({
            name: flowName,
            title: flowName,
            description: flowDescription,
            updated_at: new Date().toISOString()
          })
          .eq('id', flowId);
        
        if (updateError) throw updateError;
      }

      // Delete existing steps for this flow (to be replaced)
      if (flowId !== 'new' && flowId !== ':id') {
        const { error: deleteError } = await supabase
          .from('flow_steps')
          .delete()
          .eq('flow_id', flowId);
        
        if (deleteError) throw deleteError;
      }
      
      // Prepare steps for saving - convert complex objects to JSON-serializable format
      const flowStepsToSave = nodes.map((node, index) => {
        return {
          id: node.id, // Using the UUID generated at node creation
          flow_id: flowId,
          title: node.data.label || `Step ${index + 1}`,
          content: node.data.content || '',
          step_type: node.type,
          position: index,
          dom_selector: node.data.dom_selector || '',
          page_url: node.data.page_url || '',
          styling: prepareStepStylingForSave(node),
          targeting_rules: node.data.targeting_rules || {}
        };
      });
      
      // Save all steps one by one to avoid array serialization issues
      for (const step of flowStepsToSave) {
        const { error: stepError } = await supabase
          .from('flow_steps')
          .insert(step);
        
        if (stepError) {
          console.error('Error saving step:', stepError, step);
          throw stepError;
        }
      }

      // Open the preview in a new tab after saving
      const previewUrl = `/flow/${flowId}/preview`;
      window.open(previewUrl, '_blank');
      
      toast({
        title: "Flow saved",
        description: "Your flow has been saved successfully"
      });
      
    } catch (error) {
      console.error('Error saving flow:', error);
      toast({
        title: "Error saving flow",
        description: "Could not save flow data. Make sure node IDs are valid UUIDs.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Update node data when edited in config panel
  const updateNodeData = (nodeId, newData) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, data: { ...node.data, ...newData } };
      }
      return node;
    }));
  };

  // Delete a node
  const deleteNode = (nodeId) => {
    // Remove any edges connected to this node
    setEdges(edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    
    // Remove the node
    setNodes(nodes.filter(node => node.id !== nodeId));
    
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
      setIsEditorModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading your flow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
      <EnhancedToolbar 
        flowName={flowName} 
        onFlowNameChange={setFlowName} 
        onSave={saveFlow}
        saving={saving}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <EnhancedSidebar 
          flowDescription={flowDescription}
          onFlowDescriptionChange={setFlowDescription}
          onSave={saveFlow}
          saving={saving}
        />
        
        {/* Main flow editor */}
        <div className="flex-1 overflow-hidden relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            snapToGrid={true}
            snapGrid={[15, 15]}
            className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Controls 
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg"
            />
            <MiniMap 
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg"
              nodeColor="#9b87f5"
              maskColor="rgba(155, 135, 245, 0.1)"
            />
            <Background 
              gap={20} 
              size={1} 
              color="#e2e8f0"
              style={{ opacity: 0.5 }}
            />
            
            <Panel position="top-right" className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Node editor modal */}
      {selectedNode && (
        <NodeEditorModal 
          node={selectedNode}
          isOpen={isEditorModalOpen}
          onClose={() => setIsEditorModalOpen(false)}
          updateNodeData={(data) => {
            setNodes(nodes.map(node => {
              if (node.id === selectedNode.id) {
                return { ...node, data: { ...node.data, ...data } };
              }
              return node;
            }));
          }}
          deleteNode={(nodeId) => {
            setEdges(edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
            setNodes(nodes.filter(node => node.id !== nodeId));
            if (selectedNode && selectedNode.id === nodeId) {
              setSelectedNode(null);
              setIsEditorModalOpen(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default FlowBuilder;
