"use server";

import { getSupabaseCookiesUtilClient } from "../supabase/server";

export async function getActiveUserProfileOnServer() {
  const supabase = await getSupabaseCookiesUtilClient();

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    throw new Error("User not found");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !profile) {
    throw new Error("Profile not found");
  }

  return profile;
}
