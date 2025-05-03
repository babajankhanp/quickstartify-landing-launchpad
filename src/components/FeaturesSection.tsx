
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Users, Star, Calendar, Clock } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "No-Code Flow Builder",
      description: "Drag-and-drop interface for creating any onboarding experience without coding.",
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: "Custom Branding",
      description: "Match your onboarding flows to your brand with full customization options.",
      icon: <Star className="h-6 w-6" />
    },
    {
      title: "Drop-off Analytics",
      description: "Real-time insights on where users are getting stuck in your onboarding flow.",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Stripe Integration",
      description: "Seamlessly integrate with your Stripe billing to increase paid conversions.",
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: "Works Everywhere",
      description: "Compatible with any web stack including React, Vue, Angular, or vanilla JS.",
      icon: <Calendar className="h-6 w-6" />
    },
    {
      title: "Instant Deployment",
      description: "Changes go live instantly—no waiting for app store approvals or deploys.",
      icon: <Zap className="h-6 w-6" />
    }
  ];
  
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for Perfect Onboarding
          </h2>
          <p className="text-lg text-muted-foreground">
            Build onboarding experiences that convert visitors into power users,
            without disrupting your development roadmap.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to transform your user experience?
          </h3>
          <p className="text-lg mb-8 text-muted-foreground">
            Join hundreds of SaaS companies already boosting their activation rates with QuickStartify.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="border transition-all duration-300 hover:shadow-hover overflow-hidden">
      <CardHeader className="pb-2">
        <div className="h-12 w-12 rounded-lg bg-quickstartify-purple/10 flex items-center justify-center text-quickstartify-purple mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
