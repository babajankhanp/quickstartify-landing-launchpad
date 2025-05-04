
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Play, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Flow, FlowStep } from "@/integrations/supabase/models";
import { useAuth } from "@/contexts/AuthContext";

const FlowEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = id === "new";
  
  const [flow, setFlow] = useState<Flow | null>(null);
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function fetchFlow() {
      if (isNew) return;
      
      try {
        // Fetch flow data
        const { data: flowData, error: flowError } = await supabase
          .from('flows')
          .select('*')
          .eq('id', id)
          .single();
        
        if (flowError) throw flowError;
        
        setFlow(flowData as Flow);
        setTitle(flowData.title);
        setDescription(flowData.description || "");
        
        // Fetch flow steps
        const { data: stepsData, error: stepsError } = await supabase
          .from('flow_steps')
          .select('*')
          .eq('flow_id', id)
          .order('position', { ascending: true });
        
        if (stepsError) throw stepsError;
        
        // Cast the step_type to the correct type
        const typedSteps = stepsData?.map(step => ({
          ...step,
          step_type: step.step_type as "tooltip" | "modal" | "hotspot" | "slideout" | "checklist"
        })) || [];
        
        setSteps(typedSteps as FlowStep[]);
      } catch (error: any) {
        toast({
          title: "Error loading flow",
          description: error.message,
          variant: "destructive",
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    
    fetchFlow();
  }, [id, isNew, navigate]);
  
  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Cannot save flow",
        description: "Please provide a title for your flow",
        variant: "destructive",
      });
      return;
    }
    
    try {
      let flowId = id;
      
      if (isNew) {
        // Create new flow
        const { data, error } = await supabase
          .from('flows')
          .insert({
            title, 
            description: description || null,
            is_draft: true,
            is_active: false,
            user_id: user!.id
          })
          .select();
          
        if (error) throw error;
        flowId = data[0].id;
        toast({
          title: "Flow created",
          description: "Your new flow has been created successfully",
        });
      } else {
        // Update existing flow
        const { error } = await supabase
          .from('flows')
          .update({ 
            title, 
            description: description || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
          
        if (error) throw error;
        toast({
          title: "Flow updated",
          description: "Your flow has been updated successfully",
        });
      }
      
      navigate(`/flow/${flowId}`);
    } catch (error: any) {
      toast({
        title: "Error saving flow",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-quickstartify-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">{isNew ? "Create New Flow" : "Edit Flow"}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Flow Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter flow title..."
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Enter flow description..."
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Flow Steps</h3>
                <Button size="sm" className="bg-quickstartify-purple hover:bg-quickstartify-purple/90">
                  <Plus className="h-4 w-4 mr-1" /> Add Step
                </Button>
              </div>
              
              {steps.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed">
                  <p className="text-muted-foreground mb-4">No steps added to this flow yet</p>
                  <Button size="sm" className="bg-quickstartify-purple hover:bg-quickstartify-purple/90">
                    <Plus className="h-4 w-4 mr-1" /> Add First Step
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {steps.map((step) => (
                    <div key={step.id} className="border rounded-md p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{step.title}</div>
                        <div className="text-xs text-muted-foreground">{step.step_type}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="icon" variant="outline" className="h-8 w-8">
                          <span className="sr-only">Edit</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="border rounded-lg p-4 sticky top-6">
            <h3 className="font-medium mb-4">Flow Settings</h3>
            <div className="space-y-4">
              <Button onClick={handleSave} className="w-full bg-quickstartify-purple hover:bg-quickstartify-purple/90">
                <Save className="mr-2 h-4 w-4" /> Save Flow
              </Button>
              
              {!isNew && (
                <>
                  <Button disabled={steps.length === 0} variant="outline" className="w-full">
                    <Play className="mr-2 h-4 w-4" /> Preview Flow
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Status</h4>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${flow?.is_active ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                      <span className="ml-2 text-sm">{flow?.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                    
                    <h4 className="text-sm font-medium mt-4 mb-2">Version</h4>
                    <div className="text-sm">{flow?.version || 1}</div>
                    
                    <h4 className="text-sm font-medium mt-4 mb-2">Last Updated</h4>
                    <div className="text-sm">{flow ? new Date(flow.updated_at).toLocaleString() : '-'}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowEditor;
