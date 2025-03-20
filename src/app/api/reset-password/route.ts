import { NextRequest, NextResponse } from "next/server";
import { buildUrl } from "../../../lib/resend/build-url";
import { getSupabaseAdminClient } from "../../../lib/supabase/admin";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isNotEmptyString = (value: any) => {
    return typeof value === "string" && value.trim().length > 0;
  };

  const emailRegex = /^\S+@\S+$/;
  const safeEmailString = email ? encodeURIComponent(email) : "";

  if (!isNotEmptyString(email) || !email || !emailRegex.test(email)) {
    return NextResponse.redirect(
      buildUrl(
        `/reset-password?error=${encodeURIComponent(
          "Invalid email address"
        )}&email=${safeEmailString}`,
        request
      ),
      302
    );
  }

  const supabaseAdmin = getSupabaseAdminClient();

  const {} = await supabaseAdmin.auth.admin.listUsers();
}
