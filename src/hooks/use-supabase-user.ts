"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

export type SupabaseUser = {
  id: string;
  email: string | null;
  fullName?: string | null;
  phone?: string | null;
};

export const useSupabaseUser = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!isMounted) return;
      setUser(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email ?? null,
              fullName: (session.user.user_metadata as any)?.fullName ?? null,
              phone: (session.user.user_metadata as any)?.phone ?? null,
            }
          : null
      );
      setLoading(false);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email ?? null,
              fullName: (session.user.user_metadata as any)?.fullName ?? null,
              phone: (session.user.user_metadata as any)?.phone ?? null,
            }
          : null
      );
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
