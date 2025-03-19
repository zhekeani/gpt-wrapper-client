import { ChatPayload } from "@/types/chat";
import { Tables } from "@/types/supabase.types";
import { encode } from "gpt-tokenizer";

const buildBasePrompt = (
  prompt: string,
  profileContext: string
  // assistant
) => {
  let fullPrompt = "";

  // if (assistant) {
  //   fullPrompt += `<INJECT ROLE>\nYou are not an AI. You are ${assistant.name}.\n</INJECT ROLE>\n\n`
  // }

  fullPrompt += `Today is ${new Date().toLocaleDateString()}.\n\n`;

  if (profileContext) {
    fullPrompt += `User Info:\n${profileContext}\n\n`;
  }

  fullPrompt += `User Instructions:\n${prompt}`;

  return fullPrompt;
};

export function buildFinalMessages(
  payload: ChatPayload,
  profile: Tables<"profiles">
) {
  const { chatSettings, chatMessages } = payload;

  const BUILT_PROMPT = buildBasePrompt(
    chatSettings.prompt,
    chatSettings.includeProfileContext ? profile.profile_context || "" : ""
  );

  const CHUNK_SIZE = chatSettings.contextLength;
  const PROMPT_TOKENS = encode(chatSettings.prompt).length;

  let remainingTokens = CHUNK_SIZE - PROMPT_TOKENS;

  let usedTokens = 0;
  usedTokens += PROMPT_TOKENS;

  const processedChatMessages = chatMessages.map((chatMessage, index) => {
    const nextChatMessage = chatMessages[index + 1];

    if (nextChatMessage === undefined) {
      return chatMessage;
    }

    return chatMessage;
  });

  let finalMessages = [];

  for (let i = processedChatMessages.length - 1; i >= 0; i--) {
    const message = processedChatMessages[i].message;
    const messageTokens = encode(message.content).length;

    if (messageTokens <= remainingTokens) {
      remainingTokens -= messageTokens;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      usedTokens += messageTokens;
      finalMessages.unshift(message);
    } else {
      break;
    }
  }

  const tempSystemMessage: Tables<"messages"> = {
    chat_id: "",
    assistant_id: null,
    content: BUILT_PROMPT,
    created_at: "",
    id: processedChatMessages.length + "",
    model: payload.chatSettings.model,
    role: "system",
    sequence_number: processedChatMessages.length,
    updated_at: "",
    user_id: "",
  };

  finalMessages.unshift(tempSystemMessage);

  finalMessages = finalMessages.map((message) => {
    const content = message.content;

    return {
      role: message.role,
      content,
    };
  });

  return finalMessages;
}
