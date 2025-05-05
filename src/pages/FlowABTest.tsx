
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Plus,
  BarChart3,
  Copy,
  Check,
  BarChart2,
  Lightbulb,
  Trash2,
  Settings2,
  ArrowRight,
  CheckCircle,
  PieChart
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Flow, FlowVariation } from "@/integrations/supabase/models";

type ABTest = {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  variants: ABVariant[];
  goal: {
    type: string;
    metric: string;
  };
  start_date: string;
  end_date: string | null;
  traffic_allocation: number;
};

type ABVariant = {
  id: string;
  name: string;
  traffic_percentage: number;
  conversions: number;
  views: number;
};

const FlowABTest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [flow, setFlow] = useState<Flow | null>(null);
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [isNewTestDialogOpen, setIsNewTestDialogOpen] = useState(false);
  
  const [newTestName, setNewTestName] = useState("");
  const [newTestGoal, setNewTestGoal] = useState("completion");
  const [newTestTraffic, setNewTestTraffic] = useState(50);
  const [variants, setVariants] = useState<{ name: string; percentage: number }[]>([
    { name: "Original", percentage: 50 },
    { name: "Variant B", percentage: 50 }
  ]);
  
  // Sample tests data
  const sampleTests: ABTest[] = [
    {
      id: "test-1",
      name: "Welcome Modal Test",
      status: "active",
      variants: [
        { id: "var-1", name: "Original", traffic_percentage: 50, conversions: 483, views: 1254 },
        { id: "var-2", name: "New Design", traffic_percentage: 50, conversions: 592, views: 1293 }
      ],
      goal: {
        type: "click",
        metric: "CTA Button Click"
      },
      start_date: "2023-07-15T00:00:00Z",
      end_date: null,
      traffic_allocation: 100
    },
    {
      id: "test-2",
      name: "Onboarding Flow Length",
      status: "completed",
      variants: [
        { id: "var-3", name: "Standard (5 steps)", traffic_percentage: 50, conversions: 387, views: 1024 },
        { id: "var-4", name: "Shortened (3 steps)", traffic_percentage: 50, conversions: 423, views: 1052 }
      ],
      goal: {
        type: "completion",
        metric: "Flow Completion"
      },
      start_date: "2023-06-01T00:00:00Z",
      end_date: "2023-06-30T00:00:00Z",
      traffic_allocation: 100
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
        
        // In a real app, we would fetch A/B tests from the database
        // For now, using sample data
        setTests(sampleTests);
        if (sampleTests.length > 0) {
          setSelectedTest(sampleTests[0]);
        }
        
      } catch (error: any) {
        toast({
          title: "Error loading flow data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchFlowData();
  }, [id]);
  
  const handleAddVariant = () => {
    if (variants.length >= 4) {
      toast({
        title: "Maximum variants reached",
        description: "You can have up to 4 variants in a test",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate equal distribution
    const newCount = variants.length + 1;
    const equalPercentage = Math.floor(100 / newCount);
    
    // Adjust existing variants
    const updatedVariants = variants.map(v => ({
      ...v,
      percentage: equalPercentage
    }));
    
    // Add new variant
    updatedVariants.push({
      name: `Variant ${String.fromCharCode(65 + newCount)}`,
      percentage: equalPercentage
    });
    
    // Adjust for rounding errors
    const totalPct = updatedVariants.reduce((sum, v) => sum + v.percentage, 0);
    if (totalPct < 100) {
      updatedVariants[0].percentage += (100 - totalPct);
    }
    
    setVariants(updatedVariants);
  };
  
  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 2) {
      toast({
        title: "Minimum variants required",
        description: "You need at least 2 variants for an A/B test",
        variant: "destructive"
      });
      return;
    }
    
    // Remove the variant
    const newVariants = variants.filter((_, i) => i !== index);
    
    // Recalculate percentages
    const equalPercentage = Math.floor(100 / newVariants.length);
    const updatedVariants = newVariants.map(v => ({
      ...v,
      percentage: equalPercentage
    }));
    
    // Adjust for rounding errors
    const totalPct = updatedVariants.reduce((sum, v) => sum + v.percentage, 0);
    if (totalPct < 100) {
      updatedVariants[0].percentage += (100 - totalPct);
    }
    
    setVariants(updatedVariants);
  };
  
  const handleVariantPercentageChange = (index: number, value: number[]) => {
    const percentage = value[0];
    
    if (variants.length !== 2) {
      // For complex distribution, we'd need a more sophisticated UI
      // This simple implementation only works for 2 variants
      return;
    }
    
    // For two variants case, adjust both
    const updatedVariants = [...variants];
    updatedVariants[0].percentage = index === 0 ? percentage : 100 - percentage;
    updatedVariants[1].percentage = index === 1 ? percentage : 100 - percentage;
    
    setVariants(updatedVariants);
  };
  
  const handleCreateTest = () => {
    if (!newTestName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your test",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Test created",
      description: "Your A/B test has been created successfully",
    });
    
    setIsNewTestDialogOpen(false);
    
    // In a real app, we would create the test in the database
    // and then fetch the updated list of tests
  };
  
  const handleEndTest = (testId: string) => {
    toast({
      title: "Test ended",
      description: "The A/B test has been completed",
    });
    
    // In a real app, we would update the test status in the database
    // and then fetch the updated list of tests
  };
  
  const handlePauseTest = (testId: string) => {
    toast({
      title: "Test paused",
      description: "The A/B test has been paused",
    });
    
    // In a real app, we would update the test status in the database
    // and then fetch the updated list of tests
  };
  
  const handlePromoteWinner = (testId: string, variantId: string) => {
    toast({
      title: "Winner promoted",
      description: "The winning variant has been promoted to the main flow",
    });
    
    // In a real app, we would promote the winning variant in the database
    // and then fetch the updated list of tests
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  
  const calculateConversionRate = (conversions: number, views: number) => {
    if (!views) return 0;
    return (conversions / views) * 100;
  };
  
  const getWinningVariant = (test: ABTest) => {
    if (!test.variants.length) return null;
    
    return test.variants.reduce((winner, variant) => {
      const winnerRate = calculateConversionRate(winner.conversions, winner.views);
      const variantRate = calculateConversionRate(variant.conversions, variant.views);
      return variantRate > winnerRate ? variant : winner;
    }, test.variants[0]);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "paused":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
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
          <h1 className="text-2xl font-bold">A/B Testing: {flow?.title}</h1>
        </div>
        
        <Button 
          onClick={() => setIsNewTestDialogOpen(true)} 
          className="bg-quickstartify-purple hover:bg-quickstartify-purple/90"
        >
          <Plus className="h-4 w-4 mr-2" /> Create New Test
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">A/B Tests</h2>
                <p className="text-sm text-muted-foreground">Select a test to view results</p>
              </div>
              
              <div className="divide-y">
                {tests.length > 0 ? tests.map(test => (
                  <div 
                    key={test.id}
                    className={`p-4 cursor-pointer ${selectedTest?.id === test.id ? 'bg-muted' : ''}`}
                    onClick={() => setSelectedTest(test)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium">{test.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(test.status)}`}>
                        {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                      {formatDate(test.start_date)} – {test.end_date ? formatDate(test.end_date) : 'Present'}
                    </div>
                    
                    <div className="text-xs font-medium mb-1">Goal: {test.goal.metric}</div>
                    <div className="text-xs mb-2">
                      {test.variants.length} variants · {test.traffic_allocation}% traffic
                    </div>
                    
                    {/* Visual indicator for test variants */}
                    <div className="flex w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      {test.variants.map((variant, idx) => (
                        <div 
                          key={variant.id}
                          className="h-full" 
                          style={{ 
                            width: `${variant.traffic_percentage}%`,
                            backgroundColor: idx === 0 ? '#9b87f5' : 
                                            idx === 1 ? '#7e69ab' : 
                                            idx === 2 ? '#c2b5f8' : '#6e59a5'
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                )) : (
                  <div className="p-6 text-center text-muted-foreground">
                    <PieChart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="mb-1">No A/B tests created yet</p>
                    <p className="text-xs">Create your first test to start optimizing your flow</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedTest ? (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedTest.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {selectedTest.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePauseTest(selectedTest.id)}
                        >
                          Pause Test
                        </Button>
                      )}
                      
                      {selectedTest.status !== 'completed' && (
                        <Button
                          variant={selectedTest.status === 'paused' ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleEndTest(selectedTest.id)}
                        >
                          End Test
                        </Button>
                      )}
                      
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="p-2">
                        <div className="text-xs text-muted-foreground">Status</div>
                        <div className="font-semibold mt-1 flex justify-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(selectedTest.status)}`}>
                            {selectedTest.status.charAt(0).toUpperCase() + selectedTest.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="text-xs text-muted-foreground">Goal</div>
                        <div className="font-semibold mt-1">{selectedTest.goal.metric}</div>
                      </div>
                      <div className="p-2">
                        <div className="text-xs text-muted-foreground">Started</div>
                        <div className="font-semibold mt-1">{formatDate(selectedTest.start_date)}</div>
                      </div>
                      <div className="p-2">
                        <div className="text-xs text-muted-foreground">Duration</div>
                        <div className="font-semibold mt-1">
                          {selectedTest.end_date ? 
                            Math.ceil((new Date(selectedTest.end_date).getTime() - new Date(selectedTest.start_date).getTime()) / (1000 * 60 * 60 * 24)) + ' days' : 
                            'Ongoing'}
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-semibold mb-4">Variant Performance</h3>
                      
                      <div className="space-y-6">
                        {selectedTest.variants.map((variant, index) => {
                          const conversionRate = calculateConversionRate(variant.conversions, variant.views);
                          const isWinner = selectedTest.status === 'completed' && 
                            getWinningVariant(selectedTest)?.id === variant.id;
                            
                          return (
                            <div key={variant.id} className={`p-4 border rounded-lg ${isWinner ? 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/10' : ''}`}>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                  <div 
                                    className="h-4 w-4 rounded-full mr-2" 
                                    style={{ 
                                      backgroundColor: index === 0 ? '#9b87f5' : 
                                                      index === 1 ? '#7e69ab' : 
                                                      index === 2 ? '#c2b5f8' : '#6e59a5'
                                    }}
                                  ></div>
                                  <h4 className="font-medium">
                                    {variant.name}
                                    {isWinner && (
                                      <span className="inline-flex items-center ml-2 text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                        <Check className="h-3 w-3 mr-0.5" /> Winner
                                      </span>
                                    )}
                                  </h4>
                                </div>
                                <div className="text-sm">
                                  {variant.traffic_percentage}% Traffic
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                                <div>
                                  <div className="text-xs text-muted-foreground">Visitors</div>
                                  <div className="text-lg font-semibold">{variant.views.toLocaleString()}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Conversions</div>
                                  <div className="text-lg font-semibold">{variant.conversions.toLocaleString()}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Conversion Rate</div>
                                  <div className="text-lg font-semibold">{conversionRate.toFixed(1)}%</div>
                                </div>
                              </div>
                              
                              <div className="mb-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Conversion</span>
                                  <span>{conversionRate.toFixed(1)}%</span>
                                </div>
                                <Progress value={conversionRate} className="h-2" />
                              </div>
                              
                              {isWinner && selectedTest.status === 'completed' && (
                                <div className="mt-4">
                                  <Button 
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    onClick={() => handlePromoteWinner(selectedTest.id, variant.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" /> Promote as Winner
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {selectedTest.status === 'completed' && (
                      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start">
                          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Test Insights</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-400">
                              {getWinningVariant(selectedTest)?.name} performed {Math.abs(
                                calculateConversionRate(getWinningVariant(selectedTest)?.conversions || 0, getWinningVariant(selectedTest)?.views || 0) -
                                calculateConversionRate(
                                  selectedTest.variants.find(v => v.id !== getWinningVariant(selectedTest)?.id)?.conversions || 0, 
                                  selectedTest.variants.find(v => v.id !== getWinningVariant(selectedTest)?.id)?.views || 0
                                )
                              ).toFixed(1)}% better than the alternative. Consider promoting this variant as the new default.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Integration with Third-Party Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                        <div className="font-medium mb-2">Connect to Google Analytics</div>
                        <div className="text-xs text-muted-foreground">Send test data to GA4</div>
                      </Button>
                      
                      <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                        <div className="font-medium mb-2">Connect to Mixpanel</div>
                        <div className="text-xs text-muted-foreground">Send test data to Mixpanel</div>
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                        <div className="font-medium mb-2">Connect to Segment</div>
                        <div className="text-xs text-muted-foreground">Send test data to Segment</div>
                      </Button>
                      
                      <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                        <div className="font-medium mb-2">Connect to PostHog</div>
                        <div className="text-xs text-muted-foreground">Send test data to PostHog</div>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No test selected</h3>
              <p className="text-muted-foreground mb-6">Select an existing test or create a new one to get started</p>
              <Button 
                onClick={() => setIsNewTestDialogOpen(true)}
                className="bg-quickstartify-purple hover:bg-quickstartify-purple/90"
              >
                <Plus className="h-4 w-4 mr-2" /> Create New Test
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Create New Test Dialog */}
      <Dialog open={isNewTestDialogOpen} onOpenChange={setIsNewTestDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New A/B Test</DialogTitle>
            <DialogDescription>
              Set up a new test to optimize your flow performance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="test-name">Test Name</Label>
              <Input 
                id="test-name" 
                value={newTestName}
                onChange={(e) => setNewTestName(e.target.value)}
                placeholder="e.g., Welcome Modal Optimization"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-goal">Conversion Goal</Label>
              <Select value={newTestGoal} onValueChange={setNewTestGoal}>
                <SelectTrigger id="test-goal">
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completion">Flow Completion</SelectItem>
                  <SelectItem value="click">CTA Button Click</SelectItem>
                  <SelectItem value="signup">User Sign Up</SelectItem>
                  <SelectItem value="custom">Custom Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Traffic Allocation</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm">Percentage of users in test:</span>
                <span className="font-medium">{newTestTraffic}%</span>
              </div>
              <Slider
                defaultValue={[50]} 
                max={100} 
                step={10}
                onValueChange={(value) => setNewTestTraffic(value[0])}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {newTestTraffic}% of users will see test variants, the rest will see the control version
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Test Variants</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddVariant}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Variant
                </Button>
              </div>
              
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-2" 
                          style={{ 
                            backgroundColor: index === 0 ? '#9b87f5' : 
                                            index === 1 ? '#7e69ab' : 
                                            index === 2 ? '#c2b5f8' : '#6e59a5'
                          }}
                        ></div>
                        <Input 
                          value={variant.name}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[index].name = e.target.value;
                            setVariants(updated);
                          }}
                          className="h-7 text-sm"
                        />
                      </div>
                      
                      {index > 0 && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600"
                          onClick={() => handleRemoveVariant(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Traffic allocation:</span>
                        <span className="text-xs font-medium">{variant.percentage}%</span>
                      </div>
                      {variants.length === 2 && (
                        <Slider
                          value={[variant.percentage]}
                          max={100}
                          step={5}
                          className="h-2"
                          onValueChange={(value) => handleVariantPercentageChange(index, value)}
                        />
                      )}
                      {variants.length > 2 && (
                        <div className="flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Equal distribution</span>
                        </div>
                      )}
                    </div>
                    
                    {index === 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded mt-2">
                        <p className="text-xs text-blue-800 dark:text-blue-300 italic">
                          Original version (control)
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTestDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateTest}
              className="bg-quickstartify-purple hover:bg-quickstartify-purple/90"
            >
              Create Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlowABTest;
