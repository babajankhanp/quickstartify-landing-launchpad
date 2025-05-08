
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Flow, 
  FlowStep, 
  Milestone, 
  FormField, 
  BrandingConfig, 
  convertJsonToMilestones, 
  convertJsonToBrandingConfig 
} from "@/integrations/supabase/models";
import { RichTextPreview } from "@/components/ui/rich-text-editor";
import { Json } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/use-toast";

// Define our extended flow step type to add milestones
interface ExtendedFlowStep extends Omit<FlowStep, 'step_type'> {
  step_type: string;
  milestones?: Milestone[];
}

export default function FlowPreview() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [flow, setFlow] = useState<Flow | null>(null);
  const [steps, setSteps] = useState<ExtendedFlowStep[]>([]);
  const [currentStep, setCurrentStep] = useState<ExtendedFlowStep | null>(null);
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [brandingConfig, setBrandingConfig] = useState<BrandingConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFlowData() {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching flow with ID:", id);
        
        // Fetch flow data
        const { data: flowData, error: flowError } = await supabase
          .from('flows')
          .select('*')
          .eq('id', id)
          .single();
        
        if (flowError) {
          console.error("Error fetching flow:", flowError);
          throw flowError;
        }
        
        if (!flowData) {
          console.error("No flow data found for ID:", id);
          setError("Flow not found");
          setLoading(false);
          return;
        }
        
        console.log("Flow data fetched:", flowData);
        
        // Cast the database response to our Flow type
        const typedFlow = flowData as unknown as Flow;
        setFlow(typedFlow);
        
        // Get branding config from database or flow data
        const brandingConfigData = typedFlow.branding_config || {
          logo_url: '/placeholder.svg',
          primary_color: '#9b87f5',
          secondary_color: '#7e69ab',
          background_style: 'gradient',
          background_gradient: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
          card_style: 'rounded',
          font_family: 'Inter, sans-serif',
          footer_links: [
            { text: 'Terms', url: '#' },
            { text: 'Privacy', url: '#' }
          ]
        };
        
        setBrandingConfig(brandingConfigData);
        
        // Fetch flow steps
        console.log("Fetching flow steps for flow ID:", id);
        const { data: stepsData, error: stepsError } = await supabase
          .from('flow_steps')
          .select('*')
          .eq('flow_id', id)
          .order('position', { ascending: true });
        
        if (stepsError) {
          console.error("Error fetching flow steps:", stepsError);
          throw stepsError;
        }
        
        console.log("Flow steps fetched:", stepsData);
        
        if (!stepsData || stepsData.length === 0) {
          console.warn("No steps found for flow ID:", id);
          setError("No steps found for this flow");
          setLoading(false);
          return;
        }
        
        // Process step data to extract milestones from styling
        const processedSteps = stepsData.map(step => {
          const styling = step.styling as Record<string, any> || {};
          
          // Safely convert JSON milestones to typed Milestone objects
          const milestones = styling && styling.milestones 
            ? convertJsonToMilestones(styling.milestones as Json)
            : [];
          
          return {
            ...step,
            milestones: milestones
          } as ExtendedFlowStep;
        });
        
        console.log("Processed steps with milestones:", processedSteps);
        
        setSteps(processedSteps);
        
        // Set current step to the first one
        if (processedSteps && processedSteps.length > 0) {
          setCurrentStep(processedSteps[0]);
          console.log("Current step set to:", processedSteps[0]);
        }
      } catch (error) {
        console.error('Error loading flow for preview:', error);
        setError("Failed to load flow data");
        toast({
          variant: "destructive",
          title: "Error loading flow",
          description: "Could not load the flow data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchFlowData();
    
    // If no data or sample data is needed, use this
    if (id === 'sample') {
      const sampleBranding: BrandingConfig = {
        logo_url: '/placeholder.svg',
        primary_color: '#9b87f5',
        secondary_color: '#7e69ab',
        background_style: 'gradient',
        background_gradient: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
        card_style: 'rounded',
        font_family: 'Inter, sans-serif',
        footer_links: [
          { text: 'Terms', url: '#' },
          { text: 'Privacy', url: '#' }
        ]
      };
      
      const sampleStep: ExtendedFlowStep = {
        id: 'sample-1',
        flow_id: 'sample',
        title: 'Welcome to QuickStartify',
        content: 'Get started with our product in just a few steps.',
        step_type: 'modal',
        position: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        milestones: [
          {
            id: 'sample-ms-1',
            title: 'Welcome',
            subtitle: 'Let\'s get to know you better',
            content: '<p>We\'re excited to have you on board! Please tell us a bit about yourself.</p>',
            formFields: [
              {
                id: 'name',
                name: 'Full Name',
                type: 'text',
                required: true,
                placeholder: 'Enter your full name',
              },
              {
                id: 'email',
                name: 'Email Address',
                type: 'email',
                required: true,
                placeholder: 'Enter your email',
                validation: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
              },
              {
                id: 'role',
                name: 'Role',
                type: 'select',
                required: true,
                placeholder: 'Select your role',
                options: [
                  { label: 'Developer', value: 'developer' },
                  { label: 'Designer', value: 'designer' },
                  { label: 'Product Manager', value: 'pm' },
                  { label: 'Other', value: 'other' }
                ]
              },
              {
                id: 'next-button',
                name: 'Next',
                type: 'button',
                required: false,
                placeholder: '',
                isButton: true,
                buttonLabel: 'Continue',
                buttonAction: 'next',
                buttonCollectMetrics: true
              }
            ]
          },
          {
            id: 'sample-ms-2',
            title: 'Preferences',
            subtitle: 'Customize your experience',
            content: '<p>Help us tailor the experience to your needs.</p>',
            formFields: [
              {
                id: 'interests',
                name: 'Interests',
                type: 'checkbox',
                required: false,
                placeholder: 'Select your interests',
                options: [
                  { label: 'Frontend Development', value: 'frontend' },
                  { label: 'Backend Development', value: 'backend' },
                  { label: 'UI/UX Design', value: 'design' },
                  { label: 'DevOps', value: 'devops' }
                ]
              },
              {
                id: 'frequency',
                name: 'Update Frequency',
                type: 'select',
                required: false,
                placeholder: 'How often would you like updates?',
                options: [
                  { label: 'Daily', value: 'daily' },
                  { label: 'Weekly', value: 'weekly' },
                  { label: 'Monthly', value: 'monthly' }
                ]
              },
              {
                id: 'next-button-2',
                name: 'Next',
                type: 'button',
                required: false,
                placeholder: '',
                isButton: true,
                buttonLabel: 'Continue',
                buttonAction: 'next',
                buttonCollectMetrics: true
              },
              {
                id: 'back-button-2',
                name: 'Back',
                type: 'button',
                required: false,
                placeholder: '',
                isButton: true,
                buttonLabel: 'Back',
                buttonAction: 'previous',
                buttonCollectMetrics: false
              }
            ]
          },
          {
            id: 'sample-ms-3',
            title: 'All Set!',
            subtitle: 'You\'re ready to go',
            content: '<p>Thank you for completing the onboarding! Click the button below to start using our product.</p>',
            formFields: [
              {
                id: 'complete-button',
                name: 'Complete',
                type: 'button',
                required: false,
                placeholder: '',
                isButton: true,
                buttonLabel: 'Get Started',
                buttonAction: 'complete',
                buttonCollectMetrics: true
              }
            ]
          }
        ],
        styling: {
          background: 'bg-white dark:bg-gray-800',
          textColor: 'text-gray-900 dark:text-gray-100'
        }
      };
      
      setCurrentStep(sampleStep);
      setBrandingConfig(sampleBranding);
      setLoading(false);
    }
  }, [id]);

  // Handle navigation between milestones
  const handleNext = () => {
    if (!currentStep || !currentStep.milestones) return;
    
    const totalMilestones = currentStep.milestones.length;
    if (currentMilestoneIndex < totalMilestones - 1) {
      setCurrentMilestoneIndex(currentMilestoneIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentMilestoneIndex > 0) {
      setCurrentMilestoneIndex(currentMilestoneIndex - 1);
    }
  };

  // Handle form field changes
  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData({
      ...formData,
      [fieldId]: value
    });
  };

  // Handle button click based on action
  const handleButtonClick = (fieldId: string, action: string) => {
    if (action === 'next') {
      handleNext();
    } else if (action === 'previous') {
      handlePrevious();
    } else if (action === 'complete') {
      toast({
        title: "Onboarding completed",
        description: "Thank you for completing the onboarding flow!",
        action: (
          <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <Check className="h-4 w-4 text-green-500" />
          </div>
        ),
      });
    }
    
    // Log analytics
    if (currentStep) {
      logEvent(currentStep.id, 'button_click', { buttonId: fieldId, action });
    }
  };

  // Log analytics events
  const logEvent = async (stepId: string, eventType: string, details?: Record<string, any>) => {
    // This would normally send to your analytics system
    console.log(`Event logged: ${eventType} for step ${stepId}`, details);
    
    try {
      // Save to Supabase analytics if in a real flow
      if (id && id !== 'sample') {
        await supabase.from('flow_analytics').insert({
          flow_id: id,
          step_id: stepId,
          event_type: eventType,
          metadata: details
        });
      }
    } catch (error) {
      console.error('Error logging event:', error);
    }
  };

  // Render the current milestone's form fields
  const renderFormFields = () => {
    if (!currentStep || !currentStep.milestones) return null;
    
    const milestone = currentStep.milestones[currentMilestoneIndex];
    if (!milestone || !milestone.formFields) return null;
    
    return milestone.formFields.map((field) => {
      if (field.isButton) {
        return (
          <div key={field.id} className="mt-4">
            <Button 
              className={`w-full ${getPrimaryButtonStyles()}`}
              onClick={() => handleButtonClick(field.id, field.buttonAction || 'next')}
            >
              {field.buttonLabel || 'Next'}
            </Button>
          </div>
        );
      }
      
      return (
        <div key={field.id} className="space-y-2 my-4">
          <Label htmlFor={field.id}>{field.name}</Label>
          
          {field.type === 'text' && (
            <Input 
              id={field.id}
              type="text"
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              className={getInputStyles()}
            />
          )}
          
          {field.type === 'email' && (
            <Input 
              id={field.id}
              type="email"
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              className={getInputStyles()}
            />
          )}
          
          {field.type === 'select' && (
            <select 
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              className={`w-full p-2 border rounded-md ${getInputStyles()}`}
            >
              <option value="">{field.placeholder}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          
          {field.type === 'checkbox' && field.options && (
            <div className="space-y-2">
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input 
                    type="checkbox"
                    id={`${field.id}-${option.value}`}
                    checked={formData[`${field.id}-${option.value}`] || false}
                    onChange={(e) => handleFieldChange(`${field.id}-${option.value}`, e.target.checked)}
                    className={`mr-2 ${getCheckboxStyles()}`}
                  />
                  <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  // Helper functions for styling based on branding config
  const getPrimaryButtonStyles = () => {
    if (!brandingConfig?.primary_color) return 'bg-quickstartify-purple hover:bg-quickstartify-purple/90';
    
    // Custom button style based on primary color
    const primaryColor = brandingConfig.primary_color;
    return `bg-[${primaryColor}] hover:bg-opacity-90`;
  };

  const getInputStyles = () => {
    if (!brandingConfig) return '';
    
    let styles = '';
    
    if (brandingConfig.secondary_color) {
      styles += ` focus:border-[${brandingConfig.secondary_color}] focus:ring-[${brandingConfig.secondary_color}]`;
    }
    
    return styles;
  };

  const getCheckboxStyles = () => {
    if (!brandingConfig?.primary_color) return '';
    return `accent-[${brandingConfig.primary_color}]`;
  };

  // Get background style based on branding config
  const getBackgroundStyle = () => {
    if (!brandingConfig) {
      return 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/50 dark:to-blue-900/50';
    }
    
    if (brandingConfig.background_style === 'color' && brandingConfig.background_color) {
      return `bg-[${brandingConfig.background_color}]`;
    } else if (brandingConfig.background_style === 'gradient' && brandingConfig.background_gradient) {
      // Create a style object for the gradient
      const styleObject = {
        background: brandingConfig.background_gradient
      };
      return { ...styleObject };
    } else if (brandingConfig.background_style === 'image' && brandingConfig.background_image_url) {
      return 'bg-cover bg-center';
    }
    
    return 'bg-white dark:bg-gray-900';
  };

  // Get card class based on branding config
  const getCardClass = () => {
    if (!brandingConfig) return 'rounded-lg';
    
    switch (brandingConfig.card_style) {
      case 'sharp': return '';
      case 'floating': return 'rounded-lg shadow-xl';
      case 'bordered': return 'rounded-lg border-2';
      default: return 'rounded-lg';
    }
  };

  // Load animation style
  const getAnimationStyle = () => {
    if (!brandingConfig || !brandingConfig.animation_style) return '';
    
    switch (brandingConfig.animation_style) {
      case 'fade': return 'animate-fade';
      case 'slide': return 'animate-slide';
      case 'zoom': return 'animate-zoom';
      case 'flip': return 'animate-flip';
      case 'bounce': return 'animate-bounce';
      default: return '';
    }
  };

  // Get font family style
  const getFontFamilyStyle = () => {
    if (!brandingConfig?.font_family) return {};
    return { 
      fontFamily: brandingConfig.font_family 
    };
  };

  // Apply custom CSS if provided
  useEffect(() => {
    if (brandingConfig?.custom_css) {
      // Create a style element
      const styleEl = document.createElement('style');
      styleEl.id = 'flow-custom-css';
      styleEl.textContent = brandingConfig.custom_css;
      document.head.appendChild(styleEl);
      
      // Cleanup on unmount
      return () => {
        const existingStyle = document.getElementById('flow-custom-css');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [brandingConfig?.custom_css]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-quickstartify-purple" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <div className="flex items-center gap-2 text-destructive mb-4">
          <AlertCircle className="h-5 w-5" />
          <p className="text-lg">Error: {error}</p>
        </div>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  if (!currentStep) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <div className="flex items-center gap-2 text-amber-500 mb-4">
          <AlertCircle className="h-5 w-5" />
          <p className="text-lg">No flow steps found.</p>
        </div>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  // Current milestone
  const milestone = currentStep.milestones?.[currentMilestoneIndex];

  // Determine if background is a style object or a class string
  const backgroundStyle = getBackgroundStyle();
  const isBackgroundObject = typeof backgroundStyle === 'object';
  
  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isBackgroundObject ? '' : backgroundStyle}`}
      style={{
        ...(isBackgroundObject ? backgroundStyle : {}),
        ...(brandingConfig?.background_image_url && brandingConfig?.background_style === 'image' 
          ? { backgroundImage: `url(${brandingConfig.background_image_url})` } 
          : {}),
        ...getFontFamilyStyle()
      }}
    >
      {/* Optional logo */}
      {brandingConfig?.logo_url && (
        <div className="mb-8 flex justify-center">
          <img 
            src={brandingConfig.logo_url} 
            alt="Logo" 
            className="h-12 max-w-xs"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
              target.alt = 'Failed to load logo';
            }}
          />
        </div>
      )}
      
      <Card className={`w-full max-w-md mx-auto ${getCardClass()} ${getAnimationStyle()}`}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {milestone?.title || currentStep.title}
          </CardTitle>
          {milestone?.subtitle && (
            <p className="text-center text-muted-foreground">{milestone.subtitle}</p>
          )}
        </CardHeader>
        
        {/* Milestone indicator */}
        {currentStep.milestones && currentStep.milestones.length > 1 && (
          <div className="px-6">
            <div className="flex gap-1 justify-center">
              {currentStep.milestones.map((m, idx) => (
                <div 
                  key={m.id} 
                  className={`h-1.5 rounded-full flex-grow max-w-8 ${
                    idx === currentMilestoneIndex 
                      ? brandingConfig?.primary_color 
                        ? `bg-[${brandingConfig.primary_color}]` 
                        : 'bg-quickstartify-purple' 
                      : idx < currentMilestoneIndex 
                        ? brandingConfig?.primary_color 
                          ? `bg-[${brandingConfig.primary_color}]/50` 
                          : 'bg-quickstartify-purple/50' 
                        : 'bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: idx === currentMilestoneIndex 
                      ? brandingConfig?.primary_color || ''
                      : idx < currentMilestoneIndex 
                        ? `${brandingConfig?.primary_color}80` || ''
                        : ''
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        <CardContent className="pt-4">
          {/* Milestone content */}
          {milestone?.content && (
            <div className="mb-4">
              <RichTextPreview content={milestone.content} />
            </div>
          )}
          
          {/* Form fields */}
          {renderFormFields()}
        </CardContent>
        
        {/* Footer with branding */}
        {((brandingConfig?.footer_links && brandingConfig.footer_links.length > 0) || 
          brandingConfig?.privacy_policy_url || 
          brandingConfig?.terms_url) && (
          <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
            <div>
              {brandingConfig?.footer_links?.map((link, idx) => (
                <span key={idx}>
                  {idx > 0 && ' • '}
                  <a href={link.url} className="hover:underline" target="_blank" rel="noopener noreferrer">
                    {link.text}
                  </a>
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              {brandingConfig?.privacy_policy_url && (
                <a href={brandingConfig.privacy_policy_url} className="hover:underline" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              )}
              {brandingConfig?.terms_url && (
                <a href={brandingConfig.terms_url} className="hover:underline" target="_blank" rel="noopener noreferrer">
                  Terms
                </a>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
