import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEmailPasswordForm } from "../hooks/use-email-password-form";

interface EmailPasswordFormProps {
  isSignUp: boolean;
  isLoading: boolean;
  onSubmit: (
    e: React.FormEvent,
    formData: { email: string; password: string; confirmPassword: string }
  ) => Promise<void>;
}

const EmailPasswordForm = ({
  isSignUp,
  isLoading,
  onSubmit,
}: EmailPasswordFormProps) => {
  const { formData, setFormData, errors, validateForm } = useEmailPasswordForm(isSignUp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Pass the formData up to the parent via the onSubmit callback
      await onSubmit(e, formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          className="border-gray-600"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Password"
          className="border-gray-600"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
      </div>
      {isSignUp && (
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Confirm Password"
            className="border-gray-600"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
          {errors.confirmPassword && (
            <span className="text-sm text-red-500">{errors.confirmPassword}</span>
          )}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
      </Button>
    </form>
  );
};

export default EmailPasswordForm;
