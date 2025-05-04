
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface CreateFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateFlowModal = ({ isOpen, onClose }: CreateFlowModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a name for your flow",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('flows')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          is_draft: true,
          is_active: false,
          user_id: user!.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Flow created",
        description: "Your new flow has been created successfully",
      });
      
      onClose();
      // Redirect to the flow builder instead of the flow editor
      navigate(`/builder/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error creating flow",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new flow</DialogTitle>
            <DialogDescription>
              Create a new onboarding flow to guide your users
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="flowTitle" className="text-sm font-medium">
                Flow name*
              </label>
              <Input
                id="flowTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. User Onboarding"
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="flowDescription" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="flowDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this flow will do"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-quickstartify-purple hover:bg-quickstartify-purple/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Flow"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
