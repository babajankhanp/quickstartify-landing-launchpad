
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionShowcase } from "@/components/SolutionShowcase";
import { ImpactSection } from "@/components/ImpactSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { LaunchAnnouncementModal } from "@/components/LaunchAnnouncementModal";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <div className="container mx-auto mt-4 mb-8 flex justify-end">
          <Button 
            onClick={() => navigate("/dashboard")}
            className="bg-quickstartify-purple hover:bg-quickstartify-purple/90"
          >
            Flow Builder Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <HeroSection />
        <ProblemSection />
        <SolutionShowcase />
        <ImpactSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <FinalCTA />
      </main>
      <Footer />
      <LaunchAnnouncementModal />
    </div>
  );
};

export default Index;
