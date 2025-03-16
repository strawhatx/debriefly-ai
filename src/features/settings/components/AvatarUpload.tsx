
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit } from "lucide-react";

interface AvatarUploadProps {
  profile: any;
  setProfile: (profile: any) => void;
}

export const AvatarUpload = ({ profile, setProfile }: AvatarUploadProps) => {
  const { toast } = useToast();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploadingAvatar(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

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
