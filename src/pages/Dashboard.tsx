
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Flow } from "@/integrations/supabase/models";
import { useAuth } from "@/contexts/AuthContext";
import { CreateFlowModal } from "@/components/dashboard/CreateFlowModal";
import { FlowCard } from "@/components/dashboard/FlowCard";
import { EmptyFlowsState } from "@/components/dashboard/EmptyFlowsState";

const Dashboard = () => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const fetchFlows = async () => {
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
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const handleCreateFlow = () => {
    setShowCreateModal(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Onboarding Flows</h1>
        <div className="flex gap-4">
          <Button onClick={handleCreateFlow} className="bg-quickstartify-purple hover:bg-quickstartify-purple/90">
            <Plus className="mr-2 h-4 w-4" /> Create New Flow
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-quickstartify-purple border-t-transparent rounded-full"></div>
        </div>
      ) : flows.length === 0 ? (
        <EmptyFlowsState onCreateFlow={handleCreateFlow} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flows.map((flow) => (
            <FlowCard key={flow.id} flow={flow} onUpdate={fetchFlows} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateFlowModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
