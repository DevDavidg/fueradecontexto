import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {
            // No-op for server-side
          },
          remove() {
            // No-op for server-side
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({
        isAdmin: false,
        authenticated: false,
        message: "No session found",
      });
    }

    // Use a direct query to avoid RLS issues
    // We'll use the service role key for this check
    const serviceSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get() {
            return undefined;
          },
          set() {},
          remove() {},
        },
      }
    );

    const { data: profile, error } = await serviceSupabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error) {
      return NextResponse.json({
        isAdmin: false,
        authenticated: true,
        error: error.message,
      });
    }

    return NextResponse.json({
      isAdmin: profile?.role === "admin",
      authenticated: true,
      role: profile?.role,
    });
  } catch (error) {
    return NextResponse.json(
      {
        isAdmin: false,
        authenticated: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
