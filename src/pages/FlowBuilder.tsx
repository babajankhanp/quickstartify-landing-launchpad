
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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Save, 
  Undo2, 
  Redo2, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Grid, 
  Copy,
  Layers,
  MessageCircle,
  ImageIcon,
  Settings2,
  Database,
  TestTube,
  Clock,
  LayoutGrid,
  Loader2
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
import { FlowBuilderToolbar } from '@/components/flow-builder/FlowBuilderToolbar';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { Flow, FlowStep } from '@/integrations/supabase/models';

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

// Default flow initial nodes for new flows
const initialNodes = [
  {
    id: 'start',
    type: 'modal',
    position: { x: 250, y: 5 },
    data: { 
      label: 'Welcome Modal',
      content: 'Welcome to your onboarding flow!',
      milestones: [
        {
          id: 'welcome-milestone-1',
          title: 'Welcome',
          subtitle: 'Get started with our product',
          formFields: [
            {
              id: 'welcome-field-1',
              name: 'name',
              type: 'text',
              required: true,
              validation: '',
              placeholder: 'Enter your name',
              isButton: false
            },
            {
              id: 'welcome-button-1',
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
      ]
    },
  },
];

// Default flow initial edges
const initialEdges = [];

const FlowBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [flowName, setFlowName] = useState("My Onboarding Flow");
  const [flowDescription, setFlowDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flow, setFlow] = useState<Flow | null>(null);
  const [flowSteps, setFlowSteps] = useState<FlowStep[]>([]);
  
  // Handle node selection
  const onNodeClick = useCallback((_, node) => {
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
      
      // Generate a unique ID
      const newNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: { label, content: `New ${label} content` },
      };
      
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );
  
  // Load flow data from Supabase
  useEffect(() => {
    async function fetchFlowData() {
      if (!id || !user) {
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
        
        setFlow(flowData);
        setFlowName(flowData.title);
        setFlowDescription(flowData.description || "");
        
        // Fetch flow steps
        const { data: stepsData, error: stepsError } = await supabase
          .from('flow_steps')
          .select('*')
          .eq('flow_id', id)
          .order('position', { ascending: true });
        
        if (stepsError) throw stepsError;
        setFlowSteps(stepsData || []);
        
        if (stepsData && stepsData.length > 0) {
          // Convert flow steps to nodes and edges
          const flowNodes = stepsData.map(step => ({
            id: step.id,
            type: step.step_type,
            position: {
              x: (step.styling?.position_x || 0),
              y: (step.styling?.position_y || 0),
            },
            data: { 
              label: step.title,
              content: step.content,
              milestones: step.milestones || [],
              actions: step.actions || [],
              styling: step.styling || {},
              dom_selector: step.dom_selector,
              page_url: step.page_url,
              targeting_rules: step.targeting_rules
            }
          }));

          // Create edges from flow step connections if they exist
          const flowEdges = [];
          stepsData.forEach(step => {
            if (step.styling?.connections) {
              step.styling.connections.forEach(connection => {
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
      
      if (!flowId || flowId === 'new') {
        // Create a new flow
        const { data: newFlow, error: flowError } = await supabase
          .from('flows')
          .insert({
            title: flowName,
            description: flowDescription,
            is_draft: true,
            is_active: false,
            user_id: user.id,
            version: 1
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
            title: flowName,
            description: flowDescription,
            updated_at: new Date().toISOString()
          })
          .eq('id', flowId);
        
        if (updateError) throw updateError;
      }

      // Delete existing steps for this flow (to be replaced)
      if (flowId !== 'new') {
        const { error: deleteError } = await supabase
          .from('flow_steps')
          .delete()
          .eq('flow_id', flowId);
        
        if (deleteError) throw deleteError;
      }
      
      // Save all nodes as flow steps
      const flowSteps = nodes.map((node, index) => {
        // Extract connections for this node
        const nodeConnections = edges
          .filter(edge => edge.source === node.id)
          .map(edge => ({
            target: edge.target,
            condition: edge.data?.condition
          }));
        
        return {
          id: node.id,
          flow_id: flowId,
          title: node.data.label || `Step ${index + 1}`,
          content: node.data.content || null,
          step_type: node.type,
          position: index,
          dom_selector: node.data.dom_selector || null,
          page_url: node.data.page_url || null,
          milestones: node.data.milestones || [],
          actions: node.data.actions || [],
          styling: {
            ...node.data.styling,
            position_x: node.position.x,
            position_y: node.position.y,
            connections: nodeConnections
          },
          targeting_rules: node.data.targeting_rules || {}
        };
      });
      
      const { error: stepsError } = await supabase
        .from('flow_steps')
        .insert(flowSteps);
      
      if (stepsError) throw stepsError;
      
      toast({
        title: "Flow saved",
        description: "Your flow has been saved successfully"
      });
      
    } catch (error) {
      console.error('Error saving flow:', error);
      toast({
        title: "Error saving flow",
        description: "Could not save flow data",
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
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-quickstartify-purple" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <FlowBuilderToolbar 
        flowName={flowName} 
        onFlowNameChange={setFlowName} 
        onSave={saveFlow}
        saving={saving}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Node palette */}
        <div className="w-64 border-r p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">Flow Nodes</h3>
          
          <div className="grid gap-2">
            <div 
              className="flow-node-item tooltip-node" 
              draggable 
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow/type', 'tooltip');
                event.dataTransfer.setData('application/reactflow/label', 'Tooltip');
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Tooltip</span>
            </div>
            
            <div 
              className="flow-node-item modal-node" 
              draggable 
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow/type', 'modal');
                event.dataTransfer.setData('application/reactflow/label', 'Modal');
              }}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Modal</span>
            </div>
            
            <div 
              className="flow-node-item hotspot-node" 
              draggable 
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow/type', 'hotspot');
                event.dataTransfer.setData('application/reactflow/label', 'Hotspot');
              }}
            >
              <Layers className="h-4 w-4" />
              <span>Hotspot</span>
            </div>
            
            <div 
              className="flow-node-item checklist-node" 
              draggable 
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow/type', 'checklist');
                event.dataTransfer.setData('application/reactflow/label', 'Checklist');
              }}
            >
              <Copy className="h-4 w-4" />
              <span>Checklist</span>
            </div>
            
            <div 
              className="flow-node-item branch-node" 
              draggable 
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow/type', 'branch');
                event.dataTransfer.setData('application/reactflow/label', 'Branch');
              }}
            >
              <Grid className="h-4 w-4" />
              <span>Branch</span>
            </div>
            
            <div 
              className="flow-node-item delay-node" 
              draggable 
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow/type', 'delay');
                event.dataTransfer.setData('application/reactflow/label', 'Delay');
              }}
            >
              <Clock className="h-4 w-4" />
              <span>Delay</span>
            </div>
            
            <div 
              className="flow-node-item api-trigger-node" 
              draggable 
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow/type', 'apiTrigger');
                event.dataTransfer.setData('application/reactflow/label', 'API Trigger');
              }}
            >
              <Database className="h-4 w-4" />
              <span>API Trigger</span>
            </div>
            
            <div 
              className="flow-node-item ab-switch-node" 
              draggable 
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow/type', 'abSwitch');
                event.dataTransfer.setData('application/reactflow/label', 'A/B Test');
              }}
            >
              <TestTube className="h-4 w-4" />
              <span>A/B Switch</span>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Flow Settings</h3>
            
            <div>
              <Label htmlFor="flowDescription">Description</Label>
              <Textarea 
                id="flowDescription" 
                value={flowDescription} 
                onChange={(e) => setFlowDescription(e.target.value)}
                placeholder="Enter flow description"
                className="mt-1 h-24"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="publishToggle">Publish Flow</Label>
              <Switch id="publishToggle" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="flowVersion">Version</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Version 1 (Current)</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Main flow editor */}
        <div className="flex-1 overflow-hidden" ref={reactFlowWrapper}>
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
            className="bg-dot-pattern"
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={15} size={1} />
            
            <Panel position="top-right">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Redo2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={saving}
                  onClick={saveFlow}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </div>
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
          updateNodeData={(data) => updateNodeData(selectedNode.id, data)}
          deleteNode={deleteNode}
        />
      )}
    </div>
  );
};

export default FlowBuilder;
