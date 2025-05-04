
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, X } from "lucide-react";

export function LaunchAnnouncementModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the banner after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-quickstartify-purple/95 text-white py-3 px-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="text-lg font-semibold">We're Launching Soon</div>
            <div className="text-sm md:border-l md:border-white/30 md:pl-4">
              Still in ideation phase. Looking for Rockstar Founding Team (Backend Engineer)
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="text-sm font-medium">Reach out to Babajan Patan:</div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Mail className="h-3.5 w-3.5 mr-1.5" />
                <a href="mailto:babajank98@gmail.com">babajank98@gmail.com</a>
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20" asChild>
                <a href="https://www.linkedin.com/in/babajan-patan" target="_blank" rel="noreferrer">
                  <Linkedin className="h-3.5 w-3.5 mr-1.5" />
                  <span>LinkedIn</span>
                </a>
              </Button>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 md:relative md:top-0 md:right-0 h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
