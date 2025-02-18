import { Brain } from 'lucide-react';

interface AuthHeaderProps {
  isSignUp: boolean;
}

const AuthHeader = ({ isSignUp }: AuthHeaderProps) => (
  <div className="space-y-2 text-center">
    <Brain className="mx-auto h-12 w-12 text-primary" />
    <h2 className="text-2xl font-bold">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
    <p className="text-muted-foreground">
      Master Your Trades—Optimize Both Mindset & Strategy
    </p>
  </div>
);

export default AuthHeader;
