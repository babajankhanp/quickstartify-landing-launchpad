
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Loader2,
  Sparkles,
  Zap,
  Share2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface EnhancedToolbarProps {
  flowName: string;
  onFlowNameChange: (name: string) => void;
  onSave: () => void;
  saving?: boolean;
}

export function EnhancedToolbar({ 
  flowName, 
  onFlowNameChange, 
  onSave,
  saving = false 
}: EnhancedToolbarProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-9 w-9 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          
          {isEditing ? (
            <Input
              value={flowName}
              onChange={(e) => onFlowNameChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
              className="w-64 h-9 font-semibold"
              autoFocus
            />
          ) : (
            <h1 
              className="text-xl font-bold cursor-pointer hover:text-purple-600 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {flowName}
            </h1>
          )}
          
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            Draft
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {id && id !== 'new' && (
          <>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-9 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => navigate(`/flow/${id}/ab-test`)}
            >
              <TestTube className="h-4 w-4 mr-2" />
              A/B Test
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="h-9 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => navigate(`/flow/${id}/branding`)}
            >
              <PenTool className="h-4 w-4 mr-2" />
              Branding
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="h-9 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => navigate(`/flow/${id}/versions`)}
            >
              <GitBranch className="h-4 w-4 mr-2" />
              Versions
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="h-9 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => navigate(`/flow/${id}/metrics`)}
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="h-9 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => navigate(`/flow/${id}/settings`)}
            >
              <Settings2 className="h-4 w-4 mr-2" />
              Settings
            </Button>
            
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />
            
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 text-sm"
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
          className="h-9 text-sm"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save
        </Button>
        
        <Button 
          className="h-9 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="sm"
        >
          <Zap className="h-4 w-4 mr-2" />
          Publish
        </Button>
      </div>
    </div>
  );
}
