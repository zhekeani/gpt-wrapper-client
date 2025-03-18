import { buildUrl } from "@/lib/resend/build-url";
import { getSupabaseCookiesUtilClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await getSupabaseCookiesUtilClient();
  const user = (await supabase.auth.getUser()).data.user;

  const safeEmailString = encodeURIComponent(email);

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
      `/login?message=${profileError.message}&email=${safeEmailString}`
    );
  }

  if (profileData && !profileData.has_onboarded) {
    return NextResponse.redirect(`/setup`);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.redirect(
      `/login?message=${error.message}&email=${safeEmailString}`
    );
  }

  return NextResponse.redirect("/chat");
}
