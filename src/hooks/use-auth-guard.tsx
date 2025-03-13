import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAuthGuard = () => {
    const navigate = useNavigate();

    // Encapsulated auth check function
    const checkAuth = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) navigate("/login");
    }, [navigate]);

    useEffect(() => {
        checkAuth(); // Run auth check on mount

        // Subscribe to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") navigate("/login");
        });

        return () => subscription.unsubscribe(); // Cleanup on unmount
    }, [checkAuth, navigate]);
};
