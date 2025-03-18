import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { TablesInsert, TablesUpdate } from "@/types/supabase.types";

const supabase = getSupabaseBrowserClient();

export const getPresetByIdOnClient = async (presetId: string) => {
  const { data: preset, error } = await supabase
    .from("presets")
    .select("*")
    .eq("id", presetId)
    .single();

  if (!preset) {
    throw new Error(error.message);
  }

  return preset;
};

export const getPresetsByUserIdOnClient = async (userId: string) => {
  const { data: presets, error } = await supabase
    .from("presets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || presets === null) {
    throw new Error(error.message);
  }

  return presets;
};

export const getPresetByPresetIdOnClient = async (presetId: string) => {
  const { data: preset, error } = await supabase
    .from("presets")
    .select(`id, name`)
    .eq("id", presetId)
    .single();

  if (!preset) {
    throw new Error(error.message);
  }

  return preset;
};

export const createPresetOnClient = async (preset: TablesInsert<"presets">) => {
  const { data: createdPreset, error } = await supabase
    .from("presets")
    .insert([preset])
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return createdPreset;
};

export const createPresetsOnClient = async (
  presets: TablesInsert<"presets">[]
) => {
  const { data: createdPresets, error } = await supabase
    .from("presets")
    .insert(presets)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return createdPresets;
};

export const updatePresetOnClient = async (
  presetId: string,
  preset: TablesUpdate<"presets">
) => {
  const { data: updatedPreset, error } = await supabase
    .from("presets")
    .update(preset)
    .eq("id", presetId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return updatedPreset;
};

export const deletePresetOnClient = async (presetId: string) => {
  const { error } = await supabase.from("presets").delete().eq("id", presetId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};
