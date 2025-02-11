
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AvatarUpload } from "./AvatarUpload";

interface ProfileSectionProps {
  profile: any;
  setProfile: (profile: any) => void;
}

export const ProfileSection = ({ profile, setProfile }: ProfileSectionProps) => {
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
    <Card className="p-6">
      <div className="space-y-8">
        <AvatarUpload profile={profile} setProfile={setProfile} />
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Full Name</Label>
            <Input 
              value={profile?.full_name || ""} 
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              placeholder="Enter your full name" 
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Username</Label>
            <Input 
              value={profile?.username || ""} 
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              placeholder="Enter your username" 
            />
          </div>
          <Button onClick={handleProfileUpdate}>Save Changes</Button>
        </div>
      </div>
    </Card>
  );
};
