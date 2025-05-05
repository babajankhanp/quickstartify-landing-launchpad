
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Type,
  Circle,
  Square,
  Palette,
  Image as ImageIcon,
  Moon,
  Sun,
  Check,
  Save,
  Redo,
  Upload,
  Copy,
  PanelLeft,
  Eye
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Flow } from "@/integrations/supabase/models";

type BrandingTheme = {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    headingSize: string;
    bodySize: string;
    buttonSize: string;
  };
  borders: {
    radius: string;
    width: string;
  };
  styling: {
    tooltipStyle: string;
    modalStyle: string;
    buttonStyle: string;
  };
};

const colorPresets = [
  { name: "Purple (Default)", primary: "#9b87f5", secondary: "#7e69ab" },
  { name: "Blue", primary: "#0ea5e9", secondary: "#0369a1" },
  { name: "Green", primary: "#10b981", secondary: "#047857" },
  { name: "Red", primary: "#f43f5e", secondary: "#be123c" },
  { name: "Orange", primary: "#f97316", secondary: "#c2410c" },
  { name: "Pink", primary: "#ec4899", secondary: "#be185d" },
];

const fontPresets = [
  { name: "Inter (Default)", family: "Inter, sans-serif" },
  { name: "Roboto", family: "Roboto, sans-serif" },
  { name: "Open Sans", family: "Open Sans, sans-serif" },
  { name: "Montserrat", family: "Montserrat, sans-serif" },
  { name: "Playfair Display", family: "Playfair Display, serif" },
];

