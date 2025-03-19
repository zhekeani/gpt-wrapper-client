import { SetState } from "@/types/store";
import { Tables } from "@/types/supabase.types";
import { create } from "zustand";

interface ItemsState {
  chats: Tables<"chats">[];
  setChats: (chats: SetState<Tables<"chats">[]>) => void;
  presets: Tables<"presets">[];
  setPresets: (presets: SetState<Tables<"presets">[]>) => void;
}

export const useItemsStore = create<ItemsState>((set) => ({
  chats: [],
  setChats: (chats) =>
    set((prev) => ({
      chats: typeof chats === "function" ? chats(prev.chats) : chats,
    })),
  presets: [],
  setPresets: (presets) =>
    set((prev) => ({
      presets: typeof presets === "function" ? presets(prev.presets) : presets,
    })),
}));
