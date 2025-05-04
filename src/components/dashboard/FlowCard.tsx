
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flow } from "@/integrations/supabase/models";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Eye, 
  BarChart2, 
  Archive, 
  Pencil, 
  GitBranch, 
  ChevronDown,
  PenTool,
  TestTube
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FlowCardProps {
  flow: Flow;
  onUpdate: () => void;
}

export const FlowCard = ({ flow, onUpdate }: FlowCardProps) => {
  const navigate = useNavigate();
  const [isToggling, setIsToggling] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  
  const formattedDate = new Date(flow.updated_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const handleEdit = () => {
    navigate(`/flow/${flow.id}`);
  };

  const handlePreview = () => {
    navigate(`/flow/${flow.id}/preview`);
  };

  const handleMetrics = () => {
    navigate(`/flow/${flow.id}/metrics`);
  };

  const handleVersions = () => {
    navigate(`/flow/${flow.id}/versions`);
  };
  
  const handleABTest = () => {
    navigate(`/flow/${flow.id}/ab-test`);
  };
  
  const handleBranding = () => {
    navigate(`/flow/${flow.id}/branding`);
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      // In a real implementation, you would add an archived column to the flows table
      // For now, we'll just simulate archiving by showing a toast
      toast({
        title: "Flow archived",
        description: "The flow has been archived successfully"
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error archiving flow",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsArchiving(false);
    }
  };

  const toggleActive = async () => {
    setIsToggling(true);
    try {
      const { error } = await supabase
        .from('flows')
        .update({ 
          is_active: !flow.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', flow.id);
        
      if (error) throw error;
      
      toast({
        title: flow.is_active ? "Flow deactivated" : "Flow activated",
        description: flow.is_active 
          ? "The flow has been deactivated and will no longer be shown to users" 
          : "The flow is now active and will be shown to users"
      });
      
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error updating flow",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:border-quickstartify-purple/50 hover:shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{flow.title}</CardTitle>
            <CardDescription className="mt-1">{flow.description || "No description provided"}</CardDescription>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${flow.is_active ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
            {flow.is_draft ? 'Draft' : (flow.is_active ? 'Active' : 'Inactive')}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="text-sm text-muted-foreground">
          <p>Version {flow.version}</p>
          <p>Last updated: {formattedDate}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <Pencil className="w-4 h-4 mr-1" /> Edit
        </Button>
        <Button variant="outline" size="sm" onClick={handlePreview} disabled={!flow.is_active}>
          <Eye className="w-4 h-4 mr-1" /> Preview
        </Button>
        
        <Button 
          variant={flow.is_active ? "outline" : "default"}
          size="sm" 
          onClick={toggleActive} 
          disabled={isToggling}
          className={flow.is_active ? "" : "bg-quickstartify-purple hover:bg-quickstartify-purple/90"}
        >
          {flow.is_active ? "Deactivate" : "Activate"}
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <ChevronDown className="h-4 w-4 mr-1" /> More
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="flex flex-col space-y-1">
              <Button variant="ghost" size="sm" onClick={handleMetrics} className="justify-start">
                <BarChart2 className="w-4 h-4 mr-2" /> Analytics
              </Button>
              <Button variant="ghost" size="sm" onClick={handleVersions} className="justify-start">
                <GitBranch className="w-4 h-4 mr-2" /> Versions
              </Button>
              <Button variant="ghost" size="sm" onClick={handleABTest} className="justify-start">
                <TestTube className="w-4 h-4 mr-2" /> A/B Testing
              </Button>
              <Button variant="ghost" size="sm" onClick={handleBranding} className="justify-start">
                <PenTool className="w-4 h-4 mr-2" /> Branding
              </Button>
              <Button variant="ghost" size="sm" onClick={handleArchive} className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                <Archive className="w-4 h-4 mr-2" /> Archive
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
};
