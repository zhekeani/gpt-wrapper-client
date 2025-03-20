"use server";

import { getSupabaseCookiesUtilClient } from "@/lib/supabase/server";
import { TablesInsert, TablesUpdate } from "@/types/supabase.types";

export const getProfileByUserIdOnServer = async (userId: string) => {
  const supabase = await getSupabaseCookiesUtilClient();
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

export const getProfilesByUserIdOnServer = async (userId: string) => {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId);

  if (!profiles) {
    throw new Error(error.message);
  }

  return profiles;
};

export const createProfileOnServer = async (
  profile: TablesInsert<"profiles">
) => {
  const supabase = await getSupabaseCookiesUtilClient();
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

export const updateProfileOnServer = async (
  profileId: string,
  profile: TablesUpdate<"profiles">
) => {
  const supabase = await getSupabaseCookiesUtilClient();
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

export const deleteProfileOnServer = async (profileId: string) => {
  const supabase = await getSupabaseCookiesUtilClient();
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", profileId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};
