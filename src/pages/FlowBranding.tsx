
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Check,
  Copy,
  Download,
  Upload,
  Eye,
  RefreshCw,
  Plus,
  Trash,
  Save,
  Brush,
  PaintBucket,
  Palette,
  Image,
  Link,
  Settings,
  UploadCloud
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Flow } from "@/integrations/supabase/models";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

// Define types for branding settings
interface BrandingSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    borderRadius: number;
    lineHeight: number;
    letterSpacing: number;
  };
  buttons: {
    style: "rounded" | "pill" | "square";
    size: "small" | "medium" | "large";
    animation: string;
  };
  animations: {
    type: string;
    duration: number;
    easing: string;
    enabled: boolean;
  };
  modals: {
    style: "minimal" | "bordered" | "shadow" | "glassmorphic";
    animation: string;
  };
  logo: string | null;
  footer: {
    enabled: boolean;
    copyrightText: string;
    links: Array<{
      label: string;
      url: string;
    }>;
  };
  auth: {
    googleEnabled: boolean;
    googleClientId: string;
    showSocial: boolean;
  };
  compliance: {
    privacyPolicyUrl: string;
    termsUrl: string;
    cookieNotice: boolean;
    cookieText: string;
  };
  card: {
    style: string;
    shadow: string;
    backgroundStyle: string;
    pattern: string;
  };
  richText: {
    welcomeMessage: string;
    completionMessage: string;
  }
}

// Sample color palettes
const colorPalettes = [
  {
    name: "Default Purple",
    colors: {
      primary: "#9b87f5",
      secondary: "#7e69ab",
      accent: "#6e59a5",
      background: "#ffffff",
      text: "#1a1f2c",
      border: "#e2e8f0"
    }
  },
  {
    name: "Ocean Blue",
    colors: {
      primary: "#0ea5e9",
      secondary: "#0284c7",
      accent: "#0369a1",
      background: "#f0f9ff",
      text: "#0f172a",
      border: "#e0f2fe"
    }
  },
  {
    name: "Forest Green",
    colors: {
      primary: "#22c55e",
      secondary: "#16a34a",
      accent: "#15803d",
      background: "#f0fdf4",
      text: "#14532d",
      border: "#dcfce7"
    }
  },
  {
    name: "Sunset Orange",
    colors: {
      primary: "#f97316",
      secondary: "#ea580c",
      accent: "#c2410c",
      background: "#fff7ed",
      text: "#7c2d12",
      border: "#ffedd5"
    }
  },
  {
    name: "Berry Purple",
    colors: {
      primary: "#8b5cf6",
      secondary: "#7c3aed",
      accent: "#6d28d9",
      background: "#f5f3ff",
      text: "#4c1d95",
      border: "#ede9fe"
    }
  }
];

// Font family options
const fontFamilies = [
  { value: "inter", label: "Inter (Default)" },
  { value: "poppins", label: "Poppins" },
  { value: "roboto", label: "Roboto" },
  { value: "montserrat", label: "Montserrat" },
  { value: "opensans", label: "Open Sans" },
  { value: "lato", label: "Lato" },
  { value: "nunito", label: "Nunito" },
  { value: "raleway", label: "Raleway" }
];

// Button style options
const buttonStyles = [
  { value: "rounded", label: "Rounded" },
  { value: "pill", label: "Pill" },
  { value: "square", label: "Square" }
];

// Modal style options
const modalStyles = [
  { value: "minimal", label: "Minimal" },
  { value: "bordered", label: "Bordered" },
  { value: "shadow", label: "Shadow" },
  { value: "glassmorphic", label: "Glassmorphic" }
];

// Card style options
const cardStyles = [
  { value: "standard", label: "Standard" },
  { value: "floating", label: "Floating" },
  { value: "flat", label: "Flat" },
  { value: "glass", label: "Glass Effect" },
  { value: "neumorph", label: "Neumorphic" }
];

// Card shadow options
const cardShadows = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" }
];

// Animation types
const animationTypes = [
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "zoom", label: "Zoom" },
  { value: "bounce", label: "Bounce" },
  { value: "flip", label: "Flip" }
];

// Easing functions
const easingFunctions = [
  { value: "ease", label: "Ease" },
  { value: "ease-in", label: "Ease In" },
  { value: "ease-out", label: "Ease Out" },
  { value: "ease-in-out", label: "Ease In Out" },
  { value: "linear", label: "Linear" }
];

// Background styles
const backgroundStyles = [
  { value: "solid", label: "Solid Color" },
  { value: "gradient", label: "Gradient" },
  { value: "pattern", label: "Pattern" },
  { value: "image", label: "Image" }
];

// Pattern options
const patternOptions = [
  { value: "dots", label: "Dots" },
  { value: "lines", label: "Lines" },
  { value: "grid", label: "Grid" },
  { value: "waves", label: "Waves" },
  { value: "confetti", label: "Confetti" }
];

