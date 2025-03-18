import { Database } from "@/types/supabase.types";
import { SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function generateUniqueUsername(
  baseUsername: string,
  supabaseAdmin: SupabaseClient<Database>
) {
  let finalUsername = baseUsername;
  let attempt = 0;

  const randomSuffix = () => {
    const words = ["neo", "fox", "blue", "wave", "sky", "zen", "dash"];
    return words[Math.floor(Math.random() * words.length)];
  };

  while (true) {
    const { data: existingUser } = await supabaseAdmin
      .from("profiles")
      .select("username")
      .eq("username", finalUsername)
      .single();

    if (!existingUser) return finalUsername;

    finalUsername = `${baseUsername}${randomSuffix()}${attempt % 10}`;
    attempt++;

    if (attempt > 20) {
      // Fallback to a hashed suffix if too many attempts
      const hash = crypto
        .createHash("md5")
        .update(baseUsername + Date.now())
        .digest("hex")
        .slice(0, 4);
      finalUsername = `${baseUsername}${hash}`;
      break;
    }
  }

  return finalUsername;
}

export function sanitizeUsername(emailPrefix: string): string {
  return emailPrefix.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

// Generate a sanitized name
export function generateDisplayName(username: string): string {
  return username
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
