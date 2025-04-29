import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef } from "react";

// Define proper types
interface Profile {
    id:string;
    full_name: string;
    username: string;
    avatar_url: string;
}

const ALLOWED_FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const useAvatarUpload = (
  profile: Profile,
  setProfile: (profile: Profile) => void
) => {
    const { toast } = useToast();
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        
        if (!fileExt || !ALLOWED_FILE_TYPES.includes(fileExt)) {
            return `File type not supported. Please use: ${ALLOWED_FILE_TYPES.join(', ')}`;
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'File size must be less than 5MB';
        }
        return null;
    };

    const generateFileName = (fileExt: string): string => {
        const timestamp = new Date().getTime();
        return `${profile.id}-${timestamp}.${fileExt}`;
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            const validationError = validateFile(file);
            if (validationError) {
                toast({
                    title: "Invalid File",
                    description: validationError,
                    variant: "destructive",
                });
                return;
            }

            setUploadingAvatar(true);

            // Delete old avatar if exists
            if (profile.avatar_url) {
                const oldFileName = profile.avatar_url.split('/').pop();
                await supabase.storage
                    .from('avatars')
                    .remove([oldFileName]);
            }

            const fileExt = file.name.split('.').pop()!.toLowerCase();
            const fileName = generateFileName(fileExt);

            // Upload new avatar
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', profile.id)
                .single();

            if (updateError) throw updateError;

            setProfile({ ...profile, avatar_url: publicUrl });

            toast({
                variant:"success",
                title: "Success",
                description: "Avatar updated successfully",
            });
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to upload avatar",
                variant: "destructive",
            });
        } finally {
            setUploadingAvatar(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';  // Reset file input
            }
        }
    };

    return {
        handleAvatarUpload,
        uploadingAvatar,
        fileInputRef
    };
};