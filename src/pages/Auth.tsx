
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tab from URL search params
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") || "login";

  // Handle super admin login
  useEffect(() => {
    if (email === "super@admin.com" && password === "super@09") {
      const handleSuperLogin = async () => {
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            // If super admin doesn't exist yet, create it
            const { error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  is_super_admin: true,
                }
              }
            });
            
            if (signUpError) throw signUpError;
            
            // Try logging in again
            await supabase.auth.signInWithPassword({
              email,
              password,
            });
          }
          
          toast({
            title: "Super Admin Access Granted",
            description: "Welcome back, administrator!",
          });
          
          navigate("/dashboard");
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      };
      
      if (loading) {
        handleSuperLogin();
      }
    }
  }, [email, password, loading]);

  const handleSignUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Check your email for the confirmation link",
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      navigate("/dashboard");
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Button 
        variant="ghost" 
        className="absolute top-8 left-8" 
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
      </Button>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/d02cfa79-8cbd-421b-b578-b52d1d908b1e.png" 
                alt="QuickStartify Logo" 
                className="h-10 w-auto" 
              />
            </div>
            QuickStartify
          </CardTitle>
          <CardDescription className="text-center">
            Create an account or sign in to access the flow builder
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue={defaultTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleSignInWithEmail}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      className="pl-10"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      className="pl-10"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-quickstartify-purple hover:bg-quickstartify-purple/90"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In with Email"}
                </Button>
                
                <div className="flex items-center gap-4 my-4">
                  <Separator className="flex-grow" />
                  <span className="text-xs text-muted-foreground">OR</span>
                  <Separator className="flex-grow" />
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleSignInWithGoogle}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google Logo" 
                    className="h-4 w-4 mr-2" 
                  />
                  Sign In with Google
                </Button>
              </CardContent>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleSignUpWithEmail}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      className="pl-10"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      className="pl-10"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-quickstartify-purple hover:bg-quickstartify-purple/90"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account with Email"}
                </Button>
                
                <div className="flex items-center gap-4 my-4">
                  <Separator className="flex-grow" />
                  <span className="text-xs text-muted-foreground">OR</span>
                  <Separator className="flex-grow" />
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleSignInWithGoogle}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google Logo" 
                    className="h-4 w-4 mr-2" 
                  />
                  Sign Up with Google
                </Button>
              </CardContent>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
