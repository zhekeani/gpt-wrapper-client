import { OpenRouterLLM } from "@/types/llms";
import { SetState } from "@/types/store";
import { create } from "zustand";

interface ModelsState {
  availableOpenRouterModels: OpenRouterLLM[];
  setAvailableOpenRouterModels: (models: SetState<OpenRouterLLM[]>) => void;
}

export const useModelsStore = create<ModelsState>((set) => ({
  availableOpenRouterModels: [],
  setAvailableOpenRouterModels: (models) =>
    set((prev) => ({
      availableOpenRouterModels:
        typeof models === "function"
          ? models(prev.availableOpenRouterModels)
          : models,
    })),
}));
