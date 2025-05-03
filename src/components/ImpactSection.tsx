
import { Card, CardContent } from "@/components/ui/card";

export function ImpactSection() {
  return (
    <section id="impact" className="section bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Real Results from Real Customers</h2>
          <p className="text-lg text-muted-foreground">
            See the dramatic improvements companies achieve after implementing QuickStartify.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <CaseStudyChart />
          </div>
          
          <div className="order-1 lg:order-2">
            <Card className="overflow-hidden border-0 shadow-soft bg-white dark:bg-gray-800">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">D</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">DataViz Analytics</h3>
                    <p className="text-muted-foreground">B2B SaaS Platform</p>
                  </div>
                </div>
                
                <blockquote className="text-lg italic mb-6">
                  "Before QuickStartify, we struggled with a 32% activation rate. Users would sign up but get lost in our complex interface. Within 2 weeks of implementing guided onboarding flows, our activation jumped to 68% and our trial-to-paid conversions increased by 41%."
                </blockquote>
                
                <div className="grid grid-cols-2 gap-6">
                  <Metric label="Activation Rate" value="+112%" trend="up" />
                  <Metric label="Trial Conversions" value="+41%" trend="up" />
                  <Metric label="Support Tickets" value="-35%" trend="down" positive={true} />
                  <Metric label="Time to Value" value="-62%" trend="down" positive={true} />
                </div>
                
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex items-center">
                    <img 
                      src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?auto=format&fit=crop&w=80&q=80"
                      alt="Alex Morgan"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-semibold">Alex Morgan</div>
                      <div className="text-sm text-muted-foreground">Head of Product, DataViz</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseStudyChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft">
      <h3 className="text-xl font-semibold mb-4">Before vs. After Implementation</h3>
      
      {/* Simplified chart visualization */}
      <div className="h-64 flex items-end justify-around gap-4">
        {/* Before column group */}
        <div className="flex flex-col items-center gap-6 w-full">
          <h4 className="font-semibold text-center">Before</h4>
          <div className="flex justify-around w-full">
            <ChartBar height={30} color="bg-red-200 dark:bg-red-900" label="Activation" value="32%" />
            <ChartBar height={40} color="bg-orange-200 dark:bg-orange-900" label="Conversion" value="19%" />
            <ChartBar height={70} color="bg-red-200 dark:bg-red-900" label="Drop-off" value="68%" />
          </div>
        </div>
        
        {/* After column group */}
        <div className="flex flex-col items-center gap-6 w-full">
          <h4 className="font-semibold text-center">After</h4>
          <div className="flex justify-around w-full">
            <ChartBar height={70} color="bg-green-200 dark:bg-green-900" label="Activation" value="68%" />
            <ChartBar height={60} color="bg-green-200 dark:bg-green-900" label="Conversion" value="42%" />
            <ChartBar height={30} color="bg-orange-200 dark:bg-orange-900" label="Drop-off" value="26%" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartBar({ height, color, label, value }: { height: number; color: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-xs font-semibold">{value}</div>
      <div 
        className={`w-10 ${color} rounded-t`} 
        style={{ height: `${height}%` }}
      ></div>
      <div className="mt-2 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Metric({ label, value, trend, positive = false }: { 
  label: string; 
  value: string; 
  trend: "up" | "down";
  positive?: boolean;
}) {
  const isPositive = (trend === "up" && !positive) || (trend === "down" && positive);
  const colorClass = isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}
