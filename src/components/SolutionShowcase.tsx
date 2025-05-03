
import { Check, Zap, Rocket, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export function SolutionShowcase() {
  const [activeBlock, setActiveBlock] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  
  const flowElements = [
    "Welcome Modal", 
    "Feature Tooltip", 
    "Hotspot", 
    "Progress Bar", 
    "Success Dialog"
  ];
  
  // Animation to cycle through adding different onboarding elements
  useEffect(() => {
    const timer = setInterval(() => {
      setIsAdding(true);
      
      // Reset the adding animation after a short delay
      setTimeout(() => {
        setIsAdding(false);
        setActiveBlock((prev) => (prev + 1) % flowElements.length);
      }, 800);
    }, 3000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="solution" className="section relative overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Boost Product Adoption with <span className="text-gradient">Zero Coding</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              QuickStartify turns your complex onboarding process into a delightful experience that gets users to their "aha moment" faster.
            </p>
            
            <div className="space-y-6">
              <FeatureItem 
                icon={<Check className="h-5 w-5" />}
                title="1-Line JavaScript Embed"
                description="Add one script tag to your site and your onboarding flows are live. No backend integration required."
              />
              <FeatureItem 
                icon={<Zap className="h-5 w-5" />}
                title="Zero Engineering Lift"
                description="Design and deploy professional onboarding without bothering your dev team or waiting for the next sprint."
              />
              <FeatureItem 
                icon={<Rocket className="h-5 w-5" />}
                title="Immediate Impact"
                description="See improvements in user activation and retention rates within days, not months."
              />
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-border">
              <p className="text-sm font-mono mb-2 text-muted-foreground">Copy and paste this single line:</p>
              <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
                <code className="text-sm font-mono text-quickstartify-purple">
                  &lt;script src="https://cdn.quickstartify.com/init.js" data-app-id="YOUR_APP_ID" async&gt;&lt;/script&gt;
                </code>
              </div>
            </div>
          </div>
          
          <div className="relative">
            {/* Product demo/visualization */}
            <div className="aspect-[4/3] relative bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden border border-border">
              {/* No-code flow builder visualization */}
              <div className="absolute inset-0 p-4">
                <div className="bg-gray-100 dark:bg-gray-700 h-12 rounded-t-lg flex items-center px-4 gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-xs font-medium">QuickStartify Flow Builder</div>
                </div>
                <div className="bg-white dark:bg-gray-800 h-[calc(100%-3rem)] rounded-b-lg p-4 flex">
                  {/* Flow builder sidebar */}
                  <div className="w-1/3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-xs font-medium mb-3">Flow Elements</div>
                    <div className="space-y-2">
                      {flowElements.map((item, i) => (
                        <div 
                          key={i} 
                          className={`bg-white dark:bg-gray-600 p-2 rounded text-xs flex items-center gap-2 transition-all duration-300 ${
                            activeBlock === i ? "bg-quickstartify-purple/10 dark:bg-quickstartify-purple/20 border border-quickstartify-purple/30" : ""
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full ${
                            activeBlock === i ? "bg-quickstartify-purple animate-pulse" : "bg-quickstartify-purple/50"
                          }`}></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Flow builder canvas */}
                  <div className="w-2/3 p-3">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg h-full p-4 relative">
                      {/* Central modal */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-28 bg-white dark:bg-gray-800 rounded border border-quickstartify-purple shadow-lg">
                        <div className="h-6 bg-quickstartify-purple rounded-t flex items-center justify-between px-2">
                          <span className="text-white text-[8px]">Welcome</span>
                          <span className="text-white text-[8px]">×</span>
                        </div>
                        <div className="p-2 flex flex-col items-center justify-center h-[calc(100%-1.5rem)]">
                          <div className="h-1.5 w-16 bg-gray-200 dark:bg-gray-600 rounded mb-1.5"></div>
                          <div className="h-1.5 w-12 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                          <div className="h-3 w-10 bg-quickstartify-purple rounded"></div>
                        </div>
                      </div>
                      
                      {/* Add block animation */}
                      {isAdding && (
                        <div className="absolute top-1/2 left-1/3 animate-fade-in-delayed">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-quickstartify-purple/80 flex items-center justify-center">
                              <Plus className="h-4 w-4 text-white" />
                            </div>
                            <div className="h-0.5 w-12 bg-quickstartify-purple/60"></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Connection nodes and blocks */}
                      <div className={`absolute ${isAdding ? "animate-fade-in" : ""} top-1/4 right-1/4 w-16 h-12 border border-gray-300 dark:border-gray-500 rounded bg-white/80 dark:bg-gray-800/80 shadow-sm flex items-center justify-center`}>
                        <div className="h-1.5 w-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                      
                      <div className={`absolute ${activeBlock > 2 ? "animate-fade-in" : "opacity-0"} bottom-1/4 left-1/3 w-20 h-10 border border-gray-300 dark:border-gray-500 rounded bg-white/80 dark:bg-gray-800/80 shadow-sm flex items-center justify-center`}>
                        <div className="h-1.5 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                      
                      {/* Animated connection lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                        <path 
                          d="M120,80 C150,100 180,120 210,100" 
                          stroke="rgb(139,92,246)" 
                          strokeWidth="1.5" 
                          strokeDasharray="4 2"
                          fill="none"
                          className={`${activeBlock === 1 ? "animate-pulse-slow" : "opacity-40"}`}
                        />
                        
                        <path 
                          d="M100,140 C120,170 150,180 180,150" 
                          stroke="rgb(139,92,246)" 
                          strokeWidth="1.5" 
                          strokeDasharray="4 2"
                          fill="none"
                          className={`${activeBlock === 3 ? "animate-pulse-slow" : "opacity-40"}`}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating microcopy pointing to the flow builder */}
              <div className="absolute bottom-4 right-4 bg-quickstartify-purple/90 text-white text-xs p-2 rounded-lg shadow-md animate-float">
                Add elements with no-code!
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-quickstartify-purple/90"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 h-8 w-8 rounded-full bg-quickstartify-purple/10 flex items-center justify-center text-quickstartify-purple">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
