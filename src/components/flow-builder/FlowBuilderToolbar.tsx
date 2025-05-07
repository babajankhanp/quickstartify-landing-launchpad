
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Save, 
  Play, 
  Eye, 
  Settings2, 
  BarChart2, 
  GitBranch, 
  TestTube, 
  PenTool,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface FlowBuilderToolbarProps {
  flowName: string;
  onFlowNameChange: (name: string) => void;
  onSave: () => void;
  saving?: boolean;
}

export function FlowBuilderToolbar({ 
  flowName, 
  onFlowNameChange, 
  onSave,
  saving = false 
}: FlowBuilderToolbarProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="border-b p-3 flex items-center justify-between bg-white dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        {isEditing ? (
          <Input
            value={flowName}
            onChange={(e) => onFlowNameChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="w-64 h-8"
            autoFocus
          />
        ) : (
          <h2 
            className="text-lg font-semibold cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {flowName}
          </h2>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {id && id !== 'new' && (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/flow/${id}/ab-test`)}
            >
              <TestTube className="h-4 w-4 mr-2" />
              A/B Test
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/flow/${id}/branding`)}
            >
              <PenTool className="h-4 w-4 mr-2" />
              Branding
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/flow/${id}/versions`)}
            >
              <GitBranch className="h-4 w-4 mr-2" />
              Versions
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/flow/${id}/metrics`)}
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/flow/${id}/settings`)}
            >
              <Settings2 className="h-4 w-4 mr-2" />
              Settings
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/flow/${id}/preview`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save
        </Button>
        
        <Button className="bg-quickstartify-purple hover:bg-quickstartify-purple/90">
          <Play className="h-4 w-4 mr-2" />
          Publish
        </Button>
      </div>
    </div>
  );
}
