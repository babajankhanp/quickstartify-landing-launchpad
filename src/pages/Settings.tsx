import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import {
  Settings2,
  Bell,
  Key,
  Users,
  Workflow,
  Globe,
  Database,
  Trash2,
  PlusCircle,
  Palette,
  Image,
  TextIcon,
  Sliders,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Flow, BrandingConfig, FooterLink, convertBrandingConfigToJson, convertJsonToBrandingConfig } from "@/integrations/supabase/models";

const Settings = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    flowName: "",
    description: "",
    webhook: "https://api.example.com/webhook",
    trackEvents: true,
    collectUserData: true,
    enableAnalytics: true,
    sendNotifications: false,
    publicAccess: false,
  });

  const [branding, setBranding] = useState<BrandingConfig>({
    logo_url: '',
    primary_color: '#9b87f5',
    secondary_color: '#7e69ab',
    background_style: 'color',
    background_color: '#ffffff',
    background_gradient: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
    background_image_url: '',
    animation_style: 'fade',
    card_style: 'rounded',
    font_family: 'Inter, sans-serif',
    footer_links: [],
    privacy_policy_url: '',
    terms_url: '',
    custom_css: ''
  });

  const [footerLink, setFooterLink] = useState({ text: '', url: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch flow data
  const { data: flowData, isLoading: isFlowLoading, error: flowError } = useQuery({
    queryKey: ['flow', id],
    queryFn: async () => {
      if (!id) throw new Error('Flow ID is required');
      
      const { data, error } = await supabase
        .from('flows')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as Flow;
    },
    enabled: !!id,
  });

  // Update flow settings
  const updateFlowMutation = useMutation({
    mutationFn: async (data: Partial<Flow>) => {
      if (!id) throw new Error('Flow ID is required');
      
      const { error } = await supabase
        .from('flows')
        .update(data)
        .eq('id', id);
        
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your flow settings have been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (flowData) {
      // Update settings from flow data
      setSettings({
        ...settings,
        flowName: flowData.title,
        description: flowData.description || "",
      });
      
      // Parse branding config
      if (flowData.branding_config) {
        setBranding(flowData.branding_config);
      }
    }
  }, [flowData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('branding.')) {
      const brandingField = name.split('.')[1];
      setBranding({
        ...branding,
        [brandingField]: value
      });
    } else {
      setSettings({
        ...settings,
        [name]: value,
      });
    }
  };

  const handleBrandingChange = (field: string, value: any) => {
    setBranding({
      ...branding,
      [field]: value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings({
      ...settings,
      [name]: checked,
    });
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Update flow settings
      await updateFlowMutation.mutateAsync({
        title: settings.flowName,
        description: settings.description,
        is_active: !settings.publicAccess ? false : undefined,
        branding_config: branding
      });

      // Preview the flow with the new branding
      if (id) {
        // Open the preview in a new tab
        window.open(`/flow/${id}/preview`, '_blank');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFooterLink = () => {
    if (!footerLink.text || !footerLink.url) return;
    
    setBranding({
      ...branding,
      footer_links: [...(branding.footer_links || []), footerLink]
    });
    
    setFooterLink({ text: '', url: '' });
  };

  const removeFooterLink = (index: number) => {
    const updatedLinks = [...(branding.footer_links || [])];
    updatedLinks.splice(index, 1);
    
    setBranding({
      ...branding,
      footer_links: updatedLinks
    });
  };

  // Display loading state
  if (isFlowLoading) {
    return (
      <div className="container py-6 max-w-6xl">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-[500px] w-full mt-4" />
        </div>
      </div>
    );
  }

  // Display error state
  if (flowError) {
    return (
      <div className="container py-6 max-w-6xl">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold mb-4">Error Loading Flow</h2>
          <p className="text-muted-foreground mb-6">Could not load the flow settings. Please try again later.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Flow Settings</h1>
          <p className="text-muted-foreground">
            Configure global settings for your onboarding flow
          </p>
        </div>
        <Button onClick={saveSettings} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-6 mb-8 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Branding</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            <span>Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Team</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Data & Privacy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure the basic settings for your onboarding flow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="flowName">Flow Name</Label>
                <Input 
                  id="flowName" 
                  name="flowName"
                  value={settings.flowName} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={settings.description || ''} 
                  onChange={handleInputChange}
                  placeholder="Describe what this flow is for"
                  className="h-24"
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Access Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="publicAccess">Public Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anyone to access this onboarding flow without authentication
                    </p>
                  </div>
                  <Switch 
                    id="publicAccess"
                    checked={settings.publicAccess}
                    onCheckedChange={(checked) => handleSwitchChange('publicAccess', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
              <CardDescription>
                Configure which domains your onboarding flow can be displayed on
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Label>Allowed Domains</Label>
                </div>
                <div className="space-y-2">
                  <Input placeholder="example.com" />
                  <Input placeholder="app.example.com" />
                  <Button variant="outline" size="sm" className="mt-2">
                    Add Domain
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Style</CardTitle>
              <CardDescription>
                Customize how your onboarding flow appears to users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Colors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" /> Colors
                  </h3>
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="primaryColor" 
                        name="branding.primary_color"
                        type="color"
                        value={branding.primary_color || '#9b87f5'} 
                        onChange={handleInputChange}
                        className="w-12 h-10 p-1"
                      />
                      <Input 
                        value={branding.primary_color || '#9b87f5'}
                        onChange={(e) => handleBrandingChange('primary_color', e.target.value)} 
                        placeholder="#9b87f5"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="secondaryColor" 
                        name="branding.secondary_color"
                        type="color"
                        value={branding.secondary_color || '#7e69ab'} 
                        onChange={handleInputChange}
                        className="w-12 h-10 p-1"
                      />
                      <Input 
                        value={branding.secondary_color || '#7e69ab'}
                        onChange={(e) => handleBrandingChange('secondary_color', e.target.value)} 
                        placeholder="#7e69ab"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Image className="h-4 w-4" /> Logo
                  </h3>
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input 
                      id="logoUrl" 
                      name="branding.logo_url"
                      value={branding.logo_url || ''} 
                      onChange={handleInputChange}
                      placeholder="https://example.com/logo.png"
                    />
                    {branding.logo_url && (
                      <div className="mt-2 p-4 border rounded-md flex justify-center bg-gray-50">
                        <img 
                          src={branding.logo_url} 
                          alt="Logo preview" 
                          className="max-h-12" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                            target.alt = 'Failed to load image';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Background */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Image className="h-4 w-4" /> Background
                </h3>
                <RadioGroup 
                  value={branding.background_style || 'color'}
                  onValueChange={(value) => handleBrandingChange('background_style', value)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-start space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="color" id="bg-color" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="bg-color" className="font-medium">Solid Color</Label>
                      <p className="text-sm text-muted-foreground">Simple, clean background with a single color</p>
                      {branding.background_style === 'color' && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <Input 
                              type="color"
                              value={branding.background_color || '#ffffff'} 
                              onChange={(e) => handleBrandingChange('background_color', e.target.value)}
                              className="w-12 h-8 p-1"
                            />
                            <Input 
                              value={branding.background_color || '#ffffff'}
                              onChange={(e) => handleBrandingChange('background_color', e.target.value)} 
                              placeholder="#ffffff"
                              className="flex-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="gradient" id="bg-gradient" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="bg-gradient" className="font-medium">Gradient</Label>
                      <p className="text-sm text-muted-foreground">Smooth color transition effect</p>
                      {branding.background_style === 'gradient' && (
                        <div className="mt-2">
                          <Label className="text-sm">Gradient CSS</Label>
                          <Input 
                            value={branding.background_gradient || 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)'}
                            onChange={(e) => handleBrandingChange('background_gradient', e.target.value)} 
                            placeholder="linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)"
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="image" id="bg-image" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="bg-image" className="font-medium">Image</Label>
                      <p className="text-sm text-muted-foreground">Full background image</p>
                      {branding.background_style === 'image' && (
                        <div className="mt-2">
                          <Label className="text-sm">Image URL</Label>
                          <Input 
                            value={branding.background_image_url || ''}
                            onChange={(e) => handleBrandingChange('background_image_url', e.target.value)} 
                            placeholder="https://example.com/background.jpg"
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Card Style */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Sliders className="h-4 w-4" /> Card Style
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardStyle">Card Appearance</Label>
                    <Select 
                      value={branding.card_style || 'rounded'} 
                      onValueChange={(value) => handleBrandingChange('card_style', value)}
                    >
                      <SelectTrigger id="cardStyle">
                        <SelectValue placeholder="Select card style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="sharp">Sharp Corners</SelectItem>
                        <SelectItem value="floating">Floating (with shadow)</SelectItem>
                        <SelectItem value="bordered">Bordered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="animation">Animation Style</Label>
                    <Select 
                      value={branding.animation_style || 'fade'} 
                      onValueChange={(value) => handleBrandingChange('animation_style', value)}
                    >
                      <SelectTrigger id="animation">
                        <SelectValue placeholder="Select animation style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fade">Fade</SelectItem>
                        <SelectItem value="slide">Slide</SelectItem>
                        <SelectItem value="zoom">Zoom</SelectItem>
                        <SelectItem value="flip">Flip</SelectItem>
                        <SelectItem value="bounce">Bounce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Typography */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <TextIcon className="h-4 w-4" /> Typography
                </h3>
                <div>
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select 
                    value={branding.font_family || 'Inter, sans-serif'} 
                    onValueChange={(value) => handleBrandingChange('font_family', value)}
                  >
                    <SelectTrigger id="fontFamily">
                      <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter, sans-serif">Inter (Modern)</SelectItem>
                      <SelectItem value="Roboto, sans-serif">Roboto (Clean)</SelectItem>
                      <SelectItem value="Poppins, sans-serif">Poppins (Friendly)</SelectItem>
                      <SelectItem value="'Open Sans', sans-serif">Open Sans (Readable)</SelectItem>
                      <SelectItem value="'Playfair Display', serif">Playfair Display (Elegant)</SelectItem>
                      <SelectItem value="system-ui, sans-serif">System UI (Native)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Custom fonts may require additional CSS
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer & Links</CardTitle>
              <CardDescription>
                Add footer links and legal information to your onboarding flow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Footer Links</h3>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Link Text" 
                      value={footerLink.text}
                      onChange={(e) => setFooterLink({ ...footerLink, text: e.target.value })}
                      className="w-32"
                    />
                    <Input 
                      placeholder="URL" 
                      value={footerLink.url}
                      onChange={(e) => setFooterLink({ ...footerLink, url: e.target.value })}
                      className="w-48"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addFooterLink}
                      disabled={!footerLink.text || !footerLink.url}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
                
                {branding.footer_links && branding.footer_links.length > 0 ? (
                  <div className="space-y-2">
                    {branding.footer_links.map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                        <div>
                          <span className="font-medium">{link.text}</span>
                          <span className="text-sm text-muted-foreground ml-2">({link.url})</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFooterLink(index)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground border border-dashed rounded-md">
                    No footer links added yet
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="privacyPolicy">Privacy Policy URL</Label>
                  <Input 
                    id="privacyPolicy" 
                    name="branding.privacy_policy_url"
                    value={branding.privacy_policy_url || ''} 
                    onChange={handleInputChange}
                    placeholder="https://example.com/privacy"
                  />
                </div>
                <div>
                  <Label htmlFor="termsUrl">Terms of Service URL</Label>
                  <Input 
                    id="termsUrl" 
                    name="branding.terms_url"
                    value={branding.terms_url || ''} 
                    onChange={handleInputChange}
                    placeholder="https://example.com/terms"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Customization</CardTitle>
              <CardDescription>
                Add custom CSS to further customize your onboarding flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="customCss">Custom CSS</Label>
              <Textarea 
                id="customCss" 
                name="branding.custom_css"
                value={branding.custom_css || ''} 
                onChange={handleInputChange}
                placeholder=".custom-flow-element { color: #ff0000; }"
                className="font-mono text-sm h-32"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Advanced: Use custom CSS to override default styles
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="w-full">
                <Button variant="outline" size="sm" onClick={() => window.open(`/flow/${id}/preview`, '_blank')}>
                  Preview Changes
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Preview your branding changes before saving
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Set up webhooks to notify your systems when users interact with your onboarding flow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhook">Webhook URL</Label>
                <Input 
                  id="webhook" 
                  name="webhook"
                  value={settings.webhook} 
                  onChange={handleInputChange}
                  placeholder="https://api.example.com/webhook"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Test Webhook</Label>
                  <p className="text-sm text-muted-foreground">
                    Send a test event to your webhook endpoint
                  </p>
                </div>
                <Button variant="outline">Send Test</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>
                Connect your onboarding flow to other services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">GA</div>
                    <div>
                      <h4 className="font-medium">Google Analytics</h4>
                      <p className="text-xs text-muted-foreground">Track usage in GA4</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="p-4 border rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">MP</div>
                    <div>
                      <h4 className="font-medium">Mixpanel</h4>
                      <p className="text-xs text-muted-foreground">Send events to Mixpanel</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Collection</CardTitle>
              <CardDescription>
                Configure how user data is collected and stored
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trackEvents">Event Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Track when users view or interact with flow steps
                  </p>
                </div>
                <Switch 
                  id="trackEvents"
                  checked={settings.trackEvents}
                  onCheckedChange={(checked) => handleSwitchChange('trackEvents', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="collectUserData">User Data Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Store user-submitted data from forms
                  </p>
                </div>
                <Switch 
                  id="collectUserData"
                  checked={settings.collectUserData}
                  onCheckedChange={(checked) => handleSwitchChange('collectUserData', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableAnalytics">Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Generate analytics and insights from onboarding data
                  </p>
                </div>
                <Switch 
                  id="enableAnalytics"
                  checked={settings.enableAnalytics}
                  onCheckedChange={(checked) => handleSwitchChange('enableAnalytics', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>
                Export collected data for further analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">User Interaction Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Export all user interactions with your onboarding flow
                  </p>
                </div>
                <Button variant="outline">Export CSV</Button>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Form Submissions</h4>
                  <p className="text-sm text-muted-foreground">
                    Export all form data collected through your flow
                  </p>
                </div>
                <Button variant="outline">Export CSV</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage who has access to this onboarding flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user?.email || 'Current User'}</p>
                      <p className="text-xs text-muted-foreground">Owner</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full">Invite Team Member</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sendNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important onboarding events
                  </p>
                </div>
                <Switch 
                  id="sendNotifications"
                  checked={settings.sendNotifications}
                  onCheckedChange={(checked) => handleSwitchChange('sendNotifications', checked)}
                />
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-3">Notification Events</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyCompletions" />
                    <Label htmlFor="notifyCompletions">Flow completions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyDropOffs" />
                    <Label htmlFor="notifyDropOffs">User drop-offs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyFormSubmissions" />
                    <Label htmlFor="notifyFormSubmissions">Form submissions</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for programmatic access to your onboarding flows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <h4 className="font-medium">Production API Key</h4>
                  <p className="text-sm text-muted-foreground">For use in production environments</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">Show Key</Button>
                  <Button variant="outline">Rotate</Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <h4 className="font-medium">Development API Key</h4>
                  <p className="text-sm text-muted-foreground">For testing and development</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">Show Key</Button>
                  <Button variant="outline">Rotate</Button>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">API Documentation</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn how to integrate with our API to programmatically manage your onboarding flows
                </p>
                <Button variant="outline">View Documentation</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
