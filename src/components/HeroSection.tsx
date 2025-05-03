
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-hero-pattern opacity-40"></div>
      <div className="absolute top-1/4 -right-64 w-96 h-96 bg-quickstartify-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-quickstartify-blue/10 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            <span className="text-gradient">Turn First-Time Users</span>{" "}
            <br className="hidden sm:block" />
            Into Lifelong Customers
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-delayed">
            Onboarding flows made easy — walkthroughs, tooltips, modals, and analytics — 
            without writing a single line of backend code.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-delayed">
            <Button size="lg" className="px-8">
              Start Free
            </Button>
            <Button size="lg" variant="outline" className="group">
              See Live Demo
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          {/* Product preview */}
          <div className="relative max-w-5xl mx-auto animate-fade-in-delayed">
            <div className="aspect-[16/9] bg-gradient-purple rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900/90 backdrop-blur-sm relative">
                  {/* Simulated product UI */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-36 md:w-80 md:h-56 bg-white/10 rounded-lg border border-white/20 backdrop-blur-md flex items-center justify-center animate-pulse-slow">
                    <div className="text-center p-4">
                      <p className="text-white text-xs md:text-sm font-medium mb-2">Welcome to Our Platform</p>
                      <p className="text-white/70 text-[10px] md:text-xs mb-3">Let's get you started with a quick tour</p>
                      <button className="bg-quickstartify-purple text-white text-[10px] md:text-xs px-2 md:px-3 py-1 rounded">
                        Start Tour
                      </button>
                    </div>
                  </div>
                  
                  {/* Tooltip example */}
                  <div className="absolute top-[30%] right-[20%] w-40 md:w-52 h-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 animate-float">
                    <div className="h-2 w-2 rotate-45 bg-white dark:bg-gray-800 absolute -left-1 top-1/2 transform -translate-y-1/2"></div>
                    <p className="text-xs md:text-sm font-medium mb-1">Analytics Dashboard</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">View real-time metrics of your onboarding flow performance</p>
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
