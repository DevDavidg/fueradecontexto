import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST() {
  try {
    const email = "gael@admin.com";
    const password = "Admin123!";

    // Create auth user
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { fullName: "Gael Admin", role: "admin" },
      });
    if (userError) throw userError;

    const user = userData.user;
    if (!user) throw new Error("User creation failed");

    // Upsert profile with admin role
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        { id: user.id, email, full_name: "Gael Admin", role: "admin" },
        { onConflict: "id" }
      );
    if (profileError) throw profileError;

    return NextResponse.json({ ok: true, userId: user.id }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: `${err}` }, { status: 500 });
  }
}
