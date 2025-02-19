
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PowerCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";


export const SignOutButton = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
    
      if (error) throw error;

      navigate('/login'); // Redirect to login page or home page
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Sign out error: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      className="border-gray-600"
      onClick={handleSignOut}
    >
   <PowerCircle className="text-primary" />
      Sign Out
    </Button>
  );
};
