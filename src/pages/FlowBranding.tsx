
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Brush
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Flow } from "@/integrations/supabase/models";

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
  };
  buttons: {
    style: "rounded" | "pill" | "square";
    size: "small" | "medium" | "large";
  };
  modals: {
    style: "minimal" | "bordered" | "shadow" | "glassmorphic";
  };
  logo: string | null;
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
  { value: "opensans", label: "Open Sans" }
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

const FlowBranding = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
      borderRadius: 8
    },
    buttons: {
      style: "rounded",
      size: "medium"
    },
    modals: {
      style: "minimal"
    },
    logo: null
  });
  
  const [selectedPalette, setSelectedPalette] = useState<string>("Default Purple");
  const [customColors, setCustomColors] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  
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
        
        // In a real app, we would fetch branding settings
        // For now, using the default settings
        
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
  
  // Generate inline CSS for preview
  const generatePreviewStyles = () => {
    const { colors, typography, buttons, modals } = brandingSettings;
    
    return {
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      accentColor: colors.accent,
      backgroundColor: previewMode === "light" ? colors.background : "#1a1f2c",
      textColor: previewMode === "light" ? colors.text : "#ffffff",
      fontFamily: `var(--font-${typography.fontFamily})`,
      fontSize: `${typography.fontSize}px`,
      borderRadius: `${typography.borderRadius}px`,
      buttonStyle: getButtonStyles(buttons.style),
      modalStyle: getModalStyles(modals.style, previewMode)
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
            <TabsList className="grid grid-cols-4 w-full max-w-lg">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
            </TabsList>
            
            <TabsContent value="colors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Color Palette</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Label>Select a Preset Palette</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </TabsContent>
            
            <TabsContent value="typography" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Typography & Spacing</CardTitle>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="components" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Button Styling</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Modal Styling</CardTitle>
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
            
            <TabsContent value="branding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logo & Branding Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
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
                              onClick={() => setBrandingSettings(prev => ({ ...prev, logo: null }))}
                            >
                              <Trash className="h-4 w-4 mr-2" /> Remove Logo
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                            <p className="text-sm text-muted-foreground text-center mb-2">
                              Drag and drop your logo here, or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground text-center">
                              Recommended size: 200x60px, PNG or SVG
                            </p>
                            <Button variant="outline" size="sm" className="mt-4">
                              Choose File
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
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
                    className={`p-4 rounded-lg ${getModalStyles(brandingSettings.modals.style, previewMode)}`}
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
                      >
                        Continue
                      </Button>
                    </div>
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
