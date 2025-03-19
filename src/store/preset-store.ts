import { SetState } from "@/types/store";
import { Tables } from "@/types/supabase.types";
import { create } from "zustand";

interface PresetState {
  selectedPreset: Tables<"presets"> | null;
  setSelectedPreset: (preset: SetState<Tables<"presets"> | null>) => void;
}

export const usePresetStore = create<PresetState>((set) => ({
  selectedPreset: null,
  setSelectedPreset: (preset) =>
    set((prev) => ({
      selectedPreset:
        typeof preset === "function" ? preset(prev.selectedPreset) : preset,
    })),
}));
