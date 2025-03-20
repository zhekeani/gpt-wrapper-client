import {
  generateDisplayName,
  generateUniqueUsername,
  sanitizeUsername,
} from "@/lib/auth/generate-fields";
import { buildUrl } from "@/lib/resend/build-url";
import { sendMagicLink } from "@/lib/resend/send-magic-link";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isNotEmptyString = (value: any) => {
    return typeof value === "string" && value.trim().length > 0;
  };

  const emailRegex = /^\S+@\S+$/;
  const safeEmailString = email ? encodeURIComponent(email) : "";

  if (!isNotEmptyString(email) || !email || !emailRegex.test(email)) {
    return NextResponse.redirect(
      buildUrl(
        `/signup?error=${encodeURIComponent(
          "Invalid email address"
        )}&email=${safeEmailString}`,
        request
      ),
      302
    );
  }

  const emailPrefix = email.split("@")[0];
  const sanitizedUsername = sanitizeUsername(emailPrefix);

  const supabaseAdmin = getSupabaseAdminClient();

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
    });

  if (userError) {
    const userExists = userError.message.includes("already been registered");
    const errorMsg = userExists
      ? "Email already exists"
      : `Registration error: ${userError.message}`;

    return NextResponse.redirect(
      buildUrl(`/signup?error=${errorMsg}&email=${safeEmailString}`, request),
      302
    );
  }

  const uniqueUsername = await generateUniqueUsername(
    sanitizedUsername,
    supabaseAdmin
  );
  const displayName = generateDisplayName(sanitizedUsername);

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .insert({
      user_id: userData.user.id,
      bio: "",
      has_onboarded: false,
      image_url: "",
      image_path: "",
      profile_context: "",
      display_name: displayName,
      username: uniqueUsername,
      openrouter_api_key: "",
    })
    .select("*")
    .single();

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
    return NextResponse.redirect(
      buildUrl(
        `/signup?error=${"Server error: unable to create user profile"}&email=${safeEmailString}`,
        request
      ),
      302
    );
  }

  await sendMagicLink(email, request, "signup", "/api/auth/verify");
  return NextResponse.redirect(
    buildUrl(`/signup?email=${safeEmailString}&signup-state=success`, request),
    302
  );
}
