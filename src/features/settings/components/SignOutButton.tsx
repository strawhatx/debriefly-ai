import { Button } from "@/components/ui/button";
import { PowerCircle } from "lucide-react";
import { useSignout } from "../../authentication/hooks/use-signout"; // Import the custom hook

export const SignOutButton = () => {
  const { signOut, loading } = useSignout();

  return (
    <Button
      type="button"
      variant="outline"
      className="border-gray-600"
      onClick={signOut}
      disabled={loading} // Disable button while signing out
    >
      {loading ? (
        <span>Signing out...</span> // Show loading text or icon
      ) : (
        <>
          <PowerCircle className="text-primary" />
          Sign Out
        </>
      )}
    </Button>
  );
};
