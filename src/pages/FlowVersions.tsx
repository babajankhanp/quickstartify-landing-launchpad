
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Copy,
  CheckCircle,
  History,
  Undo,
  Eye,
  Clock10,
  MessageCircle
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Flow } from "@/integrations/supabase/models";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define flow version type
type FlowVersion = {
  id: string;
  version: number;
  status: "published" | "draft" | "archived";
  created_at: string;
  updated_by: string;
  changes: {
    type: "added" | "modified" | "removed";
    component: string;
    details: string;
  }[];
  notes: string;
};

const FlowVersions = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [flow, setFlow] = useState<Flow | null>(null);
  const [versions, setVersions] = useState<FlowVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<FlowVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [compareVersion, setCompareVersion] = useState<string | null>(null);
  
  // Sample versions data for the UI
  const sampleVersions: FlowVersion[] = [
    {
      id: "v3",
      version: 3,
      status: "published",
      created_at: "2023-08-01T10:15:00Z",
      updated_by: "Alex Johnson",
      changes: [
        { type: "added", component: "Modal", details: "Added confirmation modal" },
        { type: "modified", component: "Tooltip", details: "Updated tooltip content" },
      ],
      notes: "Release version with improved UI and fixed tooltip positioning"
    },
    {
      id: "v2",
      version: 2,
      status: "archived",
      created_at: "2023-07-15T14:30:00Z",
      updated_by: "Alex Johnson",
      changes: [
        { type: "added", component: "Tooltip", details: "Added help tooltips to main functions" },
        { type: "modified", component: "Flow", details: "Reordered onboarding steps" },
      ],
      notes: "Beta version with tooltips and revised flow order"
    },
    {
      id: "v1",
      version: 1,
      status: "archived",
      created_at: "2023-07-01T09:00:00Z",
      updated_by: "Alex Johnson",
      changes: [
        { type: "added", component: "Modal", details: "Created initial welcome modal" },
        { type: "added", component: "Hotspot", details: "Added hotspot for new features" },
      ],
      notes: "Initial version of the onboarding flow"
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
        
        // In a real app, we would fetch versions from the database
        // For now, using sample data
        setVersions(sampleVersions);
        setSelectedVersion(sampleVersions[0]);
        
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
  
  const handleRollback = (versionId: string) => {
    const selectedVersion = versions.find(v => v.id === versionId);
    
    toast({
      title: "Version restored",
      description: `Rolled back to version ${selectedVersion?.version}`,
    });
  };
  
  const handleCreateDraft = () => {
    toast({
      title: "Draft created",
      description: "New draft version created from current version",
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'draft':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
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
          <h1 className="text-2xl font-bold">Version History: {flow?.title}</h1>
        </div>
        
        <Button onClick={handleCreateDraft} className="bg-quickstartify-purple hover:bg-quickstartify-purple/90">
          Create New Draft
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Version History</h2>
                <p className="text-sm text-muted-foreground">Select a version to view details</p>
              </div>
              
              <ScrollArea className="h-[600px]">
                {versions.map((version) => (
                  <div 
                    key={version.id}
                    className={`border-b p-4 cursor-pointer ${selectedVersion?.id === version.id ? 'bg-muted' : ''}`}
                    onClick={() => setSelectedVersion(version)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-quickstartify-purple/10 flex items-center justify-center mr-2">
                          <History className="h-4 w-4 text-quickstartify-purple" />
                        </div>
                        <div>
                          <h3 className="font-medium">Version {version.version}</h3>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(version.created_at)} at {formatTime(version.created_at)}
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClass(version.status)}`}>
                        {version.status.charAt(0).toUpperCase() + version.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <User className="h-3 w-3 mr-1" />
                      <span>{version.updated_by}</span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedVersion ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Version {selectedVersion.version}</h2>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-3">{formatDate(selectedVersion.created_at)}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="mr-3">{formatTime(selectedVersion.created_at)}</span>
                      <User className="h-4 w-4 mr-1" />
                      <span>{selectedVersion.updated_by}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" /> Duplicate
                    </Button>
                    
                    <Button variant="outline" size="sm" onClick={() => navigate(`/flow/${id}/preview?version=${selectedVersion.version}`)}>
                      <Eye className="h-4 w-4 mr-2" /> Preview
                    </Button>
                    
                    {selectedVersion.status !== "published" ? (
                      <Button size="sm" className="bg-quickstartify-purple hover:bg-quickstartify-purple/90">
                        <CheckCircle className="h-4 w-4 mr-2" /> Publish
                      </Button>
                    ) : (
                      <Button size="sm" disabled variant="secondary">
                        <CheckCircle className="h-4 w-4 mr-2" /> Published
                      </Button>
                    )}
                    
                    {selectedVersion.status !== "published" && selectedVersion.version !== 1 && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRollback(selectedVersion.id)}
                      >
                        <Undo className="h-4 w-4 mr-2" /> Rollback
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-2">Notes</h3>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    {selectedVersion.notes}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3">Changes</h3>
                  <div className="space-y-3">
                    {selectedVersion.changes.map((change, index) => (
                      <div key={index} className="flex items-start border-l-2 pl-3 py-1" style={{
                        borderColor: change.type === "added" ? "#22c55e" : 
                                    change.type === "modified" ? "#f59e0b" : 
                                    "#ef4444"
                      }}>
                        <div>
                          <div className="flex items-center">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              change.type === "added" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                              change.type === "modified" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" : 
                              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                              {change.type.charAt(0).toUpperCase() + change.type.slice(1)}
                            </span>
                            <span className="text-sm font-medium ml-2">{change.component}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {change.details}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-sm font-semibold mb-2">Comments</h3>
                  <div className="bg-muted p-3 rounded-md text-sm flex flex-col items-center justify-center py-10">
                    <MessageCircle className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-1">No comments on this version</p>
                    <p className="text-xs text-muted-foreground">Comment functionality coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a version to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowVersions;
