
import { Card } from "@/components/ui/card";

export function ProblemSection() {
  return (
    <section id="problem" className="section bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Poor Onboarding Is Killing Your Conversions
          </h2>
          <p className="text-lg text-muted-foreground">
            The first few minutes of user experience determine whether they'll become
            paying customers or bounce forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            stat="67%"
            title="User Drop-off"
            description="Most users will abandon your product if they don't understand how to use it within 60 seconds."
          />
          <StatCard
            stat="86%"
            title="Increased Retention"
            description="Businesses with effective onboarding see dramatic improvements in user retention rates."
            highlighted={true}
          />
          <StatCard
            stat="4.3x"
            title="Conversion Lift"
            description="Interactive guided tours increase conversion rates by an average of 4.3x compared to self-discovery."
          />
        </div>

        <div className="mt-20 max-w-3xl mx-auto glass-card p-6 md:p-8">
          <blockquote className="text-lg md:text-xl italic font-medium text-center">
            "We were losing over half our trial users in the first day. After implementing proper onboarding flows, our activation metrics skyrocketed. It was the highest-impact growth project we've ever done."
            <footer className="mt-4 text-base font-normal text-muted-foreground">
              — Sarah Chen, Founder at MetricFlow
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, title, description, highlighted = false }: { 
  stat: string; 
  title: string; 
  description: string; 
  highlighted?: boolean;
}) {
  return (
    <Card className={`p-6 md:p-8 text-center transition-all duration-300 hover:shadow-hover ${
      highlighted ? 'border-quickstartify-purple bg-gradient-purple-light' : ''
    }`}>
      <div className="font-display text-4xl md:text-5xl font-bold mb-2 text-quickstartify-purple">
        {stat}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}
