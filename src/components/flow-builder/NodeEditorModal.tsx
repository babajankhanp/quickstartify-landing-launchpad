
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
import { ImageIcon, Link, Plus, Trash2 } from "lucide-react";
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

export function NodeEditorModal({ node, updateNodeData, isOpen, onClose, deleteNode }) {
  const [label, setLabel] = useState(node?.data?.label || '');
  const [content, setContent] = useState(node?.data?.content || '');
  const [formFields, setFormFields] = useState<FormFieldType[]>(node?.data?.formFields || []);
  
  const handleSave = () => {
    updateNodeData({ 
      label, 
      content,
      formFields
    });
    onClose();
  };

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
            <TabsTrigger value="form" className="flex-1">Form Schema</TabsTrigger>
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
