import { SetState } from "@/types/store";
import { Tables } from "@/types/supabase.types";
import { create } from "zustand";

interface ProfileState {
  profile: Tables<"profiles"> | null;
  setProfile: (profile: SetState<Tables<"profiles"> | null>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setProfile: (profile) =>
    set((prev) => ({
      profile: typeof profile === "function" ? profile(prev.profile) : profile,
    })),
}));
