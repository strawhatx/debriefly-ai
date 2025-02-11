
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SecuritySection = () => {
  const { toast } = useToast();
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
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Change Password</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Current Password</Label>
            <Input 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password" 
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">New Password</Label>
            <Input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password" 
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Confirm New Password</Label>
            <Input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password" 
            />
          </div>
          <Button onClick={handlePasswordUpdate}>Update Password</Button>
        </div>
      </div>
    </Card>
  );
};
