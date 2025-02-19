
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import { AccountSelect } from "@/components/import/AccountSelect";

export const ProfilePasswordDialog = () => {
  const { toast } = useToast();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordOpen(false);
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    }
  };


  return (
    <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-primary hover:text-emerald-300 text-sm font-medium">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Current Password</Label>
            <Input 
              type="password" 
              className="border-gray-600"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password" 
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">New Password</Label>
            <Input 
              type="password" 
              className="border-gray-600"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password" 
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Confirm New Password</Label>
            <Input 
              type="password" 
              className="border-gray-600"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password" 
            />
          </div>
          <Button onClick={handlePasswordUpdate}>Update Password</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
