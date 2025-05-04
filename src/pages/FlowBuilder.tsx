
import { useState, useCallback, useRef } from 'react';
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
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  LayoutGrid
} from 'lucide-react';
import { TooltipNode } from '@/components/flow-builder/nodes/TooltipNode';
import { ModalNode } from '@/components/flow-builder/nodes/ModalNode';
import { HotspotNode } from '@/components/flow-builder/nodes/HotspotNode';
import { ChecklistNode } from '@/components/flow-builder/nodes/ChecklistNode';
import { BranchNode } from '@/components/flow-builder/nodes/BranchNode';
import { DelayNode } from '@/components/flow-builder/nodes/DelayNode';
import { ApiTriggerNode } from '@/components/flow-builder/nodes/ApiTriggerNode';
import { ABSwitchNode } from '@/components/flow-builder/nodes/ABSwitchNode';
import { NodeConfigPanel } from '@/components/flow-builder/NodeConfigPanel';
import { FlowBuilderToolbar } from '@/components/flow-builder/FlowBuilderToolbar';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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

// Default flow initial nodes
const initialNodes = [
  {
    id: 'start',
    type: 'modal',
    position: { x: 250, y: 5 },
    data: { 
      label: 'Welcome Modal',
      content: 'Welcome to your onboarding flow!',
    },
  },
];

// Default flow initial edges
const initialEdges = [];

const FlowBuilder = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [flowName, setFlowName] = useState("My Onboarding Flow");
  const [isDragging, setIsDragging] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  // Handle node selection
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
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
  
  // Handle saving flow
  const saveFlow = () => {
    // Here you would save the flow data to your backend
    toast({
      title: "Flow Saved",
      description: "Your flow has been saved successfully",
    });
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
    setNodes(nodes.filter(node => node.id !== nodeId));
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <FlowBuilderToolbar 
        flowName={flowName} 
        onFlowNameChange={setFlowName} 
        onSave={saveFlow} 
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
            
            <div className="space-y-2">
              <Label htmlFor="flowTarget">Target Pages</Label>
              <Input 
                id="flowTarget"
                placeholder="/dashboard, /settings/*"
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
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4" onClick={saveFlow} />
                </Button>
              </div>
            </Panel>
          </ReactFlow>
        </div>
        
        {/* Node configuration panel */}
        {selectedNode && (
          <div className="w-80 border-l p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Node</h3>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => deleteNode(selectedNode.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <NodeConfigPanel 
              node={selectedNode} 
              updateNodeData={(data) => updateNodeData(selectedNode.id, data)} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowBuilder;
