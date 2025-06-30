
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Rocket, 
  Lightbulb, 
  FormInput, 
  Target, 
  Check, 
  Route, 
  Video, 
  Timer, 
  PersonStanding, 
  MessageSquare,
  Sparkles,
  Loader2,
  Palette,
  Settings,
  Layers,
  Zap,
  Users,
  Clock
} from 'lucide-react';

interface EnhancedSidebarProps {
  flowDescription: string;
  onFlowDescriptionChange: (desc: string) => void;
  onSave: () => void;
  saving: boolean;
}

const nodeCategories = [
  {
    title: "Onboarding",
    icon: Rocket,
    color: "bg-blue-50 border-blue-200 text-blue-700",
    nodes: [
      { type: 'modal', label: 'Welcome Screen', icon: Rocket, description: 'Start user journey' },
      { type: 'modal', label: 'User Survey', icon: FormInput, description: 'Collect user data' },
      { type: 'modal', label: 'User Persona Path', icon: PersonStanding, description: 'Personalized experience' },
    ]
  },
  {
    title: "Guidance",
    icon: Lightbulb,
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    nodes: [
      { type: 'tooltip', label: 'Feature Tooltip', icon: Lightbulb, description: 'Highlight features' },
      { type: 'hotspot', label: 'Feature Highlight', icon: Target, description: 'Draw attention' },
      { type: 'modal', label: 'Tutorial Video', icon: Video, description: 'Visual learning' },
    ]
  },
  {
    title: "Interaction",
    icon: Users,
    color: "bg-green-50 border-green-200 text-green-700",
    nodes: [
      { type: 'checklist', label: 'Progress Checklist', icon: Check, description: 'Track completion' },
      { type: 'modal', label: 'Chat Assistance', icon: MessageSquare, description: 'Help users' },
      { type: 'branch', label: 'User Path Decision', icon: Route, description: 'Conditional flows' },
    ]
  },
  {
    title: "Automation",
    icon: Zap,
    color: "bg-purple-50 border-purple-200 text-purple-700",
    nodes: [
      { type: 'delay', label: 'Time Delay', icon: Timer, description: 'Timed actions' },
    ]
  }
];

export function EnhancedSidebar({ 
  flowDescription, 
  onFlowDescriptionChange, 
  onSave, 
  saving 
}: EnhancedSidebarProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNodes = nodeCategories.map(category => ({
    ...category,
    nodes: category.nodes.filter(node => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.nodes.length > 0);

  return (
    <div className="w-80 border-r bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex flex-col h-full">
      <div className="p-4 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Flow Builder
          </h3>
        </div>
        
        <Input
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Node Categories */}
          <div className="space-y-4 mb-6">
            {filteredNodes.map((category, idx) => (
              <Card key={idx} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardHeader 
                  className={`pb-3 cursor-pointer ${category.color}`}
                  onClick={() => setActiveCategory(activeCategory === idx ? -1 : idx)}
                >
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    {category.title}
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {category.nodes.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                {activeCategory === idx && (
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {category.nodes.map((node, nodeIdx) => (
                        <div
                          key={nodeIdx}
                          className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-b-0 transition-colors"
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.setData('application/reactflow/type', node.type);
                            event.dataTransfer.setData('application/reactflow/label', node.label);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center shrink-0">
                              <node.icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                {node.label}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {node.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Flow Settings */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Flow Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="flowDescription" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Description
                </Label>
                <Textarea 
                  id="flowDescription" 
                  value={flowDescription} 
                  onChange={(e) => onFlowDescriptionChange(e.target.value)}
                  placeholder="Describe your flow..."
                  className="mt-1 h-20 text-sm resize-none"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="publishToggle" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Publish Flow
                  </Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Make flow live</p>
                </div>
                <Switch id="publishToggle" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="flowVersion" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Version
                </Label>
                <Select defaultValue="1">
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Version 1 (Current)</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <Button 
          onClick={onSave} 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {saving ? "Saving..." : "Save & Preview Flow"}
        </Button>
      </div>
    </div>
  );
}
