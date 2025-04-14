import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar: string | null;
  avatar_backup: string | null;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user?.id)
          .single();

        if (profileError) throw profileError;

        // Generate avatar backup initials from full_name
        const fullName = data?.full_name || "";
        const initials = fullName
          .split(" ")
          .map((name) => name[0]?.toUpperCase())
          .join("")
          .slice(0, 2); // Get the first two initials

        setProfile({
          id: user.id,
          email: user.email,
          full_name: fullName || null,
          avatar: data?.avatar_url || null,
          avatar_backup: initials || null,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading };
};