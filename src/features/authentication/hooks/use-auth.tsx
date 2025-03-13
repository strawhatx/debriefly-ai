import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { usePayment } from "@/hooks/use-payment";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createStripeCustomer } = usePayment();

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      toast({ title: "Welcome back", description: "You have been logged in successfully" });
      navigate("/app/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      await signIn(email, password);

      const { data, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      await createStripeCustomer(data.user.id, data.user.email);

      toast({ title: "Success", description: "Account created successfully" });
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return { signIn, signUp, isLoading, error };
};
