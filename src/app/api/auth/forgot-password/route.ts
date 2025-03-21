import { buildUrl } from "@/lib/resend/build-url";
import { sendMagicLink } from "@/lib/resend/send-magic-link";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  const safeEmailString = encodeURIComponent(email);

  const supabaseAdmin = getSupabaseAdminClient();

  const { data: emails, error } = await supabaseAdmin
    .from("profiles")
    .select("email")
    .eq("email", email);
  if (error || !emails) {
    return NextResponse.redirect(
      buildUrl(
        `/forgot-password?error=${error.message}&email=${safeEmailString}`,
        request
      ),
      302
    );
  }

  if (emails.length === 0) {
    return NextResponse.redirect(
      buildUrl(
        `/forgot-password?error=${"no account associated with provided email"}&email=${safeEmailString}`,
        request
      ),
      302
    );
  }

  await sendMagicLink(email, request, "recovery", "/api/auth/verify");
  return NextResponse.redirect(
    buildUrl(
      `/forgot-password?email=${safeEmailString}&reset-state=success`,
      request
    ),
    302
  );
}
