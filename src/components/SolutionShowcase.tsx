
import { Check, Zap, Rocket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SolutionShowcase() {
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
                      {["Welcome Modal", "Feature Tooltip", "Hotspot", "Progress Bar", "Success Dialog"].map((item, i) => (
                        <div key={i} className="bg-white dark:bg-gray-600 p-2 rounded text-xs flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-quickstartify-purple"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Flow builder canvas */}
                  <div className="w-2/3 p-3">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg h-full p-4 relative">
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
                      
                      {/* Connection lines */}
                      <div className="absolute top-1/4 right-1/4 w-16 h-12 border border-gray-300 dark:border-gray-500 rounded"></div>
                      <div className="absolute bottom-1/4 left-1/3 w-20 h-10 border border-gray-300 dark:border-gray-500 rounded"></div>
                    </div>
                  </div>
                </div>
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
