
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-16 border-t border-border">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <a href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-gradient">QuickStartify</span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Turn first-time users into lifelong customers with powerful onboarding flows.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" label="Twitter" />
              <SocialLink href="#" label="LinkedIn" />
              <SocialLink href="#" label="GitHub" />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
              <FooterLink href="#testimonials">Testimonials</FooterLink>
              <FooterLink href="#">Documentation</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <FooterLink href="#">About</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Cookie Policy</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {currentYear} QuickStartify. All rights reserved.
          </p>
          
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              Privacy
            </Button>
            <Button variant="ghost" size="sm">
              Terms
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a 
        href={href} 
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {children}
      </a>
    </li>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a 
      href={href} 
      aria-label={label}
      className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-quickstartify-purple hover:text-white transition-colors"
    >
      {/* Simplified social icon representation */}
      <span className="font-bold text-sm">{label.charAt(0)}</span>
    </a>
  );
}
