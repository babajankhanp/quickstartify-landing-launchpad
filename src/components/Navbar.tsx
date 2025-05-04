
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const authButtons = user ? (
    <>
      <Button 
        onClick={() => navigate("/dashboard")} 
        variant="outline" 
        size="sm"
      >
        Dashboard
      </Button>
      <Button 
        onClick={handleSignOut} 
        size="sm"
      >
        <LogOut className="h-4 w-4 mr-1" /> Sign Out
      </Button>
    </>
  ) : (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate("/auth")}
      >
        Log in
      </Button>
      <Button 
        size="sm"
        onClick={() => navigate("/auth?tab=register")}
      >
        Sign Up
      </Button>
    </>
  );

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
            src="/lovable-uploads/d02cfa79-8cbd-421b-b578-b52d1d908b1e.png" 
            alt="QuickStartify Logo" 
            className="h-8 md:h-10 w-auto" 
          />
          <span className="text-xl md:text-2xl font-bold text-quickstartify-purple">
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
            {authButtons}
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
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      navigate("/dashboard");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      navigate("/auth");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log in
                  </Button>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      navigate("/auth?tab=register");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
