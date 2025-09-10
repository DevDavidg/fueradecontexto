import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
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
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "No session found",
        },
        { status: 401 }
      );
    }

    // Check if user already has a profile
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (existingProfile) {
      // Update existing profile to admin
      const { data, error } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", session.user.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          {
            error: error.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Profile updated to admin",
        profile: data,
      });
    } else {
      // Create new profile with admin role
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: session.user.id,
          email: session.user.email || "",
          full_name: session.user.user_metadata?.full_name || null,
          phone: session.user.user_metadata?.phone || null,
          role: "admin",
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          {
            error: error.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Admin profile created",
        profile: data,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
