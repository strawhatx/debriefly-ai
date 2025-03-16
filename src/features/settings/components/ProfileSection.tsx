
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AvatarUpload } from "./AvatarUpload";
import { ProfilePasswordDialog } from "./ProfilePasswordDialog";

interface Profile {
  id:string;
  full_name: string;
  username: string;
  avatar_url: string;
}

export const ProfileSection = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  const handleProfileUpdate = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          username: profile.username,
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-1">
        <Card className="p-6">
          <AvatarUpload profile={profile} setProfile={setProfile} />
        </Card>
      </div>

      <div className="col-span-2">
        <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Personal Details</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">Full Name</Label>
              <Input
                className="border-gray-600"
                value={profile?.full_name || ""}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Username</Label>
              <Input
                type="text"
                className="border-gray-600"
                value={profile?.username || ""}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm  mb-2">
                Password
              </label>
              <ProfilePasswordDialog />
            </div>
            <Button onClick={handleProfileUpdate}>Save Changes</Button>
          </div>
        </Card>
      </div>
    </div>

  );
};
