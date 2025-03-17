import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export const getProfileByUserId = async (userId: string) => {
  const supabase = getSupabaseBrowserClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!profile) {
    throw new Error(error.message);
  }

  return profile;
};
