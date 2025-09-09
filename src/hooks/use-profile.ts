"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useSupabaseUser } from "@/hooks/use-supabase-user";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
};

export const useProfile = () => {
  const { user } = useSupabaseUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setProfile(null);
        return;
      }
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, phone, role")
        .eq("id", user.id)
        .maybeSingle();
      setLoading(false);
      if (error) {
        setError(error.message);
        setProfile(null);
        return;
      }
      setProfile(data as Profile);
    };
    load();
  }, [user]);

  return { profile, loading, error };
};
