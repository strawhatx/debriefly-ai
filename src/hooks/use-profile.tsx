import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar: string | null;
  avatar_backup: string;
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

        if (error || !user) throw error || new Error("User not found");

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        const fullName = data?.full_name?.trim() || "";
        const email = user.email || "";

        // Avatar fallback logic
        let avatarBackup = "";

        if (fullName) {
          const parts = fullName.split(" ").filter(Boolean);
          const firstInitial = parts[0]?.[0]?.toUpperCase() || "";
          const lastInitial = parts.length > 1 ? parts[parts.length - 1][0]?.toUpperCase() : "";
          avatarBackup = `${firstInitial}${lastInitial}` || "";
        }

        // Fallback to first 2 characters of email if full name isn't usable
        if (!avatarBackup && email) {
          avatarBackup = email.slice(0, 2).toUpperCase();
        }

        setProfile({
          id: user.id,
          email,
          full_name: fullName || "Unknown User",
          avatar: data?.avatar_url || null,
          avatar_backup: avatarBackup || "NA",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading };
};
