"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

export type AdminUser = {
  id: string;
  email: string | null;
  fullName?: string | null;
  phone?: string | null;
  role: string;
};

export const useAdmin = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      // First try the direct API approach to avoid RLS issues
      const response = await fetch("/api/check-admin");
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.isAdmin) {
          // If user is admin, try to get full profile
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

          if (profileError) {
            setError(profileError.message);
            return null;
          }

          if (profile) {
            const user: AdminUser = {
              id: profile.id,
              email: profile.email,
              fullName: profile.full_name,
              phone: profile.phone,
              role: profile.role,
            };
            setAdminUser(user);
            setIsAdmin(profile.role === "admin");
            setError(null);
            return user;
          }
        } else {
          // User is not admin, set accordingly
          setAdminUser(null);
          setIsAdmin(false);
          setError(null);
          return null;
        }
      }

      // Fallback: try direct query (might fail due to RLS)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) {
        setError(profileError.message);
        return null;
      }

      if (profile) {
        const user: AdminUser = {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          phone: profile.phone,
          role: profile.role,
        };
        setAdminUser(user);
        setIsAdmin(profile.role === "admin");
        setError(null);
        return user;
      }

      return null;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setAdminUser(null);
          setIsAdmin(false);
          setError(null);
        }
      } catch (error) {
        setAdminUser(null);
        setIsAdmin(false);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setAdminUser(null);
          setIsAdmin(false);
          setError(null);
        }
      }
    );

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { adminUser, isAdmin, loading, error };
};
