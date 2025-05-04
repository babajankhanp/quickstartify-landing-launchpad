
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
import { LaunchAnnouncementBanner } from "@/components/LaunchAnnouncementBanner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <LaunchAnnouncementBanner />
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
    </div>
  );
};

export default Index;
