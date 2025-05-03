
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/d047f3cd-5b10-4d9b-af66-71ccc390c5df.png" 
            alt="QuickStartify Logo" 
            className="h-8 md:h-10 w-auto" 
          />
          <span className="text-xl md:text-2xl font-bold">
            QuickStartify
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            <a href="#features" className="text-sm font-medium hover:text-quickstartify-purple transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-quickstartify-purple transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-quickstartify-purple transition-colors">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm">
              Log in
            </Button>
            <Button size="sm">Start Free</Button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-white dark:bg-gray-900 shadow-md">
          <div className="flex flex-col gap-2 text-center">
            <a href="#features" className="py-2 hover:text-quickstartify-purple" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#testimonials" className="py-2 hover:text-quickstartify-purple" onClick={() => setMobileMenuOpen(false)}>
              Testimonials
            </a>
            <a href="#pricing" className="py-2 hover:text-quickstartify-purple" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                Log in
              </Button>
              <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                Start Free
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
