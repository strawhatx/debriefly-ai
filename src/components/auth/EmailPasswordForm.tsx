
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EmailPasswordFormProps {
  isSignUp: boolean;
  isLoading: boolean;
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  setFormData: (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const EmailPasswordForm = ({
  isSignUp,
  isLoading,
  formData,
  setFormData,
  onSubmit,
}: EmailPasswordFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <Input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
    </div>
    <div className="space-y-2">
      <Input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
    </div>
    {isSignUp && (
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          required
        />
      </div>
    )}
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
    </Button>
  </form>
);

export default EmailPasswordForm;
