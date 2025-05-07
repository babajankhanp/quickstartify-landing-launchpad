
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Flow, FlowStep, Milestone, FormField, BrandingConfig } from "@/integrations/supabase/models";
import { RichTextPreview } from "@/components/ui/rich-text-editor";

interface ExtendedFlowStep extends FlowStep {
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

  useEffect(() => {
    async function fetchFlowData() {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch flow data
        const { data: flowData, error: flowError } = await supabase
          .from('flows')
          .select('*')
          .eq('id', id)
          .single();
        
        if (flowError) throw flowError;
        setFlow(flowData);
        setBrandingConfig(flowData.branding_config || null);
        
        // Fetch flow steps
        const { data: stepsData, error: stepsError } = await supabase
          .from('flow_steps')
          .select('*')
          .eq('flow_id', id)
          .order('position', { ascending: true });
        
        if (stepsError) throw stepsError;
        setSteps(stepsData || []);
        
        // Set current step to the first one
        if (stepsData && stepsData.length > 0) {
          setCurrentStep(stepsData[0]);
        }
      } catch (error) {
        console.error('Error loading flow for preview:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFlowData();
    
    // If no data or sample data is needed, use this
    if (!id || id === 'sample') {
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
      alert('Onboarding completed! Thank you.');
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
              className="bg-quickstartify-purple hover:bg-quickstartify-purple/90 w-full"
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
            />
          )}
          
          {field.type === 'select' && (
            <select 
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              className="w-full p-2 border rounded-md"
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
                    className="mr-2"
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

  // Get background style based on branding config
  const getBackgroundStyle = () => {
    if (!brandingConfig) {
      return 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/50 dark:to-blue-900/50';
    }
    
    if (brandingConfig.background_style === 'color') {
      return `bg-[${brandingConfig.background_color}]`;
    } else if (brandingConfig.background_style === 'gradient') {
      return brandingConfig.background_gradient 
        ? `bg-gradient-custom` 
        : 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/50 dark:to-blue-900/50';
    } else if (brandingConfig.background_style === 'image') {
      return `bg-cover bg-center`;
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-quickstartify-purple" />
      </div>
    );
  }

  if (!currentStep) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <p className="text-lg mb-4">No flow steps found.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  // Current milestone
  const milestone = currentStep.milestones?.[currentMilestoneIndex];

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${getBackgroundStyle()}`}
      style={brandingConfig?.background_image_url ? { backgroundImage: `url(${brandingConfig.background_image_url})` } : {}}
    >
      {/* Optional logo */}
      {brandingConfig?.logo_url && (
        <div className="mb-8 flex justify-center">
          <img 
            src={brandingConfig.logo_url} 
            alt="Logo" 
            className="h-12 max-w-xs"
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
            <div className="milestone-indicator">
              {currentStep.milestones.map((m, idx) => (
                <div 
                  key={m.id} 
                  className={`milestone-indicator-dot ${idx <= currentMilestoneIndex ? 'active' : 'inactive'}`}
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
        {(brandingConfig?.footer_links?.length || brandingConfig?.privacy_policy_url) && (
          <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
            <div>
              {brandingConfig?.footer_links?.map((link, idx) => (
                <span key={idx}>
                  {idx > 0 && ' • '}
                  <a href={link.url} className="hover:underline">{link.text}</a>
                </span>
              ))}
            </div>
            {brandingConfig?.privacy_policy_url && (
              <a href={brandingConfig.privacy_policy_url} className="hover:underline">Privacy Policy</a>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
