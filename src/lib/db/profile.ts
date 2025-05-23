import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { TablesInsert, TablesUpdate } from "@/types/supabase.types";

const supabase = getSupabaseBrowserClient();

export function checkApiKey(apiKey: string | null, keyName: string) {
  if (apiKey === null || apiKey === "") {
    throw new Error(`${keyName} API Key not found`);
  }
}

export const getProfileByUserIdOnClient = async (userId: string) => {
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

export const getProfilesByUserIdOnClient = async (userId: string) => {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId);

  if (!profiles) {
    throw new Error(error.message);
  }

  return profiles;
};

export const createProfileOnClient = async (
  profile: TablesInsert<"profiles">
) => {
  const { data: createdProfile, error } = await supabase
    .from("profiles")
    .insert([profile])
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return createdProfile;
};

export const updateProfileOnClient = async (
  profileId: string,
  profile: TablesUpdate<"profiles">
) => {
  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", profileId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return updatedProfile;
};

export const deleteProfileOnClient = async (profileId: string) => {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", profileId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};
