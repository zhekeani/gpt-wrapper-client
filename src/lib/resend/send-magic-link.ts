import { EmailOtpType, GenerateLinkParams } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { ReactNode } from "react";
import { getSupabaseAdminClient } from "../supabase/admin";
import { buildUrl } from "./build-url";
import { contentMap } from "./data/magic-lin-contents";
import MagicLinkTemplate from "./email-template/MagicLinkTemplate";
import resend from "./email-template/resend-client";

export async function sendMagicLink(
  email: string,
  request: NextRequest,
  type: EmailOtpType,
  verificationPath: string
): Promise<boolean> {
  const supabaseAdmin = getSupabaseAdminClient();
  if (!supabaseAdmin) return false;

  try {
    const { data: linkData, error } =
      await supabaseAdmin.auth.admin.generateLink({
        email,
        type,
      } as GenerateLinkParams);

    if (error) {
      console.error("Supabase generateLink error:", error);
      return false;
    }

    const { hashed_token } = linkData.properties;
    const constructedLink = buildUrl(
      `${verificationPath}?hashed_token=${hashed_token}&type=${type}`,
      request
    );

    const emailHtml = MagicLinkTemplate({
      magicLink: constructedLink,
      type,
    }) as ReactNode;

    const { error: sendError } = await resend.emails.send({
      from: "noreply@unfoldspace.cc",
      to: [email],
      subject: contentMap[type].subject,
      react: emailHtml,
    });

    return !sendError;
  } catch (err) {
    console.error("Unexpected error in sendOTPLink:", err);
    return false;
  }
}
