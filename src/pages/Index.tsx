
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

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
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
