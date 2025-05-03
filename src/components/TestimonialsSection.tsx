
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "QuickStartify helped us increase our activation rate by 57% in just two weeks. Our users no longer get lost in the product, and our customer success team is spending less time on support.",
      author: "Michael Torres",
      role: "CEO at TaskFlow",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80",
    },
    {
      quote: "The no-code interface is a game-changer. I was able to build an onboarding flow that matched our brand perfectly without writing a single line of code.",
      author: "Emma Williams",
      role: "Head of Growth at DataPulse",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
    },
    {
      quote: "I was skeptical about how much impact a better onboarding experience would have. After implementing QuickStartify, our trial-to-paid conversion jumped 42%. The ROI is incredible.",
      author: "Rahul Singh",
      role: "Product Manager at SalesAI",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&q=80",
    },
  ];

  return (
    <section id="testimonials" className="section">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by Product Teams
          </h2>
          <p className="text-lg text-muted-foreground">
            Here's what our customers say about their experience with QuickStartify.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
        
        <div className="mt-16 flex justify-center items-center space-x-8">
          <CompanyLogo name="Acme Inc." />
          <CompanyLogo name="Globex" />
          <CompanyLogo name="Stark" />
          <CompanyLogo name="Waystar" />
          <CompanyLogo name="Hooli" />
        </div>
      </div>
    </section>
  );
}

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  avatar: string;
};

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow flex flex-col">
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
          ))}
        </div>
        
        <blockquote className="flex-grow text-lg mb-6 italic">
          "{testimonial.quote}"
        </blockquote>
        
        <div className="flex items-center mt-auto">
          <img
            src={testimonial.avatar}
            alt={testimonial.author}
            className="h-10 w-10 rounded-full mr-4"
          />
          <div>
            <div className="font-semibold">{testimonial.author}</div>
            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CompanyLogo({ name }: { name: string }) {
  return (
    <div className="text-xl font-bold text-muted-foreground opacity-70 hover:opacity-100 transition-opacity hidden md:block">
      {name}
    </div>
  );
}
