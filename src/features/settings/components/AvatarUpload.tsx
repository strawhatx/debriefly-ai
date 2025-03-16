import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit } from "lucide-react";
import { useAvatarUpload } from "../hooks/use-avatar-upload";

interface Profile {
  id:string;
  full_name: string;
  username: string;
  avatar_url: string;
}

interface AvatarUploadProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

export const AvatarUpload = ({ profile, setProfile }: AvatarUploadProps) => {
  const { handleAvatarUpload, uploadingAvatar, fileInputRef } = useAvatarUpload(profile, setProfile);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <Avatar className="relative h-32 w-32 mx-auto mb-2">
          <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
          <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar> 
        <button
          className="absolute bottom-3 right-3 p-2 bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingAvatar}
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>

      <div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleAvatarUpload}
        />
        <Button
          variant="link"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingAvatar}
        >
          {uploadingAvatar ? "Uploading..." : "Change Avatar"}
        </Button>
      </div>
    </div>
  );
};
