import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AvatarUpload } from "./AvatarUpload";
import { ProfilePasswordDialog } from "./ProfilePasswordDialog";
import { useProfileSection } from "../hooks/use-profile-section";

export const ProfileSection = () => {
  const { profile, isLoading, error, isDirty, updateProfileField, handleProfileUpdate }
    = useProfileSection(); // No need to pass userId anymore

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div>Error loading profile. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-1">
        <Card className="p-6">
          <AvatarUpload
            profile={profile}
            setProfile={(newProfile) => {
              updateProfileField('avatar_url', newProfile.avatar_url);
            }}
          />
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
                onChange={(e) => updateProfileField('full_name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Username</Label>
              <Input
                type="text"
                className="border-gray-600"
                value={profile?.username || ""}
                onChange={(e) => updateProfileField('username', e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <Label className="block text-sm mb-2">
                Password
              </Label>
              <ProfilePasswordDialog />
            </div>

            <Button
              onClick={handleProfileUpdate}
              disabled={!isDirty}
              className="w-full"
            >
              {isDirty ? 'Save Changes' : 'No Changes'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