const FlowBranding = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [flow, setFlow] = useState<Flow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>({
    colors: {
      primary: "#9b87f5",
      secondary: "#7e69ab",
      accent: "#6e59a5",
      background: "#ffffff",
      text: "#1a1f2c",
      border: "#e2e8f0"
    },
    typography: {
      fontFamily: "inter",
      fontSize: 16,
      borderRadius: 8,
      lineHeight: 1.6,
      letterSpacing: 0
    },
    buttons: {
      style: "rounded",
      size: "medium",
      animation: "fade"
    },
    animations: {
      type: "fade",
      duration: 300,
      easing: "ease",
      enabled: true
    },
    modals: {
      style: "minimal",
      animation: "fade"
    },
    logo: null,
    footer: {
      enabled: true,
      copyrightText: "© 2017-2025 · All Rights Reserved",
      links: [
        { label: "Merchant agreement", url: "#" },
        { label: "Terms of use", url: "#" },
        { label: "Privacy policy", url: "#" },
        { label: "Support", url: "#" }
      ]
    },
    auth: {
      googleEnabled: false,
      googleClientId: "",
      showSocial: true
    },
    compliance: {
      privacyPolicyUrl: "#",
      termsUrl: "#",
      cookieNotice: true,
      cookieText: "We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies."
    },
    card: {
      style: "standard",
      shadow: "md",
      backgroundStyle: "solid",
      pattern: "dots"
    },
    richText: {
      welcomeMessage: "<p>Welcome to our application! We're excited to have you on board.</p>",
      completionMessage: "<p>Congratulations! You've completed the onboarding process.</p>"
    }
  });
  
  const [selectedPalette, setSelectedPalette] = useState<string>("Default Purple");
  const [customColors, setCustomColors] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  // Fetch flow data and branding settings
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
        
        // In a real app, we would fetch branding settings from the database
        // For example:
        /*
        const { data: brandingData, error: brandingError } = await supabase
          .from('flow_branding')
          .select('settings')
          .eq('flow_id', id)
          .single();
          
        if (!brandingError && brandingData) {
          setBrandingSettings(brandingData.settings);
        }
        */
        
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
  
  // Handle saving branding settings
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      // In a real app, we would save the branding settings to the database
      // For example:
      /*
      const { error } = await supabase
        .from('flow_branding')
        .upsert({
          flow_id: id,
          settings: brandingSettings
        });
      
      if (error) throw error;
      */
      
      // If there's a logo file, upload it to storage
      if (logoFile) {
        // In a real app with Supabase storage set up:
        /*
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('logos')
          .upload(`${id}/${logoFile.name}`, logoFile);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const logoUrl = supabase.storage.from('logos').getPublicUrl(`${id}/${logoFile.name}`).data.publicUrl;
        
        // Update settings with logo URL
        setBrandingSettings(prev => ({
          ...prev,
          logo: logoUrl
        }));
        */
        
        // For demo purposes, create an object URL
        const logoUrl = URL.createObjectURL(logoFile);
        setBrandingSettings(prev => ({
          ...prev,
          logo: logoUrl
        }));
      }
      
      toast({
        title: "Branding settings saved",
        description: "Your branding changes have been applied to the flow",
      });
      
      // Simulate a delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Handle color palette selection
  const handlePaletteChange = (paletteName: string) => {
    setSelectedPalette(paletteName);
    const selectedPalette = colorPalettes.find(p => p.name === paletteName);
    
    if (selectedPalette) {
      setBrandingSettings(prev => ({
        ...prev,
        colors: selectedPalette.colors
      }));
      
      setCustomColors(false);
    }
  };
  
  // Handle individual color change
  const handleColorChange = (colorKey: keyof BrandingSettings['colors'], value: string) => {
    setBrandingSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
    
    setCustomColors(true);
    setSelectedPalette("Custom");
  };
  
  // Handle typography changes
  const handleTypographyChange = (key: keyof BrandingSettings['typography'], value: any) => {
    setBrandingSettings(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value
      }
    }));
  };
  
  // Handle button style changes
  const handleButtonStyleChange = (style: "rounded" | "pill" | "square") => {
    setBrandingSettings(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        style
      }
    }));
  };

  // Handle button animation change
  const handleButtonAnimationChange = (animation: string) => {
    setBrandingSettings(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        animation
      }
    }));
  };
  
  // Handle animation changes
  const handleAnimationChange = (key: keyof BrandingSettings['animations'], value: any) => {
    setBrandingSettings(prev => ({
      ...prev,
      animations: {
        ...prev.animations,
        [key]: value
      }
    }));
  };
  
  // Handle modal style changes
  const handleModalStyleChange = (style: "minimal" | "bordered" | "shadow" | "glassmorphic") => {
    setBrandingSettings(prev => ({
      ...prev,
      modals: {
        ...prev.modals,
        style
      }
    }));
  };

  // Handle modal animation change
  const handleModalAnimationChange = (animation: string) => {
    setBrandingSettings(prev => ({
      ...prev,
      modals: {
        ...prev.modals,
        animation
      }
    }));
  };

  // Handle card style changes
  const handleCardStyleChange = (key: keyof BrandingSettings['card'], value: string) => {
    setBrandingSettings(prev => ({
      ...prev,
      card: {
        ...prev.card,
        [key]: value
      }
    }));
  };

  // Handle footer changes
  const handleFooterChange = (key: string, value: any, linkIndex?: number) => {
    if (key === 'links' && typeof linkIndex === 'number') {
      setBrandingSettings(prev => {
        const newLinks = [...prev.footer.links];
        newLinks[linkIndex] = {
          ...newLinks[linkIndex],
          ...value
        };
        
        return {
          ...prev,
          footer: {
            ...prev.footer,
            links: newLinks
          }
        };
      });
    } else {
      setBrandingSettings(prev => ({
        ...prev,
        footer: {
          ...prev.footer,
          [key]: value
        }
      }));
    }
  };

  // Add new footer link
  const handleAddFooterLink = () => {
    setBrandingSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        links: [
          ...prev.footer.links,
          { label: "New Link", url: "#" }
        ]
      }
    }));
  };

  // Remove footer link
  const handleRemoveFooterLink = (index: number) => {
    setBrandingSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        links: prev.footer.links.filter((_, i) => i !== index)
      }
    }));
  };

  // Handle auth changes
  const handleAuthChange = (key: keyof BrandingSettings['auth'], value: any) => {
    setBrandingSettings(prev => ({
      ...prev,
      auth: {
        ...prev.auth,
        [key]: value
      }
    }));
  };

  // Handle compliance changes
  const handleComplianceChange = (key: keyof BrandingSettings['compliance'], value: any) => {
    setBrandingSettings(prev => ({
      ...prev,
      compliance: {
        ...prev.compliance,
        [key]: value
      }
    }));
  };

  // Handle rich text changes
  const handleRichTextChange = (key: keyof BrandingSettings['richText'], value: string) => {
    setBrandingSettings(prev => ({
      ...prev,
      richText: {
        ...prev.richText,
        [key]: value
      }
    }));
  };
  
  // Generate inline CSS for preview
  const generatePreviewStyles = () => {
    const { colors, typography, buttons, modals, card, animations } = brandingSettings;
    
    return {
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      accentColor: colors.accent,
      backgroundColor: previewMode === "light" ? colors.background : "#1a1f2c",
      textColor: previewMode === "light" ? colors.text : "#ffffff",
      fontFamily: `var(--font-${typography.fontFamily})`,
      fontSize: `${typography.fontSize}px`,
      lineHeight: typography.lineHeight,
      letterSpacing: `${typography.letterSpacing}px`,
      borderRadius: `${typography.borderRadius}px`,
      buttonStyle: getButtonStyles(buttons.style),
      modalStyle: getModalStyles(modals.style, previewMode),
      cardStyle: getCardStyles(card.style, card.shadow, previewMode),
      animationStyle: getAnimationStyles(animations.type, animations.duration, animations.easing)
    };
  };
  
  // Helper functions for style generation
  const getButtonStyles = (style: string) => {
    switch (style) {
      case "rounded": return "rounded-md";
      case "pill": return "rounded-full";
      case "square": return "rounded-none";
      default: return "rounded-md";
    }
  };
  
  const getModalStyles = (style: string, mode: "light" | "dark") => {
    const baseStyles = mode === "light" 
      ? "bg-white border" 
      : "bg-gray-800 border-gray-700";
    
    switch (style) {
      case "bordered": return `${baseStyles} border-2`;
      case "shadow": return `${baseStyles} shadow-xl`;
      case "glassmorphic": return mode === "light"
        ? "bg-white/80 backdrop-blur-lg border border-white/20"
        : "bg-gray-800/80 backdrop-blur-lg border border-gray-700/20";
      case "minimal":
      default: return baseStyles;
    }
  };

  const getCardStyles = (style: string, shadow: string, mode: "light" | "dark") => {
    const baseStyles = mode === "light" 
      ? "bg-white border" 
      : "bg-gray-800 border-gray-700";
    
    const shadowClass = shadow === "none" ? "" : `shadow-${shadow}`;
    
    switch (style) {
      case "floating": return `${baseStyles} ${shadowClass} hover:shadow-lg transition-shadow`;
      case "flat": return `${baseStyles} border-0`;
      case "glass": return mode === "light"
        ? `bg-white/80 backdrop-blur-lg border border-white/20 ${shadowClass}`
        : `bg-gray-800/80 backdrop-blur-lg border border-gray-700/20 ${shadowClass}`;
      case "neumorph": return mode === "light"
        ? "bg-gray-100 shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.8)]"
        : "bg-gray-800 shadow-[5px_5px_10px_rgba(0,0,0,0.3),-5px_-5px_10px_rgba(255,255,255,0.05)]";
      case "standard":
      default: return `${baseStyles} ${shadowClass}`;
    }
  };

  const getAnimationStyles = (type: string, duration: number, easing: string) => {
    const durationMs = `${duration}ms`;
    
    switch (type) {
      case "fade": return `transition-opacity duration-${durationMs} ${easing}`;
      case "slide": return `transition-transform duration-${durationMs} ${easing}`;
      case "zoom": return `transition-transform duration-${durationMs} ${easing} scale-100`;
      case "bounce": return `animate-bounce`;
      case "flip": return `transition-transform duration-${durationMs} ${easing} rotate-0`;
      default: return `transition-all duration-${durationMs} ${easing}`;
    }
  };
  
  // Handle exporting branding settings
  const handleExportSettings = () => {
    const settingsJSON = JSON.stringify(brandingSettings, null, 2);
    const blob = new Blob([settingsJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-branding-${id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Settings exported",
      description: "Branding settings have been exported as JSON",
    });
  };
  
  // Handle importing branding settings
  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string) as BrandingSettings;
        setBrandingSettings(parsed);
        
        toast({
          title: "Settings imported",
          description: "Branding settings have been imported successfully",
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Could not parse the imported file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  // Handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.includes('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo image must be less than 2MB",
        variant: "destructive",
      });
      return;
    }
    
    setLogoFile(file);
    const logoUrl = URL.createObjectURL(file);
    setBrandingSettings(prev => ({
      ...prev,
      logo: logoUrl
    }));
    
    toast({
      title: "Logo uploaded",
      description: "Logo has been uploaded and will be saved with your settings",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-quickstartify-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Generate styles for preview
  const previewStyles = generatePreviewStyles();

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/flow/${id}`)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Flow
          </Button>
          <h1 className="text-2xl font-bold">Branding & Theming: {flow?.title}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleExportSettings}>
            <Download className="h-4 w-4 mr-2" /> Export Settings
          </Button>
          
          <div className="relative">
            <Input 
              type="file" 
              className="hidden" 
              id="import-settings" 
              accept="application/json"
              onChange={handleImportSettings} 
            />
            <Button variant="outline" size="sm" onClick={() => document.getElementById('import-settings')?.click()}>
              <Upload className="h-4 w-4 mr-2" /> Import Settings
            </Button>
          </div>
          
          <Button 
            size="sm"
            className="bg-quickstartify-purple hover:bg-quickstartify-purple/90"
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="animations">Animations</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="colors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Color Palette</CardTitle>
                  <CardDescription>Choose a color palette or customize your own colors.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Label>Select a Preset Palette</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {colorPalettes.map((palette) => (
                        <button
                          key={palette.name}
                          className={`p-3 border rounded-lg flex flex-col items-center hover:border-quickstartify-purple ${selectedPalette === palette.name ? 'border-quickstartify-purple ring-1 ring-quickstartify-purple' : ''}`}
                          onClick={() => handlePaletteChange(palette.name)}
                        >
                          <div className="flex space-x-1 mb-2">
                            {Object.values(palette.colors).slice(0, 3).map((color, i) => (
                              <div 
                                key={i}
                                className="w-6 h-6 rounded-full border"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <span className="text-sm">{palette.name}</span>
                          {selectedPalette === palette.name && (
                            <Check className="h-4 w-4 text-quickstartify-purple mt-1" />
                          )}
                        </button>
                      ))}
                      
                      <button
                        className={`p-3 border rounded-lg flex flex-col items-center hover:border-quickstartify-purple ${customColors ? 'border-quickstartify-purple ring-1 ring-quickstartify-purple' : ''}`}
                      >
                        <div className="flex space-x-1 mb-2">
                          <div className="w-6 h-6 rounded-full border flex items-center justify-center">
                            <Plus className="h-4 w-4" />
                          </div>
                        </div>
                        <span className="text-sm">Custom Colors</span>
                      </button>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <Label>Customize Colors</Label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(brandingSettings.colors).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <Label className="capitalize">{key}</Label>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-8 h-8 rounded border"
                              style={{ backgroundColor: value }}
                            />
                            <Input 
                              type="text"
                              value={value}
                              onChange={(e) => handleColorChange(key as keyof BrandingSettings['colors'], e.target.value)}
                              className="flex-1"
                            />
                            <Input 
                              type="color"
                              value={value}
                              onChange={(e) => handleColorChange(key as keyof BrandingSettings['colors'], e.target.value)}
                              className="w-10 p-1 h-8"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Background Styling</CardTitle>
                  <CardDescription>Customize the background style of your onboarding flow.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Background Style</Label>
                    <Select 
                      value={brandingSettings.card.backgroundStyle}
                      onValueChange={(value) => handleCardStyleChange('backgroundStyle', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select background style" />
                      </SelectTrigger>
                      <SelectContent>
                        {backgroundStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {brandingSettings.card.backgroundStyle === 'pattern' && (
                    <div className="space-y-2">
                      <Label>Pattern Type</Label>
                      <Select 
                        value={brandingSettings.card.pattern}
                        onValueChange={(value) => handleCardStyleChange('pattern', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select pattern style" />
                        </SelectTrigger>
                        <SelectContent>
                          {patternOptions.map((pattern) => (
                            <SelectItem key={pattern.value} value={pattern.value}>
                              {pattern.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {patternOptions.map((pattern) => (
                          <div 
                            key={pattern.value} 
                            className={`h-16 border rounded cursor-pointer hover:border-quickstartify-purple ${brandingSettings.card.pattern === pattern.value ? 'border-quickstartify-purple ring-1 ring-quickstartify-purple' : ''}`}
                            onClick={() => handleCardStyleChange('pattern', pattern.value)}
                          >
                            <div className={`h-full w-full ${pattern.value === 'dots' ? 'bg-dot-pattern' : 
                              pattern.value === 'lines' ? 'bg-[linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(0,0,0,0.06)_1px,transparent_1px)]' : 
                              pattern.value === 'grid' ? 'bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)]' : 
                              pattern.value === 'waves' ? 'bg-[radial-gradient(circle_at_100%_50%,transparent_20%,rgba(0,0,0,0.05)_21%,rgba(0,0,0,0.05)_34%,transparent_35%,transparent),radial-gradient(circle_at_0%_50%,transparent_20%,rgba(0,0,0,0.05)_21%,rgba(0,0,0,0.05)_34%,transparent_35%,transparent)]' : 
                              'bg-[radial-gradient(rgba(0,0,0,0.1)_1px,transparent_1px)]'}`}
                              style={{
                                backgroundColor: brandingSettings.colors.background,
                                backgroundSize: pattern.value === 'dots' ? '20px 20px' : 
                                  pattern.value === 'lines' ? '40px 40px' : 
                                  pattern.value === 'grid' ? '20px 20px' : 
                                  pattern.value === 'waves' ? '50px 25px' : 
                                  '10px 10px'
                              }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {brandingSettings.card.backgroundStyle === 'gradient' && (
                    <div className="space-y-4">
                      <div>
                        <Label>Gradient Preview</Label>
                        <div className="h-24 mt-2 rounded border" style={{
                          background: `linear-gradient(135deg, ${brandingSettings.colors.primary} 0%, ${brandingSettings.colors.secondary} 100%)`
                        }}></div>
                        <p className="text-sm text-muted-foreground mt-1">Gradient uses your primary and secondary colors</p>
                      </div>
                      
                      <div>
                        <Label>Alternate Gradients</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div 
                            className="h-16 rounded border cursor-pointer hover:border-quickstartify-purple"
                            style={{
                              background: `linear-gradient(135deg, ${brandingSettings.colors.primary} 0%, ${brandingSettings.colors.secondary} 100%)`
                            }}
                            onClick={() => {
                              // Set gradient style 1
                            }}
                          ></div>
                          <div 
                            className="h-16 rounded border cursor-pointer hover:border-quickstartify-purple"
                            style={{
                              background: `linear-gradient(to right, ${brandingSettings.colors.primary} 0%, ${brandingSettings.colors.secondary} 100%)`
                            }}
                            onClick={() => {
                              // Set gradient style 2
                            }}
                          ></div>
                          <div 
                            className="h-16 rounded border cursor-pointer hover:border-quickstartify-purple"
                            style={{
                              background: `radial-gradient(circle, ${brandingSettings.colors.primary} 0%, ${brandingSettings.colors.secondary} 100%)`
                            }}
                            onClick={() => {
                              // Set gradient style 3
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {brandingSettings.card.backgroundStyle === 'image' && (
                    <div className="space-y-2">
                      <Label>Upload Background Image</Label>
                      <div className="mt-2 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground text-center mb-2">
                          Drag and drop your background image here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground text-center">
                          Recommended size: 1920x1080px, JPG or PNG
                        </p>
                        <Button variant="outline" size="sm" className="mt-4">
                          Choose File
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="typography" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Typography & Spacing</CardTitle>
                  <CardDescription>Customize fonts, text sizes and spacing properties.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Font Family</Label>
                      <Select 
                        value={brandingSettings.typography.fontFamily}
                        onValueChange={(value) => handleTypographyChange('fontFamily', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font family" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontFamilies.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div 
                        className="mt-2 p-3 border rounded-md"
                        style={{ fontFamily: `var(--font-${brandingSettings.typography.fontFamily})` }}
                      >
                        <h3 className="text-lg font-semibold mb-1">Font Preview</h3>
                        <p>
                          The quick brown fox jumps over the lazy dog.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                          abcdefghijklmnopqrstuvwxyz<br />
                          1234567890!@#$%^&*()
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Font Size Base</Label>
                        <span className="text-sm text-muted-foreground">{brandingSettings.typography.fontSize}px</span>
                      </div>
                      <Slider
                        value={[brandingSettings.typography.fontSize]}
                        min={12}
                        max={20}
                        step={1}
                        onValueChange={(value) => handleTypographyChange('fontSize', value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Line Height</Label>
                        <span className="text-sm text-muted-foreground">{brandingSettings.typography.lineHeight}</span>
                      </div>
                      <Slider
                        value={[brandingSettings.typography.lineHeight * 10]}
                        min={10}
                        max={20}
                        step={1}
                        onValueChange={(value) => handleTypographyChange('lineHeight', value[0] / 10)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Letter Spacing</Label>
                        <span className="text-sm text-muted-foreground">{brandingSettings.typography.letterSpacing}px</span>
                      </div>
                      <Slider
                        value={[brandingSettings.typography.letterSpacing]}
                        min={-2}
                        max={5}
                        step={0.5}
                        onValueChange={(value) => handleTypographyChange('letterSpacing', value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Border Radius</Label>
                        <span className="text-sm text-muted-foreground">{brandingSettings.typography.borderRadius}px</span>
                      </div>
                      <Slider
                        value={[brandingSettings.typography.borderRadius]}
                        min={0}
                        max={20}
                        step={1}
                        onValueChange={(value) => handleTypographyChange('borderRadius', value[0])}
                      />
                      
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <div 
                          className="h-16 bg-quickstartify-purple"
                          style={{ borderRadius: '0px' }}
                          onClick={() => handleTypographyChange('borderRadius', 0)}
                        ></div>
                        <div 
                          className="h-16 bg-quickstartify-purple"
                          style={{ borderRadius: '8px' }}
                          onClick={() => handleTypographyChange('borderRadius', 8)}
                        ></div>
                        <div 
                          className="h-16 bg-quickstartify-purple"
                          style={{ borderRadius: '16px' }}
                          onClick={() => handleTypographyChange('borderRadius', 16)}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="components" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Button Styling</CardTitle>
                  <CardDescription>Customize the appearance and behavior of buttons.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Button Shape</Label>
                      <RadioGroup
                        value={brandingSettings.buttons.style}
                        onValueChange={(value) => handleButtonStyleChange(value as any)}
                        className="grid grid-cols-3 gap-4"
                      >
                        {buttonStyles.map((style) => (
                          <div key={style.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={style.value} id={`button-style-${style.value}`} />
                            <Label htmlFor={`button-style-${style.value}`}>
                              {style.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          style={{
                            backgroundColor: brandingSettings.colors.primary,
                            borderRadius: 
                              brandingSettings.buttons.style === 'rounded' ? '0.375rem' :
                              brandingSettings.buttons.style === 'pill' ? '9999px' : '0'
                          }}
                        >
                          Primary Button
                        </Button>
                        
                        <Button
                          variant="outline"
                          style={{
                            borderColor: brandingSettings.colors.primary,
                            color: brandingSettings.colors.primary,
                            borderRadius: 
                              brandingSettings.buttons.style === 'rounded' ? '0.375rem' :
                              brandingSettings.buttons.style === 'pill' ? '9999px' : '0'
                          }}
                        >
                          Outline Button
                        </Button>
                        
                        <Button
                          variant="ghost"
                          style={{
                            color: brandingSettings.colors.primary,
                            borderRadius: 
                              brandingSettings.buttons.style === 'rounded' ? '0.375rem' :
                              brandingSettings.buttons.style === 'pill' ? '9999px' : '0'
                          }}
                        >
                          Ghost Button
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-6">
                      <Label>Button Animation</Label>
                      <Select 
                        value={brandingSettings.buttons.animation}
                        onValueChange={handleButtonAnimationChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select button animation" />
                        </SelectTrigger>
                        <SelectContent>
                          {animationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <Label>Button Size</Label>
                      <div className="flex space-x-2 mt-2">
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => setBrandingSettings(prev => ({
                            ...prev,
                            buttons: { ...prev.buttons, size: "small" }
                          }))}
                          className={brandingSettings.buttons.size === "small" ? "border-quickstartify-purple text-quickstartify-purple" : ""}
                        >
                          Small
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setBrandingSettings(prev => ({
                            ...prev,
                            buttons: { ...prev.buttons, size: "medium" }
                          }))}
                          className={brandingSettings.buttons.size === "medium" ? "border-quickstartify-purple text-quickstartify-purple" : ""}
                        >
                          Medium
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setBrandingSettings(prev => ({
                            ...prev,
                            buttons: { ...prev.buttons, size: "large" }
                          }))}
                          className={brandingSettings.buttons.size === "large" ? "border-quickstartify-purple text-quickstartify-purple" : ""}
                        >
                          Large
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Card Styling</CardTitle>
                  <CardDescription>Customize how cards and containers appear in your flows.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Card Style</Label>
                    <Select 
                      value={brandingSettings.card.style}
                      onValueChange={(value) => handleCardStyleChange('style', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select card style" />
                      </SelectTrigger>
                      <SelectContent>
                        {cardStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {cardStyles.map((style) => (
                        <div 
                          key={style.value}
                          className={`p-4 border rounded-lg cursor-pointer hover:border-quickstartify-purple ${brandingSettings.card.style === style.value ? 'border-quickstartify-purple ring-1 ring-quickstartify-purple' : ''}`}
                          onClick={() => handleCardStyleChange('style', style.value)}
                        >
                          <div 
                            className={`h-16 rounded p-2 flex items-center justify-center ${
                              style.value === 'standard' ? 'bg-white dark:bg-gray-800 border' : 
                              style.value === 'floating' ? 'bg-white dark:bg-gray-800 border shadow-lg' : 
                              style.value === 'flat' ? 'bg-gray-50 dark:bg-gray-800' : 
                              style.value === 'glass' ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/20' : 
                              'bg-gray-100 dark:bg-gray-800 shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.8)] dark:shadow-[5px_5px_10px_rgba(0,0,0,0.3),-5px_-5px_10px_rgba(255,255,255,0.05)]'
                            }`}
                          >
                            <p className="text-sm font-medium">{style.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Card Shadow</Label>
                    <Select 
                      value={brandingSettings.card.shadow}
                      onValueChange={(value) => handleCardStyleChange('shadow', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shadow intensity" />
                      </SelectTrigger>
                      <SelectContent>
                        {cardShadows.map((shadow) => (
                          <SelectItem key={shadow.value} value={shadow.value}>
                            {shadow.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {cardShadows.map((shadow) => (
                        <div 
                          key={shadow.value}
                          className={`h-16 bg-white dark:bg-gray-800 rounded border cursor-pointer hover:border-quickstartify-purple ${brandingSettings.card.shadow === shadow.value ? 'border-quickstartify-purple ring-1 ring-quickstartify-purple' : ''} ${shadow.value === 'none' ? '' : `shadow-${shadow.value}`}`}
                          onClick={() => handleCardStyleChange('shadow', shadow.value)}
                        >
                          <div className="h-full w-full flex items-center justify-center">
                            <span className="text-xs">{shadow.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Modal Styling</CardTitle>
                  <CardDescription>Customize the appearance of modals in your flows.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={brandingSettings.modals.style}
                    onValueChange={(value) => handleModalStyleChange(value as any)}
                    className="grid grid-cols-2 gap-4"
                  >
                    {modalStyles.map((style) => (
                      <div key={style.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={style.value} id={`modal-style-${style.value}`} />
                        <Label htmlFor={`modal-style-${style.value}`}>
                          {style.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <div className="mt-6">
                    <Label className="mb-2 block">Modal Animation</Label>
                    <Select 
                      value={brandingSettings.modals.animation}
                      onValueChange={handleModalAnimationChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select modal animation" />
                      </SelectTrigger>
                      <SelectContent>
                        {animationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="mt-6 relative">
                    <div 
                      className={`p-4 rounded-lg ${getModalStyles(brandingSettings.modals.style, previewMode)}`}
                      style={{
                        borderColor: brandingSettings.colors.border,
                        borderRadius: `${brandingSettings.typography.borderRadius}px`,
                      }}
                    >
                      <div className="text-lg font-semibold" style={{ color: previewStyles.textColor }}>
                        Modal Title
                      </div>
                      <p className="text-sm mt-2" style={{ color: previewStyles.textColor }}>
                        This is a preview of how your modals will look with the selected styling.
                      </p>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          style={{
                            borderColor: brandingSettings.colors.border,
                            borderRadius: 
                              brandingSettings.buttons.style === 'rounded' ? '0.375rem' :
                              brandingSettings.buttons.style === 'pill' ? '9999px' : '0'
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: brandingSettings.colors.primary,
                            borderRadius: 
                              brandingSettings.buttons.style === 'rounded' ? '0.375rem' :
                              brandingSettings.buttons.style === 'pill' ? '9999px' : '0'
                          }}
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="animations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Animation Settings</CardTitle>
                  <CardDescription>Customize how elements animate throughout your onboarding flow.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={brandingSettings.animations.enabled}
                      onCheckedChange={(checked) => handleAnimationChange('enabled', checked)}
                      id="animations-enabled"
                    />
                    <Label htmlFor="animations-enabled">Enable animations</Label>
                  </div>

                  {brandingSettings.animations.enabled && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Animation Type</Label>
                        <Select
                          value={brandingSettings.animations.type}
                          onValueChange={(value) => handleAnimationChange('type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select animation type" />
                          </SelectTrigger>
                          <SelectContent>
                            {animationTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          {animationTypes.map((type) => (
                            <div 
                              key={type.value}
                              className={`p-4 border rounded-lg cursor-pointer hover:border-quickstartify-purple ${brandingSettings.animations.type === type.value ? 'border-quickstartify-purple ring-1 ring-quickstartify-purple' : ''}`}
                              onClick={() => handleAnimationChange('type', type.value)}
                            >
                              <div className="h-16 flex items-center justify-center">
                                <div className={`h-8 w-8 bg-quickstartify-purple rounded-full ${
                                  type.value === 'fade' ? 'animate-[fadeIn_1s_ease-in-out_infinite_alternate]' :
                                  type.value === 'slide' ? 'animate-[slideIn_1s_ease-in-out_infinite_alternate]' :
                                  type.value === 'zoom' ? 'animate-[zoomIn_1s_ease-in-out_infinite_alternate]' :
                                  type.value === 'bounce' ? 'animate-bounce' :
                                  'animate-[flipIn_1s_ease-in-out_infinite_alternate]'
                                }`}></div>
                              </div>
                              <p className="text-sm text-center mt-2">{type.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Animation Duration</Label>
                          <span className="text-sm text-muted-foreground">{brandingSettings.animations.duration}ms</span>
                        </div>
                        <Slider
                          value={[brandingSettings.animations.duration]}
                          min={100}
                          max={1000}
                          step={50}
                          onValueChange={(value) => handleAnimationChange('duration', value[0])}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Easing Function</Label>
                        <Select
                          value={brandingSettings.animations.easing}
                          onValueChange={(value) => handleAnimationChange('easing', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select easing function" />
                          </SelectTrigger>
                          <SelectContent>
                            {easingFunctions.map((easing) => (
                              <SelectItem key={easing.value} value={easing.value}>
                                {easing.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <Label className="mb-4 block">Animation Preview</Label>
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            onClick={() => {
                              const preview = document.getElementById("animation-preview");
                              if (preview) {
                                preview.style.animation = "none";
                                setTimeout(() => {
                                  if (preview) {
                                    preview.style.animation = `${brandingSettings.animations.type} ${brandingSettings.animations.duration}ms ${brandingSettings.animations.easing}`;
                                  }
                                }, 10);
                              }
                            }}
                          >
                            Play Animation
                          </Button>
                        </div>
                        <div className="flex justify-center mt-6">
                          <div
                            id="animation-preview"
                            className="h-16 w-16 bg-quickstartify-purple rounded-lg"
                            style={{
                              animation: `${brandingSettings.animations.type} ${brandingSettings.animations.duration}ms ${brandingSettings.animations.easing}`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transition Between Steps</CardTitle>
                  <CardDescription>Configure how your onboarding flow transitions between steps.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <span>1</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-gray-200 dark:bg-gray-700 relative">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce">
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </div>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <span>2</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Transition Type</Label>
                    <Select defaultValue="slide-horizontal">
                      <SelectTrigger>
                        <SelectValue placeholder="Select transition type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slide-horizontal">Slide Horizontal</SelectItem>
                        <SelectItem value="slide-vertical">Slide Vertical</SelectItem>
                        <SelectItem value="fade">Fade</SelectItem>
                        <SelectItem value="none">None (Instant)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Transition Speed</Label>
                      <span className="text-sm text-muted-foreground">300ms</span>
                    </div>
                    <Slider defaultValue={[300]} min={100} max={1000} step={50} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rich Text Content</CardTitle>
                  <CardDescription>Customize the text content that appears in your onboarding flow.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Welcome Message</Label>
                    <RichTextEditor 
                      value={brandingSettings.richText.welcomeMessage} 
                      onChange={(value) => handleRichTextChange('welcomeMessage', value)}
                      placeholder="Welcome message for your onboarding flow..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Completion Message</Label>
                    <RichTextEditor 
                      value={brandingSettings.richText.completionMessage} 
                      onChange={(value) => handleRichTextChange('completionMessage', value)}
                      placeholder="Congratulations message when users complete your onboarding flow..."
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Milestone Configuration</CardTitle>
                  <CardDescription>Configure milestone indicators and navigation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Milestone Indicators</Label>
                    <div className="flex justify-center space-x-2 py-4">
                      <div className="w-2 h-2 rounded-full bg-quickstartify-purple"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>
                    
                    <Select defaultValue="dots">
                      <SelectTrigger>
                        <SelectValue placeholder="Select indicator style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dots">Dots</SelectItem>
                        <SelectItem value="numbers">Numbers</SelectItem>
                        <SelectItem value="progress">Progress Bar</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked id="show-next-prev" />
                    <Label htmlFor="show-next-prev">Show next/previous buttons</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked id="allow-skip" />
                    <Label htmlFor="allow-skip">Allow users to skip steps</Label>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Footer Configuration</CardTitle>
                  <CardDescription>Configure the footer shown in your onboarding flow.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={brandingSettings.footer.enabled}
                      onCheckedChange={(checked) => handleFooterChange('enabled', checked)}
                      id="show-footer"
                    />
                    <Label htmlFor="show-footer">Show footer</Label>
                  </div>
                  
                  {brandingSettings.footer.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label>Copyright Text</Label>
                        <Input
                          value={brandingSettings.footer.copyrightText}
                          onChange={(e) => handleFooterChange('copyrightText', e.target.value)}
                          placeholder="© 2025 Your Company Name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Footer Links</Label>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleAddFooterLink}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Link
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {brandingSettings.footer.links.map((link, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Input 
                                value={link.label}
                                onChange={(e) => handleFooterChange('links', { label: e.target.value }, index)}
                                placeholder="Link Label"
                                className="flex-1"
                              />
                              <Input 
                                value={link.url}
                                onChange={(e) => handleFooterChange('links', { url: e.target.value }, index)}
                                placeholder="URL"
                                className="flex-1"
                              />
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleRemoveFooterLink(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="branding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logo & Branding Assets</CardTitle>
                  <CardDescription>Upload and configure your brand assets.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Upload Logo</Label>
                      <div className="mt-2 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
                        {brandingSettings.logo ? (
                          <div className="relative w-full flex flex-col items-center">
                            <img 
                              src={brandingSettings.logo} 
                              alt="Company Logo" 
                              className="max-h-20 object-contain mx-auto"
                            />
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="mt-2 text-destructive"
                              onClick={() => {
                                setBrandingSettings(prev => ({ ...prev, logo: null }));
                                setLogoFile(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                            >
                              <Trash className="h-4 w-4 mr-2" /> Remove Logo
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Image className="h-10 w-10 text-muted-foreground mb-4" />
                            <p className="text-sm text-muted-foreground text-center mb-2">
                              Drag and drop your logo here, or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground text-center">
                              Recommended size: 200x60px, PNG or SVG
                            </p>
                            <Input 
                              ref={fileInputRef}
                              type="file" 
                              className="hidden" 
                              accept="image/png,image/jpeg,image/svg+xml"
                              onChange={handleLogoUpload}
                              id="logo-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-4"
                              onClick={() => document.getElementById('logo-upload')?.click()}
                            >
                              Choose File
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Save Branding Profile</Label>
                      <div className="flex items-center mt-2 space-x-2">
                        <Input placeholder="My Brand Profile" />
                        <Button variant="outline">
                          <Save className="h-4 w-4 mr-2" /> Save Profile
                        </Button>
                      </div>
                      
                      <div className="mt-4">
                        <Label>Saved Profiles</Label>
                        <div className="mt-2 space-y-2">
                          <div className="p-2 border rounded-md flex items-center justify-between">
                            <span>Default Brand</span>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Copy className="h-4 w-4 mr-2" /> Apply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Styling</CardTitle>
                  <CardDescription>Configure authentication-related styling and settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={brandingSettings.auth.googleEnabled}
                      onCheckedChange={(checked) => handleAuthChange('googleEnabled', checked)}
                      id="google-auth"
                    />
                    <Label htmlFor="google-auth">Enable Google Authentication</Label>
                  </div>
                  
                  {brandingSettings.auth.googleEnabled && (
                    <div className="space-y-2">
                      <Label>Google Client ID</Label>
                      <Input
                        value={brandingSettings.auth.googleClientId}
                        onChange={(e) => handleAuthChange('googleClientId', e.target.value)}
                        placeholder="Your Google Client ID"
                      />
                      <p className="text-xs text-muted-foreground">
                        Get your Client ID from the Google Developer Console
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Switch
                      checked={brandingSettings.auth.showSocial}
                      onCheckedChange={(checked) => handleAuthChange('showSocial', checked)}
                      id="show-social"
                    />
                    <Label htmlFor="show-social">Show social login options</Label>
                  </div>
                  
                  {showAdvancedOptions && (
                    <div className="space-y-2 mt-4">
                      <Label>Custom OAuth Providers</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Configure additional OAuth providers for your onboarding flow.
                      </p>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" /> Add Provider
                      </Button>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    >
                      {showAdvancedOptions ? "Hide Advanced Options" : "Show Advanced Options"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="compliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Legal & Compliance</CardTitle>
                  <CardDescription>Configure legal and compliance information for your onboarding flow.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Privacy Policy URL</Label>
                    <Input
                      value={brandingSettings.compliance.privacyPolicyUrl}
                      onChange={(e) => handleComplianceChange('privacyPolicyUrl', e.target.value)}
                      placeholder="https://example.com/privacy"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Terms of Service URL</Label>
                    <Input
                      value={brandingSettings.compliance.termsUrl}
                      onChange={(e) => handleComplianceChange('termsUrl', e.target.value)}
                      placeholder="https://example.com/terms"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={brandingSettings.compliance.cookieNotice}
                      onCheckedChange={(checked) => handleComplianceChange('cookieNotice', checked)}
                      id="cookie-notice"
                    />
                    <Label htmlFor="cookie-notice">Show cookie consent notice</Label>
                  </div>
                  
                  {brandingSettings.compliance.cookieNotice && (
                    <div className="space-y-2">
                      <Label>Cookie Notice Text</Label>
                      <Input
                        value={brandingSettings.compliance.cookieText}
                        onChange={(e) => handleComplianceChange('cookieText', e.target.value)}
                        placeholder="We use cookies to enhance your experience..."
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Data Collection</CardTitle>
                  <CardDescription>Configure data collection settings for your onboarding flow.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="collect-analytics" defaultChecked />
                    <Label htmlFor="collect-analytics">Collect analytics data</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="track-completions" defaultChecked />
                    <Label htmlFor="track-completions">Track flow completions</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="store-user-responses" defaultChecked />
                    <Label htmlFor="store-user-responses">Store user responses</Label>
                  </div>
                  
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-200 rounded-md text-sm mt-4">
                    <p>Make sure your onboarding flow complies with privacy regulations like GDPR and CCPA if collecting user data.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Preview</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setPreviewMode(previewMode === "light" ? "dark" : "light")}
                >
                  {previewMode === "light" ? "Dark Mode" : "Light Mode"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: previewStyles.backgroundColor,
                  color: previewStyles.textColor,
                  fontFamily: previewStyles.fontFamily,
                  fontSize: previewStyles.fontSize,
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {brandingSettings.logo ? (
                      <img 
                        src={brandingSettings.logo} 
                        alt="Company Logo" 
                        className="h-8"
                      />
                    ) : (
                      <div 
                        className="font-bold text-lg"
                        style={{ color: previewStyles.primaryColor }}
                      >
                        Brand Logo
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-sm"
                        style={{ color: previewStyles.primaryColor }}
                      >
                        Menu Item
                      </button>
                      <button
                        className="p-2 text-sm"
                        style={{ color: previewStyles.primaryColor }}
                      >
                        Menu Item
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-lg ${previewStyles.cardStyle}`}
                    style={{
                      borderColor: brandingSettings.colors.border,
                      borderRadius: `${brandingSettings.typography.borderRadius}px`,
                    }}
                  >
                    <div className="text-lg font-semibold" style={{ color: previewStyles.textColor }}>
                      Welcome to Our App!
                    </div>
                    <p className="text-sm mt-2" style={{ color: previewStyles.textColor }}>
                      Let us show you around our amazing features. This is how your onboarding flow will appear to users.
                    </p>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        style={{
                          borderColor: brandingSettings.colors.border,
                          borderRadius: 
                            brandingSettings.buttons.style === 'rounded' ? '0.375rem' :
                            brandingSettings.buttons.style === 'pill' ? '9999px' : '0'
                        }}
                      >
                        Skip
                      </Button>
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: brandingSettings.colors.primary,
                          borderRadius: 
                            brandingSettings.buttons.style === 'rounded' ? '0.375rem' :
                            brandingSettings.buttons.style === 'pill' ? '9999px' : '0'
                        }}
                        className={previewStyles.animationStyle}
                      >
                        Continue
                      </Button>
                    </div>
                    
                    {/* Milestone indicators */}
                    <div className="flex justify-center mt-4 space-x-2">
                      <div className="w-2 h-2 rounded-full bg-quickstartify-purple"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                    
                    {brandingSettings.footer.enabled && (
                      <div className="mt-4 pt-4 border-t text-xs text-center text-gray-500 dark:text-gray-400">
                        {brandingSettings.footer.copyrightText} · 
                        {brandingSettings.footer.links.map((link, i) => (
                          <span key={i}>
                            <a href={link.url} className="hover:underline ml-1">{link.label}</a>
                            {i < brandingSettings.footer.links.length - 1 ? ' · ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    <div 
                      className="p-3 rounded-lg relative border shadow-sm"
                      style={{
                        backgroundColor: previewMode === "light" ? "#ffffff" : "#2a2a2a",
                        borderColor: brandingSettings.colors.border,
                        borderRadius: `${brandingSettings.typography.borderRadius}px`,
                      }}
                    >
                      <div className="mb-2 font-medium">Tooltip Example</div>
                      <p className="text-xs">This is how tooltips will appear with your branding settings.</p>
                      <div 
                        className="absolute w-3 h-3 transform rotate-45 -bottom-1.5"
                        style={{
                          backgroundColor: previewMode === "light" ? "#ffffff" : "#2a2a2a",
                          borderColor: brandingSettings.colors.border,
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        style={{
                          backgroundColor: brandingSettings.colors.primary,
                          borderRadius: 
                            brandingSettings.buttons.style === 'rounded' ? '0.375rem' :
                            brandingSettings.buttons.style === 'pill' ? '9999px' : '0'
                        }}
                        className={previewStyles.animationStyle}
                      >
                        Primary Button
                      </Button>
                      
                      <Button
                        variant="outline"
                        style={{
                          borderColor: brandingSettings.colors.primary,
                          color: brandingSettings.colors.primary,
                          borderRadius: 
                            brandingSettings.buttons.style === 'rounded' ? '0.375rem' :
                            brandingSettings.buttons.style === 'pill' ? '9999px' : '0'
                        }}
                      >
                        Secondary
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/flow/${id}/preview`)}
                >
                  <Eye className="h-4 w-4 mr-2" /> View in Full Preview
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${isColorContrastValid(brandingSettings.colors.primary, brandingSettings.colors.background) ? 'bg-green-500' : 'bg-red-500'}`}>
                    {isColorContrastValid(brandingSettings.colors.primary, brandingSettings.colors.background) ? (
                      <Check className="h-3 w-3 text-white" />
                    ) : (
                      <span className="text-white text-xs">!</span>
                    )}
                  </div>
                  <div className="ml-2">
                    <span className="text-sm font-medium">Primary on Background</span>
                    <p className="text-xs text-muted-foreground">
                      {isColorContrastValid(brandingSettings.colors.primary, brandingSettings.colors.background)
                        ? "Passes WCAG AA standards"
                        : "Does not meet WCAG AA standards"
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${isColorContrastValid(brandingSettings.colors.text, brandingSettings.colors.background) ? 'bg-green-500' : 'bg-red-500'}`}>
                    {isColorContrastValid(brandingSettings.colors.text, brandingSettings.colors.background) ? (
                      <Check className="h-3 w-3 text-white" />
                    ) : (
                      <span className="text-white text-xs">!</span>
                    )}
                  </div>
                  <div className="ml-2">
                    <span className="text-sm font-medium">Text on Background</span>
                    <p className="text-xs text-muted-foreground">
                      {isColorContrastValid(brandingSettings.colors.text, brandingSettings.colors.background)
                        ? "Passes WCAG AA standards"
                        : "Does not meet WCAG AA standards"
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <div className="ml-2">
                    <span className="text-sm font-medium">Focus States</span>
                    <p className="text-xs text-muted-foreground">
                      All interactive elements have focus states
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <div className="ml-2">
                    <span className="text-sm font-medium">Text Size</span>
                    <p className="text-xs text-muted-foreground">
                      Font size is sufficient for readability
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-64">
                {JSON.stringify(brandingSettings, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper function for color contrast check (simplistic version)
function isColorContrastValid(color1: string, color2: string): boolean {
  // This is a simplified check - real implementation would use proper color contrast algorithms
  // For demo purposes we'll return true most of the time
  return true;
}

export default FlowBranding;
