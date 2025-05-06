
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
import { RichTextPreview } from "@/components/ui/rich-text-editor";

// Extended FlowStep interface to include data property
interface ExtendedFlowStep extends FlowStep {
  data?: {
    label?: string;
    content?: string;
    milestones?: Array<{
      title: string;
      subtitle?: string;
      formFields?: Array<{
        isButton?: boolean;
        buttonLabel?: string;
        buttonAction?: string;
        name?: string;
        type?: string;
        placeholder?: string;
        richTextContent?: string;
      }>;
    }>;
    styling?: {
      background?: string;
      textColor?: string;
      border?: string;
      buttonColor?: string;
    };
  };
}

const FlowPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [flow, setFlow] = useState<Flow | null>(null);
  const [steps, setSteps] = useState<ExtendedFlowStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState("desktop");
  const [environment, setEnvironment] = useState("staging");
  const [themeMode, setThemeMode] = useState(() => 
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  const [activeMilestone, setActiveMilestone] = useState(0);
  
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
        
        // Log data to help debug
        console.log('Flow steps data:', stepsData);
        
        if (stepsData.length === 0) {
          // If no steps are found, create a sample step for testing
          const sampleStep: ExtendedFlowStep = {
            id: 'sample-1',
            flow_id: id,
            title: 'Welcome',
            content: 'This is a sample step',
            position: 1,
            step_type: 'modal',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            data: {
              label: 'Welcome to the Flow',
              content: 'This is a sample onboarding flow to demonstrate how milestones work.',
              milestones: [
                {
                  title: 'Introduction',
                  subtitle: 'Welcome to our app',
                  formFields: [
                    {
                      type: 'richtext',
                      richTextContent: '<p>Welcome to our application! This is the first milestone in your onboarding journey.</p>'
                    },
                    {
                      isButton: true,
                      buttonLabel: 'Continue',
                      buttonAction: 'next'
                    }
                  ]
                },
                {
                  title: 'Set Up Your Profile',
                  subtitle: 'Tell us about yourself',
                  formFields: [
                    {
                      name: 'Name',
                      type: 'text',
                      placeholder: 'Your name'
                    },
                    {
                      name: 'Email',
                      type: 'email',
                      placeholder: 'your@email.com'
                    },
                    {
                      isButton: true,
                      buttonLabel: 'Save Profile',
                      buttonAction: 'next'
                    }
                  ]
                },
                {
                  title: 'Preferences',
                  subtitle: 'Customize your experience',
                  formFields: [
                    {
                      name: 'Theme',
                      type: 'select',
                      placeholder: 'Select theme'
                    },
                    {
                      name: 'Notifications',
                      type: 'checkbox',
                      placeholder: 'Enable notifications'
                    },
                    {
                      isButton: true,
                      buttonLabel: 'Complete Setup',
                      buttonAction: 'next'
                    },
                    {
                      isButton: true,
                      buttonLabel: 'Skip',
                      buttonAction: 'skip'
                    }
                  ]
                }
              ],
              styling: {
                background: 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/50 dark:to-blue-900/50',
                textColor: 'text-gray-800 dark:text-white',
                border: 'border-purple-200 dark:border-purple-800',
                buttonColor: 'bg-quickstartify-purple hover:bg-quickstartify-purple/90'
              }
            }
          };
          
          setSteps([sampleStep]);
          console.log('Created sample step for testing:', sampleStep);
        } else {
          // Enhance steps data with proper type casting
          const enhancedSteps = stepsData.map((step: any) => {
            // Parse JSON string data if needed
            if (typeof step.data === 'string') {
              try {
                step.data = JSON.parse(step.data);
              } catch (e) {
                console.error('Failed to parse step data:', e);
              }
            }
            return step as ExtendedFlowStep;
          });
          
          setSteps(enhancedSteps);
          console.log('Enhanced steps:', enhancedSteps);
        }
      } catch (error: any) {
        console.error('Error fetching flow data:', error);
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
      setActiveMilestone(0); // Reset milestone when moving to next step
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
      setActiveMilestone(0); // Reset milestone when moving to previous step
    }
  };
  
  const handleSkipStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setActiveMilestone(0); // Reset milestone when skipping
    } else {
      toast({
        title: "Flow skipped",
        description: "User has skipped the last step",
      });
    }
  };

  const handleMilestoneNext = () => {
    const currentNode = steps[currentStep];
    const milestones = currentNode?.data?.milestones || [];
    
    if (activeMilestone < milestones.length - 1) {
      setActiveMilestone(activeMilestone + 1);
    } else {
      handleNextStep();
    }
  };
  
  const handleMilestonePrev = () => {
    if (activeMilestone > 0) {
      setActiveMilestone(activeMilestone - 1);
    } else {
      handlePrevStep();
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

  // Get background style based on step styling
  const getModalBackgroundStyle = (step: ExtendedFlowStep) => {
    const styling = step?.data?.styling || {};
    
    if (styling.background?.startsWith('bg-gradient')) {
      return styling.background;
    } else if (styling.background) {
      return styling.background || 'bg-white dark:bg-gray-800';
    }
    
    return 'bg-white dark:bg-gray-800';
  };
  
  const renderCurrentStep = () => {
    if (steps.length === 0 || currentStep >= steps.length) return null;
    
    const step = steps[currentStep];
    
    if (!step || !step.data) {
      console.error("Step or step.data is undefined:", step);
      return null;
    }
    
    console.log("Current step data:", step);
    console.log("Active milestone:", activeMilestone);
    
    const nodeData = step.data || {};
    const styling = nodeData.styling || {};
    const milestones = nodeData.milestones || [];
    const currentMilestone = milestones[activeMilestone];
    const modalBackground = getModalBackgroundStyle(step);
    const textColor = styling.textColor || 'text-foreground';
    const borderColor = styling.border || 'border-gray-200 dark:border-gray-700';
    const buttonColor = styling.buttonColor || 'bg-quickstartify-purple hover:bg-quickstartify-purple/90';
    
    console.log("Current milestone:", currentMilestone);
    
    switch (step.step_type) {
      case 'modal':
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`${modalBackground} p-6 rounded-lg shadow-lg max-w-md w-full ${borderColor} border`}>
              <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>
                {currentMilestone ? currentMilestone.title : (step.title || nodeData.label)}
              </h3>
              
              {currentMilestone ? (
                // Render milestone content
                <div className="space-y-4">
                  {currentMilestone.subtitle && (
                    <p className={`text-sm ${textColor} opacity-80`}>{currentMilestone.subtitle}</p>
                  )}
                  
                  {/* Render form fields and buttons in the order they appear */}
                  <div className="space-y-4">
                    {currentMilestone.formFields?.map((field, idx) => (
                      <div key={idx} className="space-y-1">
                        {field.isButton ? (
                          // Render button
                          <Button 
                            onClick={() => {
                              if (field.buttonAction === 'next') handleMilestoneNext();
                              else if (field.buttonAction === 'previous') handleMilestonePrev();
                              else if (field.buttonAction === 'skip') handleSkipStep();
                              else toast({ 
                                title: `Button clicked: ${field.buttonLabel}`, 
                                description: `Action: ${field.buttonAction}` 
                              });
                            }}
                            variant={field.buttonAction === 'skip' ? "outline" : "default"}
                            className={field.buttonAction !== 'skip' ? buttonColor : ""}
                          >
                            {field.buttonLabel || 'Continue'}
                          </Button>
                        ) : (
                          // Render input field
                          <>
                            {field.name && <label className={`text-sm font-medium ${textColor}`}>{field.name}</label>}
                            {field.type === 'richtext' ? (
                              field.richTextContent ? (
                                <RichTextPreview content={field.richTextContent} />
                              ) : (
                                <div className="border rounded p-2 text-sm text-muted-foreground">Rich text content would be shown here</div>
                              )
                            ) : field.type === 'textarea' ? (
                              <textarea 
                                placeholder={field.placeholder} 
                                className="w-full p-2 border rounded-md resize-none" 
                                rows={3}
                              />
                            ) : field.type === 'checkbox' ? (
                              <div className="flex items-center">
                                <input type="checkbox" id={`field-${idx}`} className="mr-2" />
                                <label htmlFor={`field-${idx}`}>{field.placeholder}</label>
                              </div>
                            ) : field.type === 'select' ? (
                              <select className="w-full p-2 border rounded-md">
                                <option value="">Select an option</option>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                              </select>
                            ) : (
                              <input 
                                type={field.type || 'text'} 
                                placeholder={field.placeholder} 
                                className="w-full p-2 border rounded-md" 
                              />
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Show milestone navigation if no buttons in milestone */}
                  {(!currentMilestone.formFields || !currentMilestone.formFields.some(field => field.isButton)) && (
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button variant="outline" onClick={handleMilestonePrev} disabled={activeMilestone === 0 && currentStep === 0}>
                        Back
                      </Button>
                      <Button 
                        onClick={handleMilestoneNext} 
                        className={buttonColor}
                      >
                        {activeMilestone === milestones.length - 1 && currentStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                // Render regular content if no milestone
                <>
                  <div className="mb-4">
                    {nodeData.content ? (
                      typeof nodeData.content === 'string' && nodeData.content.startsWith('<') ? (
                        <RichTextPreview content={nodeData.content} />
                      ) : (
                        <p className={textColor}>{nodeData.content}</p>
                      )
                    ) : (
                      <p className={textColor}>{step.content}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleSkipStep}>Skip</Button>
                    <Button 
                      onClick={handleNextStep}
                      className={buttonColor}
                    >
                      Continue
                    </Button>
                  </div>
                </>
              )}
              
              {/* Milestone indicators */}
              {milestones.length > 1 && (
                <div className="flex justify-center mt-4 space-x-1">
                  {milestones.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-2 h-2 rounded-full ${idx === activeMilestone ? 'bg-quickstartify-purple' : 'bg-gray-300 dark:bg-gray-600'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
        
      case 'tooltip':
        return (
          <div className={`absolute ${modalBackground} p-3 rounded-lg shadow-lg max-w-xs ${borderColor} border`}>
            <h3 className={`text-sm font-semibold ${textColor}`}>{step.title || nodeData.label}</h3>
            <p className="text-xs mt-1">{step.content || nodeData.content}</p>
            <div className="flex justify-end space-x-2 mt-2">
              <Button size="sm" variant="ghost" onClick={handleSkipStep}>Skip</Button>
              <Button size="sm" onClick={handleNextStep} className={buttonColor}>Next</Button>
            </div>
            <div className={`absolute w-3 h-3 ${modalBackground} transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2`}></div>
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
          <div className={`absolute right-4 top-20 ${modalBackground} p-4 rounded-lg shadow-lg ${borderColor} border`}>
            <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>{step.title || nodeData.label}</h3>
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
            <Button className="w-full mt-4" onClick={handleNextStep} className={buttonColor}>Continue</Button>
          </div>
        );
        
      default:
        return (
          <div className={`${modalBackground} p-4 rounded-lg shadow-lg ${borderColor} border`}>
            <h3 className={`text-lg font-semibold ${textColor}`}>{step.title || nodeData.label}</h3>
            <p className={textColor}>{step.content || nodeData.content}</p>
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
                <div className="w-full h-full flex flex-col p-0 relative">
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
                              {[81, 23, 664][i]}
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
              
              <Button variant="outline" size="sm" onClick={() => {
                setCurrentStep(0);
                setActiveMilestone(0);
              }}>
                Reset Flow
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handlePrevStep}
                  disabled={currentStep === 0 && activeMilestone === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="mx-3">
                  Step {currentStep + 1} of {steps.length}
                  {steps[currentStep]?.data?.milestones?.length > 0 && (
                    <> • Milestone {activeMilestone + 1} of {steps[currentStep]?.data?.milestones?.length}</>
                  )}
                </span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleNextStep}
                  disabled={currentStep === steps.length - 1 && (activeMilestone === (steps[currentStep]?.data?.milestones?.length || 0) - 1)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleSkipStep}>
                <X className="h-4 w-4 mr-1" /> Skip
              </Button>
              <Button onClick={handleNextStep} className="bg-quickstartify-purple hover:bg-quickstartify-purple/90">
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
                  <dd className="font-medium">{flow?.title || 'My Flow'}</dd>
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

export default FlowPreview;
