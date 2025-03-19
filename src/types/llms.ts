import { ModelProvider } from "./models";

export type LLMID =
  | OpenAILLMID
  | GoogleLLMID
  | AnthropicLLMID
  | MistralLLMID
  | GroqLLMID
  | PerplexityLLMID;

// ✅ OpenAI Models (Updated March 2025)
export type OpenAILLMID =
  | "gpt-4o" // GPT-4 Omni
  | "gpt-4-turbo" // GPT-4 Turbo
  | "gpt-4-vision" // GPT-4 Vision
  | "gpt-4" // GPT-4
  | "gpt-3.5-turbo"; // GPT-3.5 Turbo

// ❌ OpenAI models are not free

// ✅ Google Models (Updated March 2025)
export type GoogleLLMID =
  | "gemini-2.0-pro" // Gemini 2.0 Pro
  | "gemini-2.0-flash" // Gemini 2.0 Flash
  | "gemini-1.5-pro" // Gemini 1.5 Pro
  | "gemini-1.5-flash"; // Gemini 1.5 Flash

// ❌ Google Gemini models require a subscription or usage-based access

// ✅ Anthropic Models (Updated March 2025)
export type AnthropicLLMID =
  | "claude-3.7-sonnet" // Claude 3.7 Sonnet (latest)
  | "claude-3.5-sonnet" // Claude 3.5 Sonnet
  | "claude-3-opus" // Claude 3 Opus
  | "claude-2.1"; // Claude 2.1

// ❌ Anthropic models are not free

// ✅ Mistral Models (Updated March 2025)
export type MistralLLMID =
  | "mistral-7b" // Mistral 7B ✅ (Free)
  | "mixtral-8x7b" // Mixtral 8x7B ✅ (Free)
  | "mixtral-8x22b"; // Mixtral 8x22B ✅ (Free)

// ✅ Free & Open-Source: Mistral models are open-weight and free to use

// ✅ Groq Models (Updated March 2025)
export type GroqLLMID =
  | "llama-3.3-70b-versatile" // LLaMA 3.3 70B
  | "llama-3.3-8b-versatile" // LLaMA 3.3 8B
  | "gemma-7b-it"; // Gemma-7B IT

// ❌ Groq models require API access

// ✅ Perplexity Models (Updated March 2025)
export type PerplexityLLMID =
  | "pplx-70b-chat" // Perplexity Chat 70B
  | "pplx-7b-chat" // Perplexity Chat 7B
  | "pplx-70b-online" // Perplexity Online 70B
  | "pplx-7b-online"; // Perplexity Online 7B

// ❌ Perplexity models require access via their API

export interface LLM {
  modelId: LLMID;
  modelName: string;
  provider: ModelProvider;
  hostedId: string;
  platformLink: string;
  imageInput: boolean;
  pricing?: {
    currency: string;
    unit: string;
    inputCost: number;
    outputCost?: number;
  };
}

export interface OpenRouterLLM extends LLM {
  maxContext: number;
}
