import { buildUrl } from "@/lib/resend/build-url";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const newPassword = formData.get("password") as string;

  const safeEmailString = encodeURIComponent(email);

  const supabaseAdmin = getSupabaseAdminClient();

  const { data: userData, error: userError } = await supabaseAdmin
    .from("profiles")
    .select("user_id")
    .eq("email", email)
    .single();

  if (userError || !userData.user_id) {
    return NextResponse.redirect(
      buildUrl(
        `/reset-password?error=${userError?.message || "Unable to fetch associated user info"}&email=${safeEmailString}`,
        request
      ),
      302
    );
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userData.user_id,
    {
      password: newPassword,
    }
  );

  if (error || !data) {
    return NextResponse.redirect(
      buildUrl(
        `/reset-password?error=${error?.message || "Failed to update password"}&email=${safeEmailString}`,
        request
      ),
      302
    );
  }

  return NextResponse.redirect(
    buildUrl(
      `/reset-password?reset-state=success&email=${safeEmailString}`,
      request
    ),
    302
  );
}
