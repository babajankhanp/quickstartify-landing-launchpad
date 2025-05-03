
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin } from "lucide-react";

export function LaunchAnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Set a timer to open the modal after 5 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    // Clean up the timer when component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            <span className="text-quickstartify-purple">We're Launching Soon</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4 text-center">
          <p className="text-lg">Still In Ideation Phase</p>
          <div className="bg-quickstartify-purple/10 p-4 rounded-lg">
            <h3 className="font-semibold text-quickstartify-purple">Looking for Rockstar Founding Team</h3>
            <p className="font-medium mt-1">(Backend Engineer)</p>
          </div>
          
          <div className="mt-4">
            <p className="font-medium">Reach Out to Babajan Patan</p>
            <div className="flex flex-col gap-3 justify-center mt-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>babajank98@gmail.com</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <a href="https://www.linkedin.com/in/babajan-patan" target="_blank" rel="noreferrer">
                  <Linkedin className="h-4 w-4" />
                  <span>linkedin.com/in/babajan-patan</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={() => setIsOpen(false)}>
            Awesome! I'll Check Back Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
