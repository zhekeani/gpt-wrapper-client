"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseCookiesUtilClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/action";
import { Tables, TablesUpdate } from "@/types/supabase.types";
// import { delay } from "../delay";

export const getProfileByUserIdOnServer = async (
  userId: string
): Promise<ActionResponse<Tables<"profiles">>> => {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !profile) {
    return { success: false, error: error?.message ?? "Profile not found" };
  }

  return { success: true, data: profile };
};

export const getProfilesByUserIdOnServer = async (
  userId: string
): Promise<ActionResponse<Tables<"profiles">[]>> => {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId);

  if (error || !profiles) {
    return { success: false, error: error?.message ?? "Profiles not found" };
  }

  return { success: true, data: profiles };
};

export const createProfileOnServer = async (
  profile: Tables<"profiles">
): Promise<ActionResponse<Tables<"profiles">>> => {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: createdProfile, error } = await supabase
    .from("profiles")
    .insert([profile])
    .select("*")
    .single();

  if (error || !createdProfile) {
    return {
      success: false,
      error: error?.message ?? "Failed to create profile",
    };
  }

  return { success: true, data: createdProfile };
};

export const updateProfileOnServer = async (
  profileId: string,
  profile: TablesUpdate<"profiles">
): Promise<ActionResponse<TablesUpdate<"profiles">>> => {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", profileId)
    .select("*")
    .single();

  if (error || !updatedProfile) {
    return {
      success: false,
      error: error?.message ?? "Failed to update profile",
    };
  }

  return { success: true, data: updatedProfile };
};

export const updateProfileAndAvatarOnServer = async (
  profileId: string,
  userId: string,
  profile: TablesUpdate<"profiles">,
  imageFile?: File
): Promise<ActionResponse<TablesUpdate<"profiles">>> => {
  // await delay(3000);

  const supabase = await getSupabaseCookiesUtilClient();
  const supabaseAdmin = getSupabaseAdminClient();

  const { username } = profile;
  const bucketName = "profile_images";

  if (username) {
    const { data: usernames, error } = await supabaseAdmin
      .from("profiles")
      .select("username")
      .eq("username", username);

    if (error || !usernames) {
      return {
        success: false,
        error: "Failed to check username availability.",
      };
    }
    if (usernames.length > 0) {
      return {
        success: false,
        error: "Username is used.",
      };
    }
  }

  let avatarUrl: string | null = null;
  let uploadedFilePath: string | null = null;

  if (imageFile) {
    const filePath = `${userId}/${imageFile.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, imageFile, { upsert: true });

    if (uploadError || !uploadData.fullPath) {
      console.error(uploadError);
      return { success: false, error: "Failed to upload profile picture." };
    }

    uploadedFilePath = filePath;
    avatarUrl = supabase.storage.from(bucketName).getPublicUrl(filePath)
      .data.publicUrl;
  }

  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update({
      ...profile,
      ...(avatarUrl && uploadedFilePath
        ? { image_url: avatarUrl, image_path: uploadedFilePath }
        : {}),
      ...(!!!profile.image_url ? { image_url: "", image_path: "" } : {}),
    })
    .eq("id", profileId)
    .select("*")
    .single();

  if (error || !updatedProfile) {
    if (uploadedFilePath) {
      await supabase.storage.from(bucketName).remove([uploadedFilePath]);
    }

    return {
      success: false,
      error: error?.message ?? "Failed to update profile",
    };
  }

  return { success: true, data: updatedProfile };
};

export const deleteProfileOnServer = async (
  profileId: string
): Promise<ActionResponse<null>> => {
  const supabase = await getSupabaseCookiesUtilClient();
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", profileId);

  if (error) {
    return {
      success: false,
      error: error.message ?? "Failed to delete profile",
    };
  }

  return { success: true, data: null };
};
