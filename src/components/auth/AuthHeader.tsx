
interface AuthHeaderProps {
  isSignUp: boolean;
}

const AuthHeader = ({ isSignUp }: AuthHeaderProps) => (
  <div className="space-y-2 text-center">
    <img 
      src="/og-image.png" 
      alt="Logo" 
      className="h-12 mx-auto mb-4"
    />
    <h2 className="text-2xl font-bold">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
    <p className="text-muted-foreground">
      {isSignUp
        ? "Enter your details to create your account"
        : "Enter your credentials to access your account"}
    </p>
  </div>
);

export default AuthHeader;
