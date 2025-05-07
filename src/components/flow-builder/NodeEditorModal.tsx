
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Link, Plus, Trash2, CheckSquare, FileText, Send, BarChart, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor, RichTextPreview } from "@/components/ui/rich-text-editor";

type FormFieldType = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  validation: string;
  placeholder: string;
  richTextContent?: string;
  isButton?: boolean;
  buttonAction?: string;
  buttonApiEndpoint?: string;
  buttonCollectMetrics?: boolean;
  buttonLabel?: string;
};

type MilestoneType = {
  id: string;
  title: string;
  subtitle: string;
  formFields: FormFieldType[];
};

type ActionType = {
  id: string;
  type: 'api_call' | 'analytics' | 'navigation' | 'custom';
  name: string;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  payload?: Record<string, any>;
  trigger?: 'on_view' | 'on_complete' | 'on_skip' | 'on_button_click';
  button_id?: string;
};

export function NodeEditorModal({ node, updateNodeData, isOpen, onClose, deleteNode }) {
  const [label, setLabel] = useState(node?.data?.label || '');
  const [content, setContent] = useState(node?.data?.content || '');
  const [milestones, setMilestones] = useState<MilestoneType[]>(node?.data?.milestones || []);
  const [actions, setActions] = useState<ActionType[]>(node?.data?.actions || []);
  const [collectMetrics, setCollectMetrics] = useState(node?.data?.collectMetrics || false);
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null);
  
  // Handle clicks outside of milestones modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMilestone && !document.querySelector('.milestone-editor')?.contains(event.target as Node)) {
        // Auto-save milestone data when clicking outside
        // This is handled by the existing state already
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMilestone]);

  const handleSave = () => {
    updateNodeData({ 
      label, 
      content,
      milestones,
      actions,
      collectMetrics
    });
    onClose();
  };

  // Milestones Management
  const addMilestone = () => {
    const newMilestone = {
      id: `milestone-${Date.now()}`,
      title: `Milestone ${milestones.length + 1}`,
      subtitle: '',
      formFields: [],
    };
    setMilestones([...milestones, newMilestone]);
    setActiveMilestone(newMilestone.id);
  };

  const updateMilestone = (index: number, milestone: Partial<MilestoneType>) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], ...milestone };
    setMilestones(updatedMilestones);
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = [...milestones];
    updatedMilestones.splice(index, 1);
    setMilestones(updatedMilestones);
    setActiveMilestone(null);
  };

  // Actions Management
  const addAction = () => {
    const newAction = {
      id: `action-${Date.now()}`,
      type: 'api_call' as const,
      name: `Action ${actions.length + 1}`,
      trigger: 'on_view' as const
    };
    setActions([...actions, newAction]);
  };

  const updateAction = (index: number, action: Partial<ActionType>) => {
    const updatedActions = [...actions];
    updatedActions[index] = { ...updatedActions[index], ...action };
    setActions(updatedActions);
  };

  const removeAction = (index: number) => {
    const updatedActions = [...actions];
    updatedActions.splice(index, 1);
    setActions(updatedActions);
  };

  // Milestone Form Fields Management
  const addMilestoneFormField = (milestoneIndex: number, isButton: boolean = false) => {
    const milestone = milestones[milestoneIndex];
    let newField: FormFieldType;
    
    if (isButton) {
      newField = {
        id: `button-${Date.now()}`,
        name: `Button ${milestone.formFields.filter(f => f.isButton).length + 1}`,
        type: 'button',
        required: false,
        validation: '',
        placeholder: '',
        isButton: true,
        buttonLabel: `Button ${milestone.formFields.filter(f => f.isButton).length + 1}`,
        buttonAction: 'next',
        buttonApiEndpoint: '',
        buttonCollectMetrics: true,
      };
    } else {
      newField = {
        id: `field-${Date.now()}`,
        name: `Field ${milestone.formFields.filter(f => !f.isButton).length + 1}`,
        type: 'text',
        required: false,
        validation: '',
        placeholder: 'Enter value',
        isButton: false,
      };
    }
    
    const updatedFormFields = [...milestone.formFields, newField];
    updateMilestone(milestoneIndex, { formFields: updatedFormFields });
  };

  const updateMilestoneFormField = (milestoneIndex: number, fieldIndex: number, field: Partial<FormFieldType>) => {
    const milestone = milestones[milestoneIndex];
    const updatedFields = [...milestone.formFields];
    updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], ...field };
    updateMilestone(milestoneIndex, { formFields: updatedFields });
  };

  const removeMilestoneFormField = (milestoneIndex: number, fieldIndex: number) => {
    const milestone = milestones[milestoneIndex];
    const updatedFields = [...milestone.formFields];
    updatedFields.splice(fieldIndex, 1);
    updateMilestone(milestoneIndex, { formFields: updatedFields });
  };

  // Move field up or down in the milestone
  const moveFieldUp = (milestoneIndex: number, fieldIndex: number) => {
    if (fieldIndex === 0) return;
    
    const milestone = milestones[milestoneIndex];
    const updatedFields = [...milestone.formFields];
    const temp = updatedFields[fieldIndex];
    updatedFields[fieldIndex] = updatedFields[fieldIndex - 1];
    updatedFields[fieldIndex - 1] = temp;
    
    updateMilestone(milestoneIndex, { formFields: updatedFields });
  };

  const moveFieldDown = (milestoneIndex: number, fieldIndex: number) => {
    const milestone = milestones[milestoneIndex];
    if (fieldIndex === milestone.formFields.length - 1) return;
    
    const updatedFields = [...milestone.formFields];
    const temp = updatedFields[fieldIndex];
    updatedFields[fieldIndex] = updatedFields[fieldIndex + 1];
    updatedFields[fieldIndex + 1] = temp;
    
    updateMilestone(milestoneIndex, { formFields: updatedFields });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {node?.type} Node</DialogTitle>
          <DialogDescription>
            Customize this node's content and behavior
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
            <TabsTrigger value="milestones" className="flex-1">Milestones</TabsTrigger>
            <TabsTrigger value="actions" className="flex-1">Actions</TabsTrigger>
            <TabsTrigger value="styling" className="flex-1">Styling</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="nodeLabel">Node Label</Label>
              <Input 
                id="nodeLabel" 
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter node label"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nodeContent">Content</Label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Enter rich content"
              />
              {content && (
                <div className="mt-2">
                  <Label className="text-sm mb-1 block">Preview</Label>
                  <RichTextPreview content={content} />
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Image
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Link className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>

            {milestones.length > 0 && (
              <div className="mt-4 p-3 border rounded-md">
                <h3 className="text-sm font-medium mb-2">Milestones Overview</h3>
                <div className="space-y-2">
                  {milestones.map((milestone, idx) => (
                    <div key={milestone.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{milestone.title}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-xs"
                        onClick={() => setActiveMilestone(milestone.id)}
                      >
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="collectMetrics">Collect Metrics</Label>
                  <p className="text-xs text-muted-foreground">
                    Track user engagement with this node
                  </p>
                </div>
                <Switch 
                  id="collectMetrics"
                  checked={collectMetrics}
                  onCheckedChange={(checked) => setCollectMetrics(checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4 pt-4">
            <Card className="p-4 bg-muted/30">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-lg font-medium">Milestones</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={addMilestone}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>
              
              {milestones.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No milestones added yet. Add your first milestone to break down complex onboarding flows.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    {milestones.map((milestone, index) => (
                      <Button
                        key={milestone.id}
                        variant={activeMilestone === milestone.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveMilestone(milestone.id)}
                      >
                        {milestone.title}
                      </Button>
                    ))}
                  </div>
                  
                  {activeMilestone && (() => {
                    const milestoneIndex = milestones.findIndex(m => m.id === activeMilestone);
                    if (milestoneIndex === -1) return null;
                    
                    const milestone = milestones[milestoneIndex];
                    return (
                      <div className="p-3 border rounded-md space-y-3 mt-4 milestone-editor">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Edit Milestone</h4>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeMilestone(milestoneIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="milestone-title">Title</Label>
                            <Input
                              id="milestone-title"
                              value={milestone.title}
                              onChange={(e) => updateMilestone(milestoneIndex, { title: e.target.value })}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="milestone-subtitle">Subtitle</Label>
                            <Input
                              id="milestone-subtitle"
                              value={milestone.subtitle}
                              onChange={(e) => updateMilestone(milestoneIndex, { subtitle: e.target.value })}
                            />
                          </div>
                          
                          {/* Milestone Form Fields and Action Buttons Section Combined */}
                          <div className="pt-2">
                            <div className="flex justify-between items-center mb-3">
                              <Label className="text-sm font-medium">Form Fields & Actions</Label>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => addMilestoneFormField(milestoneIndex)}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Field
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => addMilestoneFormField(milestoneIndex, true)}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Button
                                </Button>
                              </div>
                            </div>
                            
                            {milestone.formFields.length === 0 ? (
                              <div className="text-center py-4 text-xs text-muted-foreground border rounded-md">
                                No fields or buttons added to this milestone yet
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {milestone.formFields.map((field, fieldIndex) => (
                                  <div key={field.id} className="p-2 border rounded-md space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-medium">
                                        {field.isButton ? `Button: ${field.buttonLabel || field.name}` : `Field: ${field.name}`}
                                      </span>
                                      <div className="flex items-center">
                                        {/* Field ordering buttons */}
                                        <Button 
                                          variant="ghost" 
                                          size="icon"
                                          className="h-6 w-6"
                                          onClick={() => moveFieldUp(milestoneIndex, fieldIndex)}
                                          disabled={fieldIndex === 0}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="icon"
                                          className="h-6 w-6"
                                          onClick={() => moveFieldDown(milestoneIndex, fieldIndex)}
                                          disabled={fieldIndex === milestone.formFields.length - 1}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="icon"
                                          className="h-6 w-6 text-destructive"
                                          onClick={() => removeMilestoneFormField(milestoneIndex, fieldIndex)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    {field.isButton ? (
                                      // Button Configuration
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <Label htmlFor={`milestone-button-label-${fieldIndex}`} className="text-xs">Button Label</Label>
                                          <Input
                                            id={`milestone-button-label-${fieldIndex}`}
                                            value={field.buttonLabel}
                                            className="h-8 text-xs"
                                            onChange={(e) => updateMilestoneFormField(milestoneIndex, fieldIndex, { buttonLabel: e.target.value })}
                                          />
                                        </div>
                                        
                                        <div>
                                          <Label htmlFor={`milestone-button-action-${fieldIndex}`} className="text-xs">Action</Label>
                                          <Select 
                                            value={field.buttonAction} 
                                            onValueChange={(value) => updateMilestoneFormField(milestoneIndex, fieldIndex, { buttonAction: value })}
                                          >
                                            <SelectTrigger id={`milestone-button-action-${fieldIndex}`} className="h-8">
                                              <SelectValue placeholder="Select action" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="next">Next Step</SelectItem>
                                              <SelectItem value="previous">Previous Step</SelectItem>
                                              <SelectItem value="skip">Skip</SelectItem>
                                              <SelectItem value="complete">Complete</SelectItem>
                                              <SelectItem value="api">API Call</SelectItem>
                                              <SelectItem value="url">Open URL</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        
                                        {field.buttonAction === 'api' && (
                                          <div className="col-span-2">
                                            <Label htmlFor={`milestone-api-endpoint-${fieldIndex}`} className="text-xs">API Endpoint</Label>
                                            <Input
                                              id={`milestone-api-endpoint-${fieldIndex}`}
                                              value={field.buttonApiEndpoint}
                                              className="h-8 text-xs"
                                              onChange={(e) => updateMilestoneFormField(milestoneIndex, fieldIndex, { buttonApiEndpoint: e.target.value })}
                                              placeholder="https://api.example.com/endpoint"
                                            />
                                          </div>
                                        )}
                                        
                                        <div className="flex items-center space-x-2 pt-1 col-span-2">
                                          <Switch 
                                            id={`milestone-button-metrics-${fieldIndex}`}
                                            checked={field.buttonCollectMetrics}
                                            onCheckedChange={(checked) => updateMilestoneFormField(milestoneIndex, fieldIndex, { buttonCollectMetrics: checked })}
                                          />
                                          <div>
                                            <Label htmlFor={`milestone-button-metrics-${fieldIndex}`} className="text-xs">Collect Metrics</Label>
                                            <p className="text-xs text-muted-foreground">Track when users click this button</p>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      // Form Field Configuration
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <Label htmlFor={`milestone-field-name-${fieldIndex}`} className="text-xs">Name</Label>
                                          <Input
                                            id={`milestone-field-name-${fieldIndex}`}
                                            value={field.name}
                                            className="h-8 text-xs"
                                            onChange={(e) => updateMilestoneFormField(milestoneIndex, fieldIndex, { name: e.target.value })}
                                          />
                                        </div>
                                        
                                        <div>
                                          <Label htmlFor={`milestone-field-type-${fieldIndex}`} className="text-xs">Type</Label>
                                          <Select 
                                            value={field.type} 
                                            onValueChange={(value) => updateMilestoneFormField(milestoneIndex, fieldIndex, { type: value })}
                                          >
                                            <SelectTrigger id={`milestone-field-type-${fieldIndex}`} className="h-8">
                                              <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="text">Text</SelectItem>
                                              <SelectItem value="email">Email</SelectItem>
                                              <SelectItem value="number">Number</SelectItem>
                                              <SelectItem value="textarea">Textarea</SelectItem>
                                              <SelectItem value="richtext">Rich Text</SelectItem>
                                              <SelectItem value="select">Select</SelectItem>
                                              <SelectItem value="checkbox">Checkbox</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        
                                        {field.type === 'richtext' && (
                                          <div className="col-span-2">
                                            <Label htmlFor={`milestone-field-richtext-${fieldIndex}`} className="text-xs">Rich Text Content</Label>
                                            <RichTextEditor
                                              value={field.richTextContent || ''}
                                              onChange={(content) => updateMilestoneFormField(milestoneIndex, fieldIndex, { richTextContent: content })}
                                              placeholder="Enter rich content"
                                            />
                                            {field.richTextContent && (
                                              <div className="mt-2">
                                                <Label className="text-xs mb-1 block">Preview</Label>
                                                <RichTextPreview content={field.richTextContent} />
                                              </div>
                                            )}
                                          </div>
                                        )}
                                        
                                        <div>
                                          <Label htmlFor={`milestone-field-placeholder-${fieldIndex}`} className="text-xs">Placeholder</Label>
                                          <Input
                                            id={`milestone-field-placeholder-${fieldIndex}`}
                                            value={field.placeholder}
                                            className="h-8 text-xs"
                                            onChange={(e) => updateMilestoneFormField(milestoneIndex, fieldIndex, { placeholder: e.target.value })}
                                          />
                                        </div>
                                        
                                        <div>
                                          <Label htmlFor={`milestone-field-validation-${fieldIndex}`} className="text-xs">Validation</Label>
                                          <Input
                                            id={`milestone-field-validation-${fieldIndex}`}
                                            value={field.validation}
                                            className="h-8 text-xs"
                                            onChange={(e) => updateMilestoneFormField(milestoneIndex, fieldIndex, { validation: e.target.value })}
                                            placeholder="regex pattern or rules"
                                          />
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 pt-1">
                                          <Switch 
                                            id={`milestone-field-required-${fieldIndex}`}
                                            checked={field.required}
                                            onCheckedChange={(checked) => updateMilestoneFormField(milestoneIndex, fieldIndex, { required: checked })}
                                          />
                                          <Label htmlFor={`milestone-field-required-${fieldIndex}`} className="text-xs">Required field</Label>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-4 pt-4">
            <Card className="p-4 bg-muted/30">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-lg font-medium">Step Actions</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={addAction}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Action
                </Button>
              </div>
              
              {actions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No actions added yet. Actions allow your steps to communicate with external systems.
                </div>
              ) : (
                <div className="space-y-4">
                  {actions.map((action, index) => (
                    <Card key={action.id} className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          {action.type === 'api_call' && <Send className="h-4 w-4 mr-2" />}
                          {action.type === 'analytics' && <BarChart className="h-4 w-4 mr-2" />}
                          {action.type === 'custom' && <Database className="h-4 w-4 mr-2" />}
                          <h4 className="font-medium">{action.name}</h4>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeAction(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`action-name-${index}`}>Name</Label>
                            <Input
                              id={`action-name-${index}`}
                              value={action.name}
                              onChange={(e) => updateAction(index, { name: e.target.value })}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`action-type-${index}`}>Action Type</Label>
                            <Select 
                              value={action.type} 
                              onValueChange={(value: any) => updateAction(index, { type: value })}
                            >
                              <SelectTrigger id={`action-type-${index}`}>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="api_call">API Call</SelectItem>
                                <SelectItem value="analytics">Analytics</SelectItem>
                                <SelectItem value="navigation">Navigation</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor={`action-trigger-${index}`}>Trigger</Label>
                            <Select 
                              value={action.trigger} 
                              onValueChange={(value: any) => updateAction(index, { trigger: value })}
                            >
                              <SelectTrigger id={`action-trigger-${index}`}>
                                <SelectValue placeholder="Select trigger" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="on_view">On View</SelectItem>
                                <SelectItem value="on_complete">On Complete</SelectItem>
                                <SelectItem value="on_skip">On Skip</SelectItem>
                                <SelectItem value="on_button_click">On Button Click</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {action.trigger === 'on_button_click' && (
                            <div>
                              <Label htmlFor={`action-button-${index}`}>Button ID</Label>
                              <Input
                                id={`action-button-${index}`}
                                value={action.button_id || ''}
                                onChange={(e) => updateAction(index, { button_id: e.target.value })}
                                placeholder="Enter button ID"
                              />
                            </div>
                          )}
                        </div>
                        
                        {action.type === 'api_call' && (
                          <div className="space-y-3 mt-2">
                            <div>
                              <Label htmlFor={`action-endpoint-${index}`}>API Endpoint</Label>
                              <Input
                                id={`action-endpoint-${index}`}
                                value={action.endpoint || ''}
                                onChange={(e) => updateAction(index, { endpoint: e.target.value })}
                                placeholder="https://api.example.com/endpoint"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`action-method-${index}`}>Method</Label>
                              <Select 
                                value={action.method || 'GET'} 
                                onValueChange={(value: any) => updateAction(index, { method: value })}
                              >
                                <SelectTrigger id={`action-method-${index}`}>
                                  <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="GET">GET</SelectItem>
                                  <SelectItem value="POST">POST</SelectItem>
                                  <SelectItem value="PUT">PUT</SelectItem>
                                  <SelectItem value="DELETE">DELETE</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor={`action-payload-${index}`}>Payload (JSON)</Label>
                              <Textarea
                                id={`action-payload-${index}`}
                                value={action.payload ? JSON.stringify(action.payload, null, 2) : ''}
                                onChange={(e) => {
                                  try {
                                    const payload = e.target.value ? JSON.parse(e.target.value) : {};
                                    updateAction(index, { payload });
                                  } catch (error) {
                                    // Invalid JSON, don't update
                                  }
                                }}
                                placeholder='{"key": "value"}'
                                className="font-mono text-xs"
                                rows={3}
                              />
                            </div>
                          </div>
                        )}
                        
                        {action.type === 'analytics' && (
                          <div className="space-y-3 mt-2">
                            <div className="flex items-center space-x-2">
                              <Switch 
                                id={`action-use-supabase-${index}`}
                                checked={!!action.endpoint?.includes('supabase')}
                                onCheckedChange={(checked) => updateAction(index, { endpoint: checked ? 'supabase' : '' })}
                              />
                              <Label htmlFor={`action-use-supabase-${index}`}>Use Supabase Analytics</Label>
                            </div>
                            
                            {!action.endpoint?.includes('supabase') && (
                              <div>
                                <Label htmlFor={`action-analytics-endpoint-${index}`}>Custom Analytics Endpoint</Label>
                                <Input
                                  id={`action-analytics-endpoint-${index}`}
                                  value={action.endpoint || ''}
                                  onChange={(e) => updateAction(index, { endpoint: e.target.value })}
                                  placeholder="https://analytics.example.com/event"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="styling" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex space-x-2">
                <Button size="sm" className="h-8 w-8 rounded-full bg-quickstartify-purple p-0" />
                <Button size="sm" className="h-8 w-8 rounded-full bg-blue-500 p-0" />
                <Button size="sm" className="h-8 w-8 rounded-full bg-green-500 p-0" />
                <Button size="sm" className="h-8 w-8 rounded-full bg-amber-500 p-0" />
                <Button size="sm" className="h-8 w-8 rounded-full bg-red-500 p-0" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex space-x-2">
                <Button size="sm" className="h-8 w-8 rounded-full bg-white border p-0" />
                <Button size="sm" className="h-8 w-8 rounded-full bg-black p-0" />
                <Button size="sm" className="h-8 w-8 rounded-full bg-gray-500 p-0" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">S</Button>
                <Button variant="outline" size="sm">M</Button>
                <Button variant="outline" size="sm">L</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between pt-6 space-x-4">
          {node && (
            <Button 
              variant="destructive"
              onClick={() => {
                deleteNode(node.id);
                onClose();
              }}
            >
              Delete Node
            </Button>
          )}
          
          <div className="flex space-x-2 ml-auto">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              className="bg-quickstartify-purple hover:bg-quickstartify-purple/90"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
