import { LLMID, OpenRouterLLM } from "@/types/llms";
import { toast } from "sonner";

export const fetchOpenRouterModels = async () => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models");

    if (!response.ok) {
      throw new Error(`OpenRouter server is not responding.`);
    }

    const { data } = await response.json();

    const openRouterModels = data.map(
      (model: {
        id: string;
        name: string;
        context_length: number;
      }): OpenRouterLLM => ({
        modelId: model.id as LLMID,
        modelName: model.id,
        provider: "openrouter",
        hostedId: model.name,
        platformLink: "https://openrouter.dev",
        imageInput: false,
        maxContext: model.context_length,
      })
    );

    return openRouterModels;
  } catch (error) {
    console.error("Error fetching Open Router models: " + error);
    toast.error("Error fetching Open Router models: " + error);
  }
};
