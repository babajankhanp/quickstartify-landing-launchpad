
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Sun, 
  Moon,
  Check, 
  ArrowRight, 
  X, 
  Film, 
  Download
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Flow, FlowStep } from "@/integrations/supabase/models";

const FlowPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [flow, setFlow] = useState<Flow | null>(null);
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState("desktop");
  const [environment, setEnvironment] = useState("staging");
  const [themeMode, setThemeMode] = useState(() => 
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  
  // Fetch flow data
  useEffect(() => {
    async function fetchFlowData() {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch the flow
        const { data: flowData, error: flowError } = await supabase
          .from('flows')
          .select('*')
          .eq('id', id)
          .single();
        
        if (flowError) throw flowError;
        
        setFlow(flowData as Flow);
        
        // Fetch flow steps
        const { data: stepsData, error: stepsError } = await supabase
          .from('flow_steps')
          .select('*')
          .eq('flow_id', id)
          .order('position', { ascending: true });
        
        if (stepsError) throw stepsError;
        
        setSteps(stepsData as FlowStep[]);
      } catch (error: any) {
        toast({
          title: "Error loading flow",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchFlowData();
  }, [id]);
  
  const handleThemeModeToggle = () => {
    const newMode = themeMode === "dark" ? "light" : "dark";
    setThemeMode(newMode);
    document.documentElement.classList.toggle("dark", newMode === "dark");
  };
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Flow complete",
        description: "User has completed the flow",
      });
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkipStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Flow skipped",
        description: "User has skipped the last step",
      });
    }
  };
  
  const captureScreenshot = () => {
    toast({
      title: "Screenshot captured",
      description: "Flow preview screenshot has been saved",
    });
  };
  
  const getDeviceFrameClass = () => {
    switch(viewMode) {
      case "mobile":
        return "w-[320px] h-[640px]";
      case "tablet":
        return "w-[768px] h-[1024px]";
      case "desktop":
      default:
        return "w-full max-w-[1200px] h-[800px]";
    }
  };
  
  const renderCurrentStep = () => {
    if (steps.length === 0 || currentStep >= steps.length) return null;
    
    const step = steps[currentStep];
    
    switch (step.step_type) {
      case 'modal':
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md">
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="mb-4">{step.content}</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleSkipStep}>Skip</Button>
                <Button onClick={handleNextStep}>Continue</Button>
              </div>
            </div>
          </div>
        );
        
      case 'tooltip':
        return (
          <div className="absolute bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg max-w-xs">
            <h3 className="text-sm font-semibold">{step.title}</h3>
            <p className="text-xs mt-1">{step.content}</p>
            <div className="flex justify-end space-x-2 mt-2">
              <Button size="sm" variant="ghost" onClick={handleSkipStep}>Skip</Button>
              <Button size="sm" onClick={handleNextStep}>Next</Button>
            </div>
            <div className="absolute w-3 h-3 bg-white dark:bg-gray-800 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
          </div>
        );
        
      case 'hotspot':
        return (
          <div className="absolute w-10 h-10 rounded-full bg-quickstartify-purple/20 animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-quickstartify-purple animate-pulse"></div>
          </div>
        );
        
      case 'checklist':
        return (
          <div className="absolute right-4 top-20 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 ${i < 2 ? "bg-green-500 border-green-500" : "border-gray-300"}`}>
                    {i < 2 && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className={i < 2 ? "line-through text-muted-foreground" : ""}>
                    {i === 0 ? "Set up your profile" : i === 1 ? "Create your first flow" : "Preview your flow"}
                  </span>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" onClick={handleNextStep}>Continue</Button>
          </div>
        );
        
      default:
        return (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p>{step.content}</p>
          </div>
        );
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
        <Button variant="ghost" size="sm" onClick={() => navigate(`/flow/${id}`)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Flow
        </Button>
        <h1 className="text-2xl font-bold">Flow Preview: {flow?.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="shadow-lg">
            <div className="flex items-center justify-between border-b p-2 bg-muted/30">
              <div className="flex items-center space-x-2">
                <Button 
                  variant={viewMode === "desktop" ? "default" : "outline"} 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "tablet" ? "default" : "outline"} 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "mobile" ? "default" : "outline"} 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                
                <Separator orientation="vertical" className="h-6" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleThemeModeToggle}
                >
                  {themeMode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={captureScreenshot}
                >
                  <Film className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="sm" onClick={() => navigate(`/builder/${id}`)}>
                  Edit Flow
                </Button>
              </div>
            </div>
            <CardContent className="p-2 flex justify-center bg-gray-100 dark:bg-gray-900 min-h-[60vh]">
              <div className={`bg-white dark:bg-gray-800 overflow-hidden border rounded-md shadow ${getDeviceFrameClass()}`}>
                {/* Empty Content Frame - Just for preview */}
                <div className="w-full h-full flex flex-col p-0">
                  <div className="bg-blue-500 dark:bg-blue-800 h-14 flex items-center px-4 text-white">
                    <h2 className="text-lg font-medium">Application Navigation</h2>
                  </div>
                  <div className="flex flex-1">
                    <div className="w-48 bg-gray-100 dark:bg-gray-900 p-4 hidden sm:block">
                      <div className="space-y-2">
                        <div className="p-2 rounded bg-blue-100 dark:bg-gray-800">Dashboard</div>
                        <div className="p-2 rounded">Settings</div>
                        <div className="p-2 rounded">Users</div>
                        <div className="p-2 rounded">Analytics</div>
                      </div>
                    </div>
                    <div className="flex-1 p-4 relative">
                      {/* Dashboard-like UI */}
                      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div className="font-medium">Metric {i+1}</div>
                            <div className="text-2xl font-bold mt-1">
                              {Math.floor(Math.random() * 1000)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="font-medium mb-2">Recent Activity</div>
                        <div className="space-y-2">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="p-2 border-b last:border-0 flex justify-between">
                              <span>Activity {i+1}</span>
                              <span className="text-muted-foreground text-sm">Today</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Render current flow step */}
                      {renderCurrentStep()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(0)}>
                Reset Flow
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="mx-3">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleNextStep}
                  disabled={currentStep === steps.length - 1}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleSkipStep}>
                <X className="h-4 w-4 mr-1" /> Skip
              </Button>
              <Button onClick={handleNextStep}>
                <Check className="h-4 w-4 mr-1" /> {currentStep === steps.length - 1 ? "Complete" : "Next"}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Flow Information</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Flow Name</dt>
                  <dd className="font-medium">{flow?.title}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Total Steps</dt>
                  <dd className="font-medium">{steps.length}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${flow?.is_active ? 'bg-green-500' : 'bg-amber-500'} mr-1.5`}></div>
                      <span>{flow?.is_active ? "Active" : "Inactive"}</span>
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Version</dt>
                  <dd className="font-medium">{flow?.version || 1}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Accessibility Check</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mr-2">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>Color contrast ratio: 5.3:1 (AA pass)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mr-2">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>Focus trap for modals</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mr-2">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>Keyboard navigation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mr-2">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span>Screen reader friendly</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button className="w-full" variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export Preview
          </Button>
          
          <Button className="w-full bg-quickstartify-purple hover:bg-quickstartify-purple/90">
            Publish Flow
          </Button>
        </div>
      </div>
    </div>
  );
};

// Need to add Input component for the path simulation input
function Input({ className, ...props }) {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export default FlowPreview;
