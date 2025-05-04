
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Flow } from "@/integrations/supabase/models";

const Dashboard = () => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFlows() {
      try {
        const { data, error } = await supabase
          .from('flows')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setFlows(data || []);
      } catch (error: any) {
        toast({
          title: "Error loading flows",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchFlows();
  }, []);

  const handleCreateFlow = () => {
    navigate('/flow/new');
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Onboarding Flows</h1>
        <Button onClick={handleCreateFlow} className="bg-quickstartify-purple hover:bg-quickstartify-purple/90">
          <Plus className="mr-2 h-4 w-4" /> Create New Flow
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-quickstartify-purple border-t-transparent rounded-full"></div>
        </div>
      ) : flows.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed">
          <h3 className="text-xl font-medium mb-2">No flows created yet</h3>
          <p className="text-muted-foreground mb-6">Create your first onboarding flow to get started</p>
          <Button onClick={handleCreateFlow} className="bg-quickstartify-purple hover:bg-quickstartify-purple/90">
            <Plus className="mr-2 h-4 w-4" /> Create First Flow
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flows.map((flow) => (
            <div 
              key={flow.id} 
              className="border rounded-lg p-4 cursor-pointer hover:border-quickstartify-purple/50 hover:shadow-md transition-all"
              onClick={() => navigate(`/flow/${flow.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{flow.title}</h3>
                <div className={`text-xs px-2 py-1 rounded ${flow.is_active ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {flow.is_draft ? 'Draft' : (flow.is_active ? 'Active' : 'Inactive')}
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{flow.description || 'No description'}</p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Version {flow.version}</span>
                <span>Updated {new Date(flow.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
