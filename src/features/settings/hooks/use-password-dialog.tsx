import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useCallback } from "react";

interface PasswordState {
  current: string;
  new: string;
  confirm: string;
}

export const usePasswordDialog = () => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [passwords, setPasswords] = useState<PasswordState>({
        current: "",
        new: "",
        confirm: "",
    });

    const resetForm = useCallback(() => {
        setPasswords({
            current: "",
            new: "",
            confirm: "",
        });
    }, []);

    const validatePasswords = useCallback((): string | null => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            return "All password fields are required";
        }
        if (passwords.new.length < 8) {
            return "New password must be at least 8 characters long";
        }
        if (passwords.new !== passwords.confirm) {
            return "New passwords don't match";
        }
        return null;
    }, [passwords]);

    const handlePasswordUpdate = useCallback(async () => {
        const validationError = validatePasswords();
        if (validationError) {
            toast({
                title: "Validation Error",
                description: validationError,
                variant: "destructive",
            });
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.new
            });

            if (error) throw error;

            toast({
                variant:"success",
                title: "Success",
                description: "Password updated successfully",
            });

            resetForm();
            setIsOpen(false);
        } catch (error) {
            console.error('Error updating password:', error);
            toast({
                title: "Error",
                description: "Failed to update password. Please try again.",
                variant: "destructive",
            });
        }
    }, [passwords, toast, validatePasswords, resetForm]);

    const updatePassword = useCallback((field: keyof PasswordState, value: string) => {
        setPasswords(prev => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    return {
        handlePasswordUpdate,
        isOpen: isOpen,
        setIsOpen,
        passwords,
        updatePassword,
    };
};