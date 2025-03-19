import { SetState } from "@/types/store";
import { create } from "zustand";

interface ActiveChatState {
  isGenerating: boolean;
  setIsGenerating: (status: SetState<boolean>) => void;
  firstTokenReceived: boolean;
  setFirstTokenReceived: (status: SetState<boolean>) => void;
  abortController: AbortController | null;
  setAbortController: (controller: SetState<AbortController | null>) => void;
}

export const useActiveChatStore = create<ActiveChatState>((set) => ({
  isGenerating: false,
  setIsGenerating: (status) =>
    set((prev) => ({
      isGenerating:
        typeof status === "function" ? status(prev.isGenerating) : status,
    })),
  firstTokenReceived: false,
  setFirstTokenReceived: (status) =>
    set((prev) => ({
      firstTokenReceived:
        typeof status === "function" ? status(prev.firstTokenReceived) : status,
    })),
  abortController: null,
  setAbortController: (controller) =>
    set((prev) => ({
      abortController:
        typeof controller === "function"
          ? controller(prev.abortController)
          : controller,
    })),
}));
