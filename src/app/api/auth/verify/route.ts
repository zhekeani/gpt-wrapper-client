import { buildUrl } from "@/lib/resend/build-url";
import { getSupabaseCookiesUtilClient } from "@/lib/supabase/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hashed_token = searchParams.get("hashed_token");
  const type = searchParams.get("type") as EmailOtpType;

  const cookieStore = await cookies();

  if (!hashed_token || !type) {
    return NextResponse.redirect(
      buildUrl("/global-error?type=invalid_request", request)
    );
  }

  const supabase = await getSupabaseCookiesUtilClient();
  if (!supabase) {
    return NextResponse.redirect(
      buildUrl("/global-error?type=server_error", request)
    );
  }

  const { data, error } = await supabase.auth.verifyOtp({
    type,
    token_hash: hashed_token,
  });

  if (error || !data || (type === "recovery" && !data.user)) {
    return NextResponse.redirect(
      buildUrl("/global-error?type=invalid_magiclink", request)
    );
  }

  const safeEmailString = encodeURIComponent(data.user!.email!);

  const redirectMap: Record<EmailOtpType, string> = {
    signup: "/setup",
    recovery: `/reset-password?email=${safeEmailString}`,
    email: "#",
    invite: "#",
    magiclink: "#",
    email_change: "#",
  };

  if (type === "recovery") {
    await supabase.auth.signOut();

    cookieStore.set({
      name: "reset_password_token",
      value: "valid",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/reset-password",
      maxAge: 1800,
      sameSite: "strict",
    });
  }

  const redirectPath = redirectMap[type];

  return NextResponse.redirect(buildUrl(redirectPath, request));
}
