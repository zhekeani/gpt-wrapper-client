import { buildUrl } from "@/lib/resend/build-url";
import { getSupabaseCookiesUtilClient } from "@/lib/supabase/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hashed_token = searchParams.get("hashed_token");
  const type = searchParams.get("type") as EmailOtpType;

  if (!hashed_token || !type) {
    return NextResponse.redirect(
      buildUrl("/error?type=invalid_request", request)
    );
  }

  const supabase = await getSupabaseCookiesUtilClient();
  if (!supabase) {
    return NextResponse.redirect(buildUrl("/error?type=server_error", request));
  }

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: hashed_token,
  });

  if (error) {
    return NextResponse.redirect(
      buildUrl("/error?type=invalid_magiclink", request)
    );
  }

  return NextResponse.redirect(buildUrl("/setup", request));
}
