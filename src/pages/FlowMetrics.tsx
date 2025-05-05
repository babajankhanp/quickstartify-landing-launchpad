
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  Clock, 
  ChevronsRight,
  Download,
  Filter,
  Calendar,
  RefreshCw
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Flow, FlowStep, FlowAnalytic } from "@/integrations/supabase/models";

const FlowMetrics = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [flow, setFlow] = useState<Flow | null>(null);
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [analytics, setAnalytics] = useState<FlowAnalytic[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("last30days");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Sample data for visualization
  const funnelData = [
    { name: "Viewed", value: 2547 },
    { name: "Interacted", value: 1823 },
    { name: "Completed", value: 983 }
  ];
  
  const stepMetrics = [
    { name: "Welcome", views: 2547, interactions: 2134, skips: 413, completions: 1983, avgTime: 24 },
    { name: "Feature 1", views: 1983, interactions: 1645, skips: 338, completions: 1452, avgTime: 56 },
    { name: "Feature 2", views: 1452, interactions: 1103, skips: 349, completions: 983, avgTime: 42 }
  ];
  
  const dropOffData = [
    { name: "Start", users: 2547 },
    { name: "Welcome", users: 2547 },
    { name: "Feature 1", users: 1983 },
    { name: "Feature 2", users: 1452 },
    { name: "Complete", users: 983 }
  ];
  
  const weeklyData = [
    { name: "Week 1", users: 453, completion: 312 },
    { name: "Week 2", users: 612, completion: 498 },
    { name: "Week 3", users: 756, completion: 583 },
    { name: "Week 4", users: 726, completion: 604 }
  ];
  
  // Fetch flow data and analytics
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
        
        // In a real implementation, we would fetch actual analytics data
        
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
  
  const handleExportData = () => {
    // In a real app, this would generate a CSV or JSON file
    toast({
      title: "Data exported",
      description: "Analytics data has been downloaded as CSV",
    });
  };
  
  const handleRefreshData = () => {
    toast({
      title: "Data refreshed",
      description: "Analytics data has been updated",
    });
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
          <h1 className="text-2xl font-bold">Analytics: {flow?.title}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleRefreshData}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh Data
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" /> Export Data
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="funnel">Funnel</TabsTrigger>
            <TabsTrigger value="steps">Step Analysis</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="new">New Users</SelectItem>
              <SelectItem value="returning">Returning Users</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="overview" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,547</div>
                <div className="flex items-center pt-1 text-sm text-green-600">
                  <span className="font-medium">↑ 12.5%</span>
                  <span className="ml-1 text-muted-foreground">vs. last period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38.6%</div>
                <div className="flex items-center pt-1 text-sm text-green-600">
                  <span className="font-medium">↑ 3.2%</span>
                  <span className="ml-1 text-muted-foreground">vs. last period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Time to Complete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">02:43</div>
                <div className="flex items-center pt-1 text-sm text-red-600">
                  <span className="font-medium">↓ 0:32</span>
                  <span className="ml-1 text-muted-foreground">vs. last period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Skip Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">16.2%</div>
                <div className="flex items-center pt-1 text-sm text-red-600">
                  <span className="font-medium">↑ 2.1%</span>
                  <span className="ml-1 text-muted-foreground">vs. last period</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Flow Engagement Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" name="Total Users" fill="#9b87f5" />
                      <Bar dataKey="completion" name="Completions" fill="#7e69ab" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Flow Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelData.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span>{item.name}</span>
                        <span className="font-semibold">{item.value.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-quickstartify-purple h-2.5 rounded-full" 
                          style={{ width: `${(item.value / funnelData[0].value) * 100}%` }}
                        ></div>
                      </div>
                      {index < funnelData.length - 1 && (
                        <div className="flex justify-center py-1">
                          <ChevronsRight className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-3">Step Name</th>
                      <th className="text-center pb-3">Views</th>
                      <th className="text-center pb-3">Interactions</th>
                      <th className="text-center pb-3">Skips</th>
                      <th className="text-center pb-3">Completions</th>
                      <th className="text-center pb-3">Avg Time (sec)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stepMetrics.map((step, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3">{step.name}</td>
                        <td className="text-center py-3">{step.views.toLocaleString()}</td>
                        <td className="text-center py-3">{step.interactions.toLocaleString()}</td>
                        <td className="text-center py-3">{step.skips.toLocaleString()}</td>
                        <td className="text-center py-3">{step.completions.toLocaleString()}</td>
                        <td className="text-center py-3">{step.avgTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Funnel Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Conversion Rate: 38.6%</h3>
                  <p className="text-sm text-muted-foreground">
                    From flow start to completion
                  </p>
                </div>
                
                <div className="space-y-6">
                  {dropOffData.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{item.name}</span>
                        <div className="flex items-center">
                          <span className="font-semibold">{item.users.toLocaleString()} users</span>
                          {index > 0 && (
                            <span className="ml-2 text-sm text-red-500">
                              {index > 0 && dropOffData[index].users < dropOffData[index-1].users ? 
                                `(-${((1 - dropOffData[index].users / dropOffData[index-1].users) * 100).toFixed(1)}%)` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div 
                          className="bg-quickstartify-purple h-4 rounded-full" 
                          style={{ width: `${(item.users / dropOffData[0].users) * 100}%` }}
                        ></div>
                      </div>
                      
                      {index < dropOffData.length - 1 && (
                        <div className="flex justify-center py-2">
                          <ChevronsRight className="h-5 w-5 text-gray-400 rotate-90" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="steps" className="mt-0">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Step Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-3">Step Name</th>
                        <th className="text-center pb-3">Views</th>
                        <th className="text-center pb-3">Interactions</th>
                        <th className="text-center pb-3">Skips</th>
                        <th className="text-center pb-3">Completions</th>
                        <th className="text-center pb-3">Avg Time (sec)</th>
                        <th className="text-center pb-3">Drop-off Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stepMetrics.map((step, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3">{step.name}</td>
                          <td className="text-center py-3">{step.views.toLocaleString()}</td>
                          <td className="text-center py-3">{step.interactions.toLocaleString()}</td>
                          <td className="text-center py-3">{step.skips.toLocaleString()}</td>
                          <td className="text-center py-3">{step.completions.toLocaleString()}</td>
                          <td className="text-center py-3">{step.avgTime}</td>
                          <td className="text-center py-3">
                            {index < stepMetrics.length - 1 ? 
                              `${((1 - stepMetrics[index+1].views / step.views) * 100).toFixed(1)}%` : 
                              '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="mt-0">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Device Breakdown</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Desktop</span>
                          <span>68%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Mobile</span>
                          <span>27%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '27%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tablet</span>
                          <span>5%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">User Type</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>New Users</span>
                          <span>42%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Returning Users</span>
                          <span>58%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">User Role</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Admin</span>
                          <span>12%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Standard</span>
                          <span>73%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Guest</span>
                          <span>15%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlowMetrics;
