
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export function PricingSection() {
  const pricingPlans = [
    {
      name: "Free",
      description: "Perfect for trying out QuickStartify",
      price: "$0",
      billing: "forever",
      features: [
        "Basic onboarding flows",
        "Up to 100 monthly active users",
        "2 onboarding sequences",
        "Basic analytics",
        "Community support"
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Growth",
      description: "For growing startups and small businesses",
      price: "$49",
      billing: "per month",
      features: [
        "Advanced onboarding flows",
        "Up to 2,000 monthly active users",
        "Unlimited onboarding sequences",
        "Advanced analytics dashboard",
        "Custom branding",
        "A/B testing",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Scale",
      description: "For larger businesses with complex needs",
      price: "$199",
      billing: "per month",
      features: [
        "Everything in Growth",
        "Unlimited monthly active users",
        "Custom integrations",
        "User segmentation",
        "Multi-product support",
        "Team collaboration",
        "Priority support",
        "Dedicated success manager"
      ],
      cta: "Contact Sales",
      popular: false,
    }
  ];

  return (
    <section id="pricing" className="section bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            All plans come with a 14-day trial. No credit card required.
            <br />
            Enterprise customers: Contact us for custom pricing.
          </p>
          <div className="flex items-center justify-center gap-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
              alt="Stripe" 
              className="h-6" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/f/f2/VISA_Logo.svg" 
              alt="Visa" 
              className="h-5" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" 
              alt="Mastercard" 
              className="h-6" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type PricingPlan = {
  name: string;
  description: string;
  price: string;
  billing: string;
  features: string[];
  cta: string;
  popular: boolean;
};

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <Card className={`flex flex-col h-full ${
      plan.popular 
        ? 'border-quickstartify-purple shadow-lg relative' 
        : 'shadow-soft'
    }`}>
      {plan.popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-quickstartify-purple text-white text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="mb-6">
          <span className="text-4xl font-bold">{plan.price}</span>
          <span className="text-muted-foreground"> / {plan.billing}</span>
        </div>

        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-quickstartify-purple mr-2 shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button 
          className={`w-full ${plan.popular ? 'bg-quickstartify-purple hover:bg-quickstartify-dark-purple' : ''}`}
          variant={plan.popular ? 'default' : 'outline'}
        >
          {plan.cta}
        </Button>
      </CardFooter>
    </Card>
  );
}
