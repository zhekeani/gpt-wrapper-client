import { buildUrl } from "@/lib/resend/build-url";
import { getSupabaseCookiesUtilClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const safeEmailString = encodeURIComponent(email);

  const supabase = await getSupabaseCookiesUtilClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.redirect(
      `/login?message=${error.message}&email=${safeEmailString}`
    );
  }

  const user = data.user;

  if (!user || !user.confirmed_at) {
    return NextResponse.redirect(
      buildUrl(`/resend-verification?email=${safeEmailString}`, request),
      302
    );
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("has_onboarded")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    return NextResponse.redirect(
      buildUrl(
        `/login?message=${profileError.message}&email=${safeEmailString}`,
        request
      )
    );
  }

  if (profileData && !profileData.has_onboarded) {
    return NextResponse.redirect(buildUrl(`/setup`, request));
  }

  return NextResponse.redirect(buildUrl("/chat", request));
}
