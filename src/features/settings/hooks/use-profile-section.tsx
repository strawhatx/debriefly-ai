import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useCallback, useEffect } from "react";

interface Profile {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
    updated_at?: string;
}

type ProfileUpdatePayload = Omit<Partial<Profile>, 'id' | 'updated_at'>;

interface ProfileState {
    data: Profile | null;
    isLoading: boolean;
    error: Error | null;
}

export const useProfileSection = () => {
    const { toast } = useToast();
    const [state, setState] = useState<ProfileState>({
        data: null,
        isLoading: true, // Start with loading true
        error: null,
    });
    const [isDirty, setIsDirty] = useState(false);

    const fetchProfile = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        try {
            // First get the current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            if (!user) throw new Error('No user found');

            // Then fetch their profile
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            setState(prev => ({
                ...prev,
                data,
                isLoading: false,
            }));
        } catch (error) {
            console.error('Error fetching profile:', error);
            setState(prev => ({
                ...prev,
                error: error as Error,
                isLoading: false,
            }));
            toast({
                title: "Error",
                description: "Failed to load profile",
                variant: "destructive",
            });
        }
    }, [toast]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfileField = useCallback(<K extends keyof ProfileUpdatePayload>(
        field: K,
        value: ProfileUpdatePayload[K]
    ) => {
        setState(prev => ({
            ...prev,
            data: prev.data ? { ...prev.data, [field]: value } : null,
        }));
        setIsDirty(true);
    }, []);

    const handleProfileUpdate = useCallback(async () => {
        if (!state.data?.id || !isDirty) return;

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const updatePayload: ProfileUpdatePayload = {
                full_name: state.data.full_name,
                username: state.data.username,
                avatar_url: state.data.avatar_url,
            };

            const { error } = await supabase
                .from('profiles')
                .update(updatePayload)
                .eq('id', state.data.id);

            if (error) throw error;

            toast({
                variant:"success",
                title: "Success",
                description: "Profile updated successfully",
            });
            setIsDirty(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setState(prev => ({
                ...prev,
                error: error as Error,
                isLoading: false,
            }));
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [state.data, isDirty, toast]);

    const resetProfile = useCallback(() => {
        fetchProfile();
        setIsDirty(false);
    }, [fetchProfile]);

    return {
        profile: state.data,
        isLoading: state.isLoading,
        error: state.error,
        isDirty,
        updateProfileField,
        handleProfileUpdate,
        resetProfile,
    };
};