import { getActiveUserProfileOnServer } from "@/lib/db/chats-server";
import { checkApiKey } from "@/lib/db/profile";
import { ChatSettings } from "@/types/chat";
import { ChatMessage } from "gpt-tokenizer/GptEncoding";
import { ServerRuntime } from "next";
import { OpenAI } from "openai";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";

export const runtime: ServerRuntime = "edge";

export async function POST(request: Request) {
  const json = await request.json();
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings;
    messages: ChatMessage[];
  };

  try {
    const profile = await getActiveUserProfileOnServer();

    checkApiKey(profile.openrouter_api_key, "OpenRouter");

    const openai = new OpenAI({
      apiKey: profile.openrouter_api_key || "",
      baseURL: "https://openrouter.ai/api/v1",
    });

    const response = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      temperature: chatSettings.temperature,
      max_tokens: undefined,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const part of response) {
            const content = part.choices[0]?.delta?.content || "";
            controller.enqueue(new TextEncoder().encode(content));
          }
        } catch (error) {
          console.error("Error forwarding stream:", error);
          controller.close();
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred";
    const errorCode = error.status || 500;

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenRouter API Key not found. Please set it in your profile settings.";
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
