
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
import { ImageIcon, Link, Plus, Trash2, CheckSquare, FileText } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

type FormFieldType = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  validation: string;
  placeholder: string;
};

type MilestoneType = {
  id: string;
  title: string;
  subtitle: string;
  formFields: FormFieldType[];
};

type ActionButtonType = {
  id: string;
  label: string;
  action: string;
  apiEndpoint: string;
  collectMetrics: boolean;
};

export function NodeEditorModal({ node, updateNodeData, isOpen, onClose, deleteNode }) {
  const [label, setLabel] = useState(node?.data?.label || '');
  const [content, setContent] = useState(node?.data?.content || '');
  const [formFields, setFormFields] = useState<FormFieldType[]>(node?.data?.formFields || []);
  const [milestones, setMilestones] = useState<MilestoneType[]>(node?.data?.milestones || []);
  const [actionButtons, setActionButtons] = useState<ActionButtonType[]>(node?.data?.actionButtons || []);
  const [collectMetrics, setCollectMetrics] = useState(node?.data?.collectMetrics || false);
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null);
  
  const handleSave = () => {
    updateNodeData({ 
      label, 
      content,
      formFields,
      milestones,
      actionButtons,
      collectMetrics
    });
    onClose();
  };

  // Form Fields Management
  const addFormField = () => {
    const newField = {
      id: `field-${Date.now()}`,
      name: `Field ${formFields.length + 1}`,
      type: 'text',
      required: false,
      validation: '',
      placeholder: 'Enter value',
    };
    setFormFields([...formFields, newField]);
  };

  const updateFormField = (index: number, field: Partial<FormFieldType>) => {
    const updatedFields = [...formFields];
    updatedFields[index] = { ...updatedFields[index], ...field };
    setFormFields(updatedFields);
  };

  const removeFormField = (index: number) => {
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
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

  // Milestone Form Fields Management
  const addMilestoneFormField = (milestoneIndex: number) => {
    const milestone = milestones[milestoneIndex];
    const newField = {
      id: `field-${Date.now()}`,
      name: `Field ${milestone.formFields.length + 1}`,
      type: 'text',
      required: false,
      validation: '',
      placeholder: 'Enter value',
    };
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

  // Action Buttons Management
  const addActionButton = () => {
    const newButton = {
      id: `action-${Date.now()}`,
      label: `Button ${actionButtons.length + 1}`,
      action: 'next',
      apiEndpoint: '',
      collectMetrics: true,
    };
    setActionButtons([...actionButtons, newButton]);
  };

  const updateActionButton = (index: number, button: Partial<ActionButtonType>) => {
    const updatedButtons = [...actionButtons];
    updatedButtons[index] = { ...updatedButtons[index], ...button };
    setActionButtons(updatedButtons);
  };

  const removeActionButton = (index: number) => {
    const updatedButtons = [...actionButtons];
    updatedButtons.splice(index, 1);
    setActionButtons(updatedButtons);
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
            <TabsTrigger value="form" className="flex-1">Form Schema</TabsTrigger>
            <TabsTrigger value="actions" className="flex-1">Actions</TabsTrigger>
            <TabsTrigger value="styling" className="flex-1">Styling</TabsTrigger>
            <TabsTrigger value="targeting" className="flex-1">Targeting</TabsTrigger>
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
              <Textarea 
                id="nodeContent" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter content"
                rows={6}
              />
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
                      <div className="p-3 border rounded-md space-y-3 mt-4">
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
                          
                          <div className="pt-2">
                            <div className="flex justify-between items-center mb-3">
                              <Label className="text-sm font-medium">Form Fields</Label>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => addMilestoneFormField(milestoneIndex)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Field
                              </Button>
                            </div>
                            
                            {milestone.formFields.length === 0 ? (
                              <div className="text-center py-4 text-xs text-muted-foreground border rounded-md">
                                No form fields added to this milestone yet
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {milestone.formFields.map((field, fieldIndex) => (
                                  <div key={field.id} className="p-2 border rounded-md space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-medium">{field.name}</span>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="h-6 w-6 text-destructive"
                                        onClick={() => removeMilestoneFormField(milestoneIndex, fieldIndex)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    
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
                                            <SelectItem value="select">Select</SelectItem>
                                            <SelectItem value="checkbox">Checkbox</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div className="flex items-center space-x-2 pt-1">
                                        <Switch 
                                          id={`milestone-field-required-${fieldIndex}`}
                                          checked={field.required}
                                          onCheckedChange={(checked) => updateMilestoneFormField(milestoneIndex, fieldIndex, { required: checked })}
                                        />
                                        <Label htmlFor={`milestone-field-required-${fieldIndex}`} className="text-xs">Required</Label>
                                      </div>
                                    </div>
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
          
          <TabsContent value="form" className="space-y-4 pt-4">
            <Card className="p-4 bg-muted/30">
              <Label className="text-lg font-medium mb-4 block">Form Fields</Label>
              
              {formFields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No form fields added yet. Add your first field below.
                </div>
              ) : (
                <div className="space-y-6">
                  {formFields.map((field, index) => (
                    <div key={field.id} className="p-3 border rounded-md space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Field {index + 1}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeFormField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`field-name-${index}`}>Name</Label>
                          <Input
                            id={`field-name-${index}`}
                            value={field.name}
                            onChange={(e) => updateFormField(index, { name: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`field-type-${index}`}>Field Type</Label>
                          <Select 
                            value={field.type} 
                            onValueChange={(value) => updateFormField(index, { type: value })}
                          >
                            <SelectTrigger id={`field-type-${index}`}>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="select">Select</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`field-placeholder-${index}`}>Placeholder</Label>
                          <Input
                            id={`field-placeholder-${index}`}
                            value={field.placeholder}
                            onChange={(e) => updateFormField(index, { placeholder: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`field-validation-${index}`}>Validation</Label>
                          <Input
                            id={`field-validation-${index}`}
                            value={field.validation}
                            onChange={(e) => updateFormField(index, { validation: e.target.value })}
                            placeholder="regex pattern or rules"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-4">
                          <Switch 
                            id={`field-required-${index}`}
                            checked={field.required}
                            onCheckedChange={(checked) => updateFormField(index, { required: checked })}
                          />
                          <Label htmlFor={`field-required-${index}`}>Required field</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={addFormField}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Form Field
              </Button>
            </Card>
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-4 pt-4">
            <Card className="p-4 bg-muted/30">
              <Label className="text-lg font-medium mb-4 block">Action Buttons</Label>
              
              {actionButtons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No action buttons added yet. Add your first button below.
                </div>
              ) : (
                <div className="space-y-6">
                  {actionButtons.map((button, index) => (
                    <div key={button.id} className="p-3 border rounded-md space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{button.label}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeActionButton(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor={`action-label-${index}`}>Button Label</Label>
                          <Input
                            id={`action-label-${index}`}
                            value={button.label}
                            onChange={(e) => updateActionButton(index, { label: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`action-type-${index}`}>Action Type</Label>
                          <Select 
                            value={button.action} 
                            onValueChange={(value) => updateActionButton(index, { action: value })}
                          >
                            <SelectTrigger id={`action-type-${index}`}>
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
                        
                        {button.action === 'api' && (
                          <div className="space-y-1 col-span-2">
                            <Label htmlFor={`api-endpoint-${index}`}>API Endpoint</Label>
                            <Input
                              id={`api-endpoint-${index}`}
                              value={button.apiEndpoint}
                              onChange={(e) => updateActionButton(index, { apiEndpoint: e.target.value })}
                              placeholder="https://api.example.com/endpoint"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 pt-4 col-span-2">
                          <Switch 
                            id={`button-metrics-${index}`}
                            checked={button.collectMetrics}
                            onCheckedChange={(checked) => updateActionButton(index, { collectMetrics: checked })}
                          />
                          <div>
                            <Label htmlFor={`button-metrics-${index}`}>Collect Metrics</Label>
                            <p className="text-xs text-muted-foreground">Track when users click this button</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={addActionButton}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Action Button
              </Button>
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
          
          <TabsContent value="targeting" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="targetSelector">Target Element</Label>
              <Input 
                id="targetSelector" 
                placeholder="#welcome-button, .main-nav"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetPage">Target Page</Label>
              <Input 
                id="targetPage" 
                placeholder="/dashboard"
              />
            </div>
            
            <Card className="p-4 mt-4 bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
              <p className="text-xs">
                Click "Preview" to visually select elements from your site to use as targets.
              </p>
            </Card>
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
