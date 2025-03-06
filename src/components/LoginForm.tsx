
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import GoogleSignInButton from "./auth/GoogleSignInButton";
import AuthHeader from "./auth/AuthHeader";
import EmailPasswordForm from "./auth/EmailPasswordForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { usePayment } from "@/hooks/use-payment";

const LoginForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createStripeCustomer } = usePayment();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    try {
      console.log("Attempting auth with Supabase");
      
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setLoginError("Passwords do not match");
          return;
        }

        //CREATE ACCOUNT
        const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signUpError) throw signUpError;
        
        console.log("Sign up successful:", signUpData);

        //SIGN IN
        const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;
        
        console.log("Sign in successful:", signInData);

        //CREATE STRIPE CUSTOMER
        const { data, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;

        // ✅ Call Hook to Create Stripe Customer
        await createStripeCustomer(data.user.id, data.user.email);

        //SUCCESS
        toast({
          title: "Success",
          description: "Account created and logged in successfully",
        });

        navigate("/app/dashboard");
      }

      else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        
        console.log("Login successful:", data);

        toast({
          title: "Welcome back",
          description: "You have been logged in successfully",
        });

        navigate("/app/dashboard");
      }
    }

    catch (error: any) {
      console.error("Authentication error:", error);
      setLoginError(error.message || "An error occurred during authentication");
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }

    finally {
      setIsLoading(false);
    }
  };

  // Check if we're using the default placeholder values by checking the URL from our client file
  const isUsingDefaultSupabaseConfig = !import.meta.env.VITE_SUPABASE_URL || 
    import.meta.env.VITE_SUPABASE_URL === 'https://example.supabase.co' || 
    import.meta.env.VITE_SUPABASE_URL === '';

  return (
    <Card className="p-6 space-y-6 animate-fade-up bg-gray-800 border-gray-800">
      <AuthHeader isSignUp={isSignUp} />

      {isUsingDefaultSupabaseConfig && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            Supabase is not properly configured. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_KEY environment variables.
          </AlertDescription>
        </Alert>
      )}

      {loginError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      <GoogleSignInButton isLoading={isLoading} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-800 px-2 text-muted-foreground">Or continue with email</span>
        </div>
      </div>

      <EmailPasswordForm
        isSignUp={isSignUp}
        isLoading={isLoading}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <div className="text-center">
        <Button
          variant="link"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm"
          disabled={isLoading}
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </Button>
      </div>
    </Card>
  );
};

export default LoginForm;
