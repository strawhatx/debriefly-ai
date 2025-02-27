
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
import { useStripeMethods } from "./settings/hooks/useStripeMethods";

const LoginForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCustomer } = useStripeMethods();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          return;
        }

        //CREATE ACCOUNT
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signUpError) throw signUpError;

        //SIGN IN
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;

        //CREATE STRIPE CUSTOMER
        const { data, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;

        await createCustomer(data.user.email, data.user.id);

        //SUCCESS
        toast({
          title: "Success",
          description: "Account created and logged in successfully",
        });

        navigate("/app/dashboard");
      }

      else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back",
          description: "You have been logged in successfully",
        });

        navigate("/app/dashboard");
      }
    } 
    
    catch (error: any) {
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

  return (
    <Card className="p-6 space-y-6 animate-fade-up bg-gray-800 border-gray-800">
      <AuthHeader isSignUp={isSignUp} />

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
