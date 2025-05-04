
import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function LaunchAnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!isVisible) return null;

  const handleAction = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-quickstartify-purple text-white w-full py-2 md:py-3 px-4 md:px-6 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-2 sm:mb-0">
          <span className="text-xs md:text-sm font-medium">
            🚀 QuickStartify Flow Builder is now available! Create your first onboarding flow today.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 text-xs border-white text-white hover:bg-white hover:text-quickstartify-purple"
            onClick={handleAction}
          >
            {user ? 'Go to Dashboard' : 'Try It Now'}
          </Button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-white/80"
            aria-label="Close announcement"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