const FlowBranding = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [flow, setFlow] = useState<Flow | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTheme, setActiveTheme] = useState<BrandingTheme>({
    id: "default",
    name: "Default Theme",
    colors: {
      primary: "#9b87f5",
      secondary: "#7e69ab",
      background: "#ffffff",
      text: "#1a1f2c",
      border: "#e5e7eb"
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      headingSize: "medium",
      bodySize: "medium",
      buttonSize: "medium"
    },
    borders: {
      radius: "medium",
      width: "thin"
    },
    styling: {
      tooltipStyle: "minimal",
      modalStyle: "rounded",
      buttonStyle: "rounded"
    }
  });
  
  const [savedThemes, setSavedThemes] = useState<BrandingTheme[]>([]);
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Sample saved themes
  const sampleThemes: BrandingTheme[] = [
    {
      id: "default",
      name: "Default Theme",
      colors: {
        primary: "#9b87f5",
        secondary: "#7e69ab",
        background: "#ffffff",
        text: "#1a1f2c",
        border: "#e5e7eb"
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        headingSize: "medium",
        bodySize: "medium",
        buttonSize: "medium"
      },
      borders: {
        radius: "medium",
        width: "thin"
      },
      styling: {
        tooltipStyle: "minimal",
        modalStyle: "rounded",
        buttonStyle: "rounded"
      }
    },
    {
      id: "dark-mode",
      name: "Dark Mode",
      colors: {
        primary: "#9b87f5",
        secondary: "#7e69ab",
        background: "#1a1f2c",
        text: "#f9fafb",
        border: "#374151"
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        headingSize: "medium",
        bodySize: "medium",
        buttonSize: "medium"
      },
      borders: {
        radius: "medium",
        width: "thin"
      },
      styling: {
        tooltipStyle: "minimal",
        modalStyle: "rounded",
        buttonStyle: "rounded"
      }
    },
    {
      id: "minimalist",
      name: "Minimalist",
      colors: {
        primary: "#000000",
        secondary: "#404040",
        background: "#ffffff",
        text: "#000000",
        border: "#e5e5e5"
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        headingSize: "small",
        bodySize: "small",
        buttonSize: "small"
      },
      borders: {
        radius: "small",
        width: "hairline"
      },
      styling: {
        tooltipStyle: "minimal",
        modalStyle: "flat",
        buttonStyle: "flat"
      }
    }
  ];
  
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
        
        // In a real app, we would fetch branding themes
        // For now, we'll use sample data
        setSavedThemes(sampleThemes);
        
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
  
  const handleColorChange = (colorType: keyof BrandingTheme['colors'], value: string) => {
    setActiveTheme({
      ...activeTheme,
      colors: {
        ...activeTheme.colors,
        [colorType]: value
      }
    });
  };
  
  const handleTypographyChange = (typographyType: keyof BrandingTheme['typography'], value: string) => {
    setActiveTheme({
      ...activeTheme,
      typography: {
        ...activeTheme.typography,
        [typographyType]: value
      }
    });
  };
  
  const handleBordersChange = (borderType: keyof BrandingTheme['borders'], value: string) => {
    setActiveTheme({
      ...activeTheme,
      borders: {
        ...activeTheme.borders,
        [borderType]: value
      }
    });
  };
  
  const handleStylingChange = (styleType: keyof BrandingTheme['styling'], value: string) => {
    setActiveTheme({
      ...activeTheme,
      styling: {
        ...activeTheme.styling,
        [styleType]: value
      }
    });
  };
  
  const applyTheme = (theme: BrandingTheme) => {
    setActiveTheme(theme);
    toast({
      title: "Theme applied",
      description: `${theme.name} has been applied to the flow`,
    });
  };
  
  const saveTheme = () => {
    // In a real app, we would save the theme to the database
    toast({
      title: "Theme saved",
      description: "Your theme settings have been saved",
    });
  };
  
  const resetTheme = () => {
    setActiveTheme(sampleThemes[0]);
    toast({
      title: "Theme reset",
      description: "Theme settings have been reset to default",
    });
  };
  
  const getStyleFromSize = (size: string) => {
    switch (size) {
      case "small":
        return "0.875rem"; // 14px
      case "medium":
        return "1rem";     // 16px
      case "large":
        return "1.125rem"; // 18px
      default:
        return "1rem";
    }
  };
  
  const getRadiusFromSize = (size: string) => {
    switch (size) {
      case "none":
        return "0";
      case "small":
        return "0.25rem"; // 4px
      case "medium":
        return "0.5rem";  // 8px
      case "large":
        return "1rem";    // 16px
      case "full":
        return "9999px";
      default:
        return "0.5rem";
    }
  };
  
  const getBorderWidthFromSize = (size: string) => {
    switch (size) {
      case "none":
        return "0";
      case "hairline":
        return "1px";
      case "thin":
        return "2px";
      case "thick":
        return "4px";
      default:
        return "1px";
    }
  };
  
  const getModalStyle = (style: string) => {
    switch (style) {
      case "flat":
        return {
          borderRadius: "0",
          boxShadow: "none",
          border: `${getBorderWidthFromSize(activeTheme.borders.width)} solid ${activeTheme.colors.border}`
        };
      case "rounded":
        return {
          borderRadius: getRadiusFromSize(activeTheme.borders.radius),
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: `${getBorderWidthFromSize(activeTheme.borders.width)} solid ${activeTheme.colors.border}`
        };
      case "floating":
        return {
          borderRadius: getRadiusFromSize(activeTheme.borders.radius),
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "none"
        };
      default:
        return {
          borderRadius: getRadiusFromSize(activeTheme.borders.radius),
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          border: `${getBorderWidthFromSize(activeTheme.borders.width)} solid ${activeTheme.colors.border}`
        };
    }
  };
  
  const getTooltipStyle = (style: string) => {
    switch (style) {
      case "minimal":
        return {
          borderRadius: getRadiusFromSize(activeTheme.borders.radius),
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "none",
          padding: "8px 12px"
        };
      case "bordered":
        return {
          borderRadius: getRadiusFromSize(activeTheme.borders.radius),
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          border: `${getBorderWidthFromSize(activeTheme.borders.width)} solid ${activeTheme.colors.border}`,
          padding: "8px 12px"
        };
      case "arrow":
        return {
          borderRadius: getRadiusFromSize(activeTheme.borders.radius),
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "none",
          padding: "8px 12px",
          position: "relative" as const
        };
      default:
        return {
          borderRadius: getRadiusFromSize(activeTheme.borders.radius),
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "none",
          padding: "8px 12px"
        };
    }
  };
  
  const getButtonStyle = (style: string) => {
    switch (style) {
      case "flat":
        return {
          borderRadius: "0",
          border: "none",
          padding: "8px 16px"
        };
      case "rounded":
        return {
          borderRadius: getRadiusFromSize(activeTheme.borders.radius),
          border: "none",
          padding: "8px 16px"
        };
      case "pill":
        return {
          borderRadius: "9999px",
          border: "none",
          padding: "8px 16px"
        };
      case "outline":
        return {
          borderRadius: getRadiusFromSize(activeTheme.borders.radius),
          border: `${getBorderWidthFromSize(activeTheme.borders.width)} solid ${activeTheme.colors.primary}`,
          padding: "8px 16px",
          background: "transparent"
        };
      default:
        return {
          borderRadius: getRadiusFromSize(activeTheme.borders.radius),
          border: "none",
          padding: "8px 16px"
        };
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/flow/${id}`)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Flow
          </Button>
          <h1 className="text-2xl font-bold">Branding: {flow?.title}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={resetTheme}>
            <Redo className="h-4 w-4 mr-2" /> Reset
          </Button>
          <Button 
            size="sm" 
            onClick={saveTheme}
            className="bg-quickstartify-purple hover:bg-quickstartify-purple/90"
          >
            <Save className="h-4 w-4 mr-2" /> Save Theme
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Saved Themes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {savedThemes.map(theme => (
                  <button
                    key={theme.id}
                    className={`flex items-center p-3 border rounded-md text-left ${
                      activeTheme.id === theme.id 
                        ? 'border-quickstartify-purple bg-purple-50 dark:bg-purple-900/10' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => applyTheme(theme)}
                  >
                    <div className="flex space-x-1 mr-3">
                      <div 
                        className="h-5 w-5 rounded-full" 
                        style={{ backgroundColor: theme.colors.primary }}
                      ></div>
                      <div 
                        className="h-5 w-5 rounded-full" 
                        style={{ backgroundColor: theme.colors.secondary }}
                      ></div>
                    </div>
                    <div>
                      <div className="font-medium">{theme.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {theme.typography.fontFamily.split(',')[0]}
                      </div>
                    </div>
                    {activeTheme.id === theme.id && (
                      <Check className="h-4 w-4 ml-auto text-quickstartify-purple" />
                    )}
                  </button>
                ))}
              </div>
              
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Create New Theme
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Theme Name & Logo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input 
                  id="theme-name" 
                  value={activeTheme.name}
                  onChange={(e) => setActiveTheme({ ...activeTheme, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="border-2 border-dashed rounded-md p-8 text-center">
                  <div className="flex flex-col items-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" /> Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended: 200x50px PNG or SVG
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle>Advanced Settings</CardTitle>
              <Switch
                checked={showAdvanced}
                onCheckedChange={setShowAdvanced}
              />
            </CardHeader>
            {showAdvanced && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail Image</Label>
                  <div className="border rounded-md p-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="h-4 w-4 mr-2" /> Upload Thumbnail
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="css-override">Custom CSS Overrides</Label>
                  <textarea 
                    id="css-override" 
                    className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                    placeholder=".tooltip { backdrop-filter: blur(10px); }"
                  ></textarea>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="js-hook">Custom JS Hook</Label>
                  <textarea 
                    id="js-hook" 
                    className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                    placeholder="function onStepChange(step) { console.log('Step changed:', step); }"
                  ></textarea>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="colors">
                  <div className="border-b">
                    <TabsList className="w-full rounded-none gap-2 px-4 pt-2">
                      <TabsTrigger value="colors" className="data-[state=active]:bg-background">
                        <Palette className="h-4 w-4 mr-2" /> Colors
                      </TabsTrigger>
                      <TabsTrigger value="typography" className="data-[state=active]:bg-background">
                        <Type className="h-4 w-4 mr-2" /> Typography
                      </TabsTrigger>
                      <TabsTrigger value="borders" className="data-[state=active]:bg-background">
                        <Square className="h-4 w-4 mr-2" /> Borders
                      </TabsTrigger>
                      <TabsTrigger value="components" className="data-[state=active]:bg-background">
                        <PanelLeft className="h-4 w-4 mr-2" /> Components
                      </TabsTrigger>
                      <div className="ml-auto flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/flow/${id}/preview`)}
                        >
                          <Eye className="h-4 w-4 mr-2" /> Preview
                        </Button>
                      </div>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="colors" className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Primary Colors</h3>
                        
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="color-primary" className="flex justify-between">
                              <span>Primary Color</span>
                              <span className="text-xs text-muted-foreground font-mono">
                                {activeTheme.colors.primary}
                              </span>
                            </Label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                id="color-primary"
                                value={activeTheme.colors.primary}
                                onChange={(e) => handleColorChange('primary', e.target.value)}
                                className="w-12 h-10 cursor-pointer border rounded"
                              />
                              <Input 
                                value={activeTheme.colors.primary}
                                onChange={(e) => handleColorChange('primary', e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="color-secondary" className="flex justify-between">
                              <span>Secondary Color</span>
                              <span className="text-xs text-muted-foreground font-mono">
                                {activeTheme.colors.secondary}
                              </span>
                            </Label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                id="color-secondary"
                                value={activeTheme.colors.secondary}
                                onChange={(e) => handleColorChange('secondary', e.target.value)}
                                className="w-12 h-10 cursor-pointer border rounded"
                              />
                              <Input 
                                value={activeTheme.colors.secondary}
                                onChange={(e) => handleColorChange('secondary', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mt-4">
                          <h4 className="text-sm font-medium text-muted-foreground">Color Presets</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {colorPresets.map((preset, index) => (
                              <button
                                key={index}
                                className="p-2 border rounded-md hover:bg-muted text-left text-xs"
                                onClick={() => {
                                  handleColorChange('primary', preset.primary);
                                  handleColorChange('secondary', preset.secondary);
                                }}
                              >
                                <div className="flex space-x-1 mb-1">
                                  <div 
                                    className="h-4 w-4 rounded-full" 
                                    style={{ backgroundColor: preset.primary }}
                                  ></div>
                                  <div 
                                    className="h-4 w-4 rounded-full" 
                                    style={{ backgroundColor: preset.secondary }}
                                  ></div>
                                </div>
                                <span>{preset.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">UI Colors</h3>
                        
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="color-background" className="flex justify-between">
                              <span>Background</span>
                              <span className="text-xs text-muted-foreground font-mono">
                                {activeTheme.colors.background}
                              </span>
                            </Label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                id="color-background"
                                value={activeTheme.colors.background}
                                onChange={(e) => handleColorChange('background', e.target.value)}
                                className="w-12 h-10 cursor-pointer border rounded"
                              />
                              <Input 
                                value={activeTheme.colors.background}
                                onChange={(e) => handleColorChange('background', e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="color-text" className="flex justify-between">
                              <span>Text</span>
                              <span className="text-xs text-muted-foreground font-mono">
                                {activeTheme.colors.text}
                              </span>
                            </Label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                id="color-text"
                                value={activeTheme.colors.text}
                                onChange={(e) => handleColorChange('text', e.target.value)}
                                className="w-12 h-10 cursor-pointer border rounded"
                              />
                              <Input 
                                value={activeTheme.colors.text}
                                onChange={(e) => handleColorChange('text', e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="color-border" className="flex justify-between">
                              <span>Border</span>
                              <span className="text-xs text-muted-foreground font-mono">
                                {activeTheme.colors.border}
                              </span>
                            </Label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                id="color-border"
                                value={activeTheme.colors.border}
                                onChange={(e) => handleColorChange('border', e.target.value)}
                                className="w-12 h-10 cursor-pointer border rounded"
                              />
                              <Input 
                                value={activeTheme.colors.border}
                                onChange={(e) => handleColorChange('border', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <Label htmlFor="theme-mode">Theme Mode</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant={previewMode === "light" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPreviewMode("light")}
                            >
                              <Sun className="h-4 w-4 mr-2" /> Light
                            </Button>
                            <Button
                              variant={previewMode === "dark" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPreviewMode("dark")}
                            >
                              <Moon className="h-4 w-4 mr-2" /> Dark
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="typography" className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Font Family</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="fontFamily">Primary Font</Label>
                          <Select 
                            value={activeTheme.typography.fontFamily} 
                            onValueChange={(value) => handleTypographyChange('fontFamily', value)}
                          >
                            <SelectTrigger id="fontFamily">
                              <SelectValue placeholder="Select a font" />
                            </SelectTrigger>
                            <SelectContent>
                              {fontPresets.map((preset, index) => (
                                <SelectItem key={index} value={preset.family}>
                                  <span style={{ fontFamily: preset.family }}>
                                    {preset.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="p-4 border rounded-md mt-4">
                          <div className="flex justify-between mb-3">
                            <span className="text-sm text-muted-foreground">Font Preview</span>
                          </div>
                          <div style={{ fontFamily: activeTheme.typography.fontFamily }}>
                            <h3 className="text-xl font-bold mb-2">Heading Text</h3>
                            <p className="mb-3">This is regular body text that shows how your font will look in paragraphs.</p>
                            <button 
                              style={{
                                ...getButtonStyle(activeTheme.styling.buttonStyle),
                                backgroundColor: activeTheme.colors.primary,
                                color: "#ffffff",
                                fontSize: getStyleFromSize(activeTheme.typography.buttonSize)
                              }}
                            >
                              Button Text
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Font Sizes</h3>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="headingSize">Heading Size</Label>
                              <span className="text-xs text-muted-foreground">
                                {activeTheme.typography.headingSize}
                              </span>
                            </div>
                            <Select 
                              value={activeTheme.typography.headingSize} 
                              onValueChange={(value) => handleTypographyChange('headingSize', value)}
                            >
                              <SelectTrigger id="headingSize">
                                <SelectValue placeholder="Select a size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="bodySize">Body Text Size</Label>
                              <span className="text-xs text-muted-foreground">
                                {activeTheme.typography.bodySize}
                              </span>
                            </div>
                            <Select 
                              value={activeTheme.typography.bodySize} 
                              onValueChange={(value) => handleTypographyChange('bodySize', value)}
                            >
                              <SelectTrigger id="bodySize">
                                <SelectValue placeholder="Select a size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="buttonSize">Button Text Size</Label>
                              <span className="text-xs text-muted-foreground">
                                {activeTheme.typography.buttonSize}
                              </span>
                            </div>
                            <Select 
                              value={activeTheme.typography.buttonSize} 
                              onValueChange={(value) => handleTypographyChange('buttonSize', value)}
                            >
                              <SelectTrigger id="buttonSize">
                                <SelectValue placeholder="Select a size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Button variant="outline" className="w-full">
                            <Upload className="h-4 w-4 mr-2" /> Upload Custom Font
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="borders" className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Border Radius</h3>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="borderRadius">Corner Roundness</Label>
                            <span className="text-xs text-muted-foreground">
                              {activeTheme.borders.radius}
                            </span>
                          </div>
                          <Select 
                            value={activeTheme.borders.radius} 
                            onValueChange={(value) => handleBordersChange('radius', value)}
                          >
                            <SelectTrigger id="borderRadius">
                              <SelectValue placeholder="Select radius" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="small">Small (4px)</SelectItem>
                              <SelectItem value="medium">Medium (8px)</SelectItem>
                              <SelectItem value="large">Large (16px)</SelectItem>
                              <SelectItem value="full">Full (Circular)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div className="flex flex-col items-center">
                            <div 
                              className="w-16 h-16 bg-muted border"
                              style={{ borderRadius: getRadiusFromSize("none") }}
                            ></div>
                            <span className="text-xs mt-2">None</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div 
                              className="w-16 h-16 bg-muted border"
                              style={{ borderRadius: getRadiusFromSize("small") }}
                            ></div>
                            <span className="text-xs mt-2">Small</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div 
                              className="w-16 h-16 bg-muted border"
                              style={{ borderRadius: getRadiusFromSize("medium") }}
                            ></div>
                            <span className="text-xs mt-2">Medium</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <div className="flex flex-col items-center">
                            <div 
                              className="w-16 h-16 bg-muted border"
                              style={{ borderRadius: getRadiusFromSize("large") }}
                            ></div>
                            <span className="text-xs mt-2">Large</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div 
                              className="w-16 h-16 bg-muted border"
                              style={{ borderRadius: getRadiusFromSize("full") }}
                            ></div>
                            <span className="text-xs mt-2">Full</span>
                          </div>
                          <div></div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Border Width</h3>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="borderWidth">Border Thickness</Label>
                            <span className="text-xs text-muted-foreground">
                              {activeTheme.borders.width}
                            </span>
                          </div>
                          <Select 
                            value={activeTheme.borders.width} 
                            onValueChange={(value) => handleBordersChange('width', value)}
                          >
                            <SelectTrigger id="borderWidth">
                              <SelectValue placeholder="Select width" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="hairline">Hairline (1px)</SelectItem>
                              <SelectItem value="thin">Thin (2px)</SelectItem>
                              <SelectItem value="thick">Thick (4px)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="flex flex-col items-center">
                            <div 
                              className="w-16 h-16 bg-white"
                              style={{ 
                                borderWidth: getBorderWidthFromSize("hairline"),
                                borderStyle: "solid",
                                borderColor: activeTheme.colors.border
                              }}
                            ></div>
                            <span className="text-xs mt-2">Hairline</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div 
                              className="w-16 h-16 bg-white"
                              style={{ 
                                borderWidth: getBorderWidthFromSize("thin"),
                                borderStyle: "solid",
                                borderColor: activeTheme.colors.border
                              }}
                            ></div>
                            <span className="text-xs mt-2">Thin</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="flex flex-col items-center">
                            <div 
                              className="w-16 h-16 bg-white"
                              style={{ 
                                borderWidth: getBorderWidthFromSize("thick"),
                                borderStyle: "solid",
                                borderColor: activeTheme.colors.border
                              }}
                            ></div>
                            <span className="text-xs mt-2">Thick</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div 
                              className="w-16 h-16 bg-white"
                              style={{ 
                                borderWidth: 0
                              }}
                            ></div>
                            <span className="text-xs mt-2">None</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="components" className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Modal Style</h3>
                        
                        <div className="space-y-2">
                          <Select 
                            value={activeTheme.styling.modalStyle} 
                            onValueChange={(value) => handleStylingChange('modalStyle', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flat">Flat</SelectItem>
                              <SelectItem value="rounded">Rounded</SelectItem>
                              <SelectItem value="floating">Floating</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="mt-4">
                          <div 
                            className="p-4"
                            style={{
                              ...getModalStyle(activeTheme.styling.modalStyle),
                              backgroundColor: previewMode === "light" ? activeTheme.colors.background : "#1a1f2c",
                              color: previewMode === "light" ? activeTheme.colors.text : "#ffffff",
                              fontFamily: activeTheme.typography.fontFamily,
                            }}
                          >
                            <h4 className="font-medium" style={{
                              fontSize: getStyleFromSize(activeTheme.typography.headingSize),
                            }}>Modal Title</h4>
                            <p className="text-sm my-2" style={{
                              fontSize: getStyleFromSize(activeTheme.typography.bodySize),
                            }}>This is how your modal will appear to users.</p>
                            <div className="flex justify-end mt-4">
                              <button 
                                className="px-3 py-1.5 mr-2 bg-gray-100"
                                style={{
                                  ...getButtonStyle(activeTheme.styling.buttonStyle),
                                  backgroundColor: "transparent",
                                  color: activeTheme.colors.text,
                                  border: `1px solid ${activeTheme.colors.border}`,
                                  fontSize: getStyleFromSize(activeTheme.typography.buttonSize)
                                }}
                              >
                                Cancel
                              </button>
                              <button 
                                className="px-3 py-1.5"
                                style={{
                                  ...getButtonStyle(activeTheme.styling.buttonStyle),
                                  backgroundColor: activeTheme.colors.primary,
                                  color: "#ffffff",
                                  fontSize: getStyleFromSize(activeTheme.typography.buttonSize)
                                }}
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Tooltip Style</h3>
                        
                        <div className="space-y-2">
                          <Select 
                            value={activeTheme.styling.tooltipStyle} 
                            onValueChange={(value) => handleStylingChange('tooltipStyle', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minimal">Minimal</SelectItem>
                              <SelectItem value="bordered">Bordered</SelectItem>
                              <SelectItem value="arrow">With Arrow</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="mt-4">
                          <div className="relative h-32 border rounded bg-muted/30 flex items-center justify-center">
                            <div
                              style={{
                                ...getTooltipStyle(activeTheme.styling.tooltipStyle),
                                backgroundColor: previewMode === "light" ? activeTheme.colors.background : "#1a1f2c",
                                color: previewMode === "light" ? activeTheme.colors.text : "#ffffff",
                                fontFamily: activeTheme.typography.fontFamily,
                                position: "relative",
                              }}
                            >
                              <div className="text-sm font-medium">Tooltip Title</div>
                              <div className="text-xs">Click this element to continue</div>
                              
                              {activeTheme.styling.tooltipStyle === "arrow" && (
                                <div
                                  style={{
                                    position: "absolute",
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: previewMode === "light" ? activeTheme.colors.background : "#1a1f2c",
                                    transform: "rotate(45deg)",
                                    bottom: "-5px",
                                    left: "calc(50% - 5px)",
                                  }}
                                ></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Button Style</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Select 
                            value={activeTheme.styling.buttonStyle} 
                            onValueChange={(value) => handleStylingChange('buttonStyle', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flat">Flat</SelectItem>
                              <SelectItem value="rounded">Rounded</SelectItem>
                              <SelectItem value="pill">Pill</SelectItem>
                              <SelectItem value="outline">Outline</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex space-x-4">
                          <button 
                            className="px-3 py-1.5"
                            style={{
                              ...getButtonStyle(activeTheme.styling.buttonStyle),
                              backgroundColor: activeTheme.colors.primary,
                              color: "#ffffff",
                              fontSize: getStyleFromSize(activeTheme.typography.buttonSize),
                              fontFamily: activeTheme.typography.fontFamily,
                            }}
                          >
                            Primary Button
                          </button>
                          
                          <button 
                            className="px-3 py-1.5"
                            style={{
                              ...getButtonStyle(activeTheme.styling.buttonStyle),
                              backgroundColor: activeTheme.colors.secondary,
                              color: "#ffffff",
                              fontSize: getStyleFromSize(activeTheme.typography.buttonSize),
                              fontFamily: activeTheme.typography.fontFamily,
                            }}
                          >
                            Secondary Button
                          </button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center">
                <CardTitle>Preview</CardTitle>
                <div className="ml-auto flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setPreviewMode(previewMode === "light" ? "dark" : "light")}>
                    {previewMode === "light" ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
                    Toggle {previewMode === "light" ? "Dark" : "Light"} Mode
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded-lg p-6"
                  style={{
                    backgroundColor: previewMode === "light" ? activeTheme.colors.background : "#1a1f2c",
                    color: previewMode === "light" ? activeTheme.colors.text : "#ffffff",
                  }}
                >
                  <div style={{ fontFamily: activeTheme.typography.fontFamily }}>
                    <h2 
                      className="font-bold mb-4" 
                      style={{ 
                        fontSize: "1.5rem", 
                        color: previewMode === "light" ? activeTheme.colors.text : "#ffffff" 
                      }}
                    >
                      Onboarding Preview
                    </h2>
                    
                    <div className="flex space-x-4">
                      <div className="flex-1 space-y-4">
                        {/* Modal example */}
                        <div 
                          style={{
                            ...getModalStyle(activeTheme.styling.modalStyle),
                            backgroundColor: previewMode === "light" ? activeTheme.colors.background : "#1a1f2c",
                            borderColor: previewMode === "light" ? activeTheme.colors.border : "#374151",
                          }}
                        >
                          <h4 
                            className="font-medium mb-2" 
                            style={{ fontSize: getStyleFromSize(activeTheme.typography.headingSize) }}
                          >
                            Welcome to Your App
                          </h4>
                          <p style={{ fontSize: getStyleFromSize(activeTheme.typography.bodySize) }}>
                            This is how your welcome modal will appear to users with your current branding settings.
                          </p>
                          <div className="flex justify-end mt-4 space-x-3">
                            <button 
                              style={{
                                ...getButtonStyle(activeTheme.styling.buttonStyle),
                                backgroundColor: "transparent",
                                color: previewMode === "light" ? activeTheme.colors.text : "#ffffff",
                                border: `1px solid ${previewMode === "light" ? activeTheme.colors.border : "#374151"}`,
                                fontSize: getStyleFromSize(activeTheme.typography.buttonSize)
                              }}
                            >
                              Skip
                            </button>
                            <button 
                              style={{
                                ...getButtonStyle(activeTheme.styling.buttonStyle),
                                backgroundColor: activeTheme.colors.primary,
                                color: "#ffffff",
                                fontSize: getStyleFromSize(activeTheme.typography.buttonSize)
                              }}
                            >
                              Get Started
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        {/* Tooltip example */}
                        <div
                          style={{
                            ...getTooltipStyle(activeTheme.styling.tooltipStyle),
                            backgroundColor: previewMode === "light" ? activeTheme.colors.background : "#1a1f2c",
                            borderColor: previewMode === "light" ? activeTheme.colors.border : "#374151",
                            position: "relative",
                          }}
                        >
                          <div 
                            className="font-medium mb-1"
                            style={{ fontSize: getStyleFromSize(activeTheme.typography.headingSize) }}
                          >
                            Important Feature
                          </div>
                          <div style={{ fontSize: getStyleFromSize(activeTheme.typography.bodySize) }}>
                            Click this element to explore this feature in depth
                          </div>
                          <div className="flex justify-between mt-2">
                            <button
                              style={{
                                ...getButtonStyle(activeTheme.styling.buttonStyle),
                                backgroundColor: "transparent",
                                color: previewMode === "light" ? activeTheme.colors.text : "#ffffff",
                                fontSize: getStyleFromSize(activeTheme.typography.buttonSize),
                                padding: "4px 8px"
                              }}
                            >
                              Skip
                            </button>
                            <button
                              style={{
                                ...getButtonStyle(activeTheme.styling.buttonStyle),
                                backgroundColor: activeTheme.colors.primary,
                                color: "#ffffff",
                                fontSize: getStyleFromSize(activeTheme.typography.buttonSize),
                                padding: "4px 8px"
                              }}
                            >
                              Next
                            </button>
                          </div>
                          
                          {activeTheme.styling.tooltipStyle === "arrow" && (
                            <div
                              style={{
                                position: "absolute",
                                width: "10px",
                                height: "10px",
                                backgroundColor: previewMode === "light" ? activeTheme.colors.background : "#1a1f2c",
                                transform: "rotate(45deg)",
                                bottom: "-5px",
                                left: "calc(50% - 5px)",
                                borderRight: previewMode === "light" ? `1px solid ${activeTheme.colors.border}` : "1px solid #374151",
                                borderBottom: previewMode === "light" ? `1px solid ${activeTheme.colors.border}` : "1px solid #374151",
                              }}
                            ></div>
                          )}
                        </div>
                        
                        {/* Hotspot example */}
                        <div className="mt-6 flex items-center">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: `${activeTheme.colors.primary}20`,
                            }}
                          >
                            <div 
                              className="w-6 h-6 rounded-full animate-pulse"
                              style={{
                                backgroundColor: activeTheme.colors.primary,
                              }}
                            ></div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">Hotspot Indicator</div>
                            <div className="text-xs text-muted-foreground">
                              With your selected primary color
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowBranding;
