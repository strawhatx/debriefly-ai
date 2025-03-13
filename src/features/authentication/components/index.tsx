import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import GoogleSignInButton from "../components/GoogleSignInButton";
import AuthHeader from "../components/AuthHeader";
import EmailPasswordForm from "../components/EmailPasswordForm";
import { Separator } from "@/components/ui/separator";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, isLoading, error } = useAuth();

  // Now the onSubmit receives the formData from EmailPasswordForm
  const handleSubmit = async (_e: React.FormEvent, formData: { email: string; password: string; confirmPassword: string }) => {
    if (isSignUp) {
      await signUp(formData.email, formData.password, formData.confirmPassword);
    } else {
      await signIn(formData.email, formData.password);
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-gray-800 border-gray-800">
      <AuthHeader isSignUp={isSignUp} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <GoogleSignInButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-800 px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <EmailPasswordForm
        isSignUp={isSignUp}
        isLoading={isLoading}
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

export default AuthForm;
