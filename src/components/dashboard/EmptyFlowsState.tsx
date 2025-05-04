
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyFlowsStateProps {
  onCreateFlow: () => void;
}

export const EmptyFlowsState = ({ onCreateFlow }: EmptyFlowsStateProps) => {
  return (
    <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed">
      <h3 className="text-xl font-medium mb-2">No flows created yet</h3>
      <p className="text-muted-foreground mb-6">Create your first onboarding flow to get started</p>
      <Button onClick={onCreateFlow} className="bg-quickstartify-purple hover:bg-quickstartify-purple/90">
        <Plus className="mr-2 h-4 w-4" /> Create First Flow
      </Button>
    </div>
  );
};
