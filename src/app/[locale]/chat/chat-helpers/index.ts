import { buildFinalMessages } from "@/lib/build-prompt";
import { consumeReadableStream } from "@/lib/consume-stream";
import { createChatOnClient } from "@/lib/db/chats";
import {
  createMessagesOnClient,
  updateMessageOnClient,
} from "@/lib/db/messages";
import { ChatPayload, ChatSettings } from "@/types/chat";
import { ChatMessage } from "@/types/chat-message";
import { LLM } from "@/types/llms";
import { Tables, TablesInsert } from "@/types/supabase.types";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export const validateChatSettings = (
  chatSettings: ChatSettings | null,
  modelData: LLM | undefined,
  profile: Tables<"profiles"> | null,
  messageContent: string
) => {
  if (!chatSettings) {
    throw new Error("Chat settings not found");
  }

  if (!modelData) {
    throw new Error("Model not found");
  }

  if (!profile) {
    throw new Error("Profile not found");
  }

  if (!messageContent) {
    throw new Error("Message content not found");
  }
};

export const createTempMessages = (
  messageContent: string,
  chatMessages: ChatMessage[],
  chatSettings: ChatSettings,
  isRegeneration: boolean,
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>
) => {
  const tempUserChatMessage: ChatMessage = {
    message: {
      chat_id: "",
      content: messageContent,
      created_at: "",
      id: uuidv4(),
      model: chatSettings.model,
      role: "user",
      sequence_number: chatMessages.length,
      updated_at: "",
      user_id: "",
      assistant_id: "",
    },
  };

  const tempAssistantChatMessage: ChatMessage = {
    message: {
      chat_id: "",
      content: "",
      created_at: "",
      id: uuidv4(),
      model: chatSettings.model,
      role: "assistant",
      sequence_number: chatMessages.length + 1,
      updated_at: "",
      user_id: "",
      assistant_id: "",
    },
  };

  let newMessages: ChatMessage[] = [];

  if (isRegeneration) {
    // TODO HANDLE IF REGENERATION
  } else {
    newMessages = [
      ...chatMessages,
      tempUserChatMessage,
      tempAssistantChatMessage,
    ];
  }

  setChatMessages(newMessages);

  return {
    tempUserChatMessage,
    tempAssistantChatMessage,
  };
};

export const handleHostedChat = async (
  payload: ChatPayload,
  profile: Tables<"profiles">,
  modelData: LLM,
  tempAssistantChatMessage: ChatMessage,
  isRegeneration: boolean,
  newAbortController: AbortController,
  setIsGenerating: Dispatch<SetStateAction<boolean>>,
  setFirstTokenReceived: Dispatch<SetStateAction<boolean>>,
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>
) => {
  const messages = buildFinalMessages(payload, profile);

  const apiEndpoint = "/api/chat/openrouter";

  const requestBody = {
    chatSettings: payload.chatSettings,
    messages,
  };

  const response = await fetchChatResponse(
    apiEndpoint,
    requestBody,
    newAbortController,
    setIsGenerating,
    setChatMessages
  );

  return await processResponse(
    response,
    isRegeneration
      ? payload.chatMessages[payload.chatMessages.length - 1]
      : tempAssistantChatMessage,
    newAbortController,
    setFirstTokenReceived,
    setChatMessages
  );
};

export const fetchChatResponse = async (
  url: string,
  body: object,
  controller: AbortController,
  setIsGenerating: Dispatch<SetStateAction<boolean>>,
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>
) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    signal: controller.signal,
  });

  if (!response.ok) {
    if (response.status === 404) {
      toast.error("Model not found.");
    }

    const errorData = await response.json();
    toast.error(errorData.message);

    setIsGenerating(false);
    setChatMessages((prevMessages) => prevMessages.slice(0, -2));
  }

  return response;
};

export const processResponse = async (
  response: Response,
  lastChatMessage: ChatMessage,
  controller: AbortController,
  setFirstTokenReceived: Dispatch<SetStateAction<boolean>>,
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>
) => {
  let fullText = "";
  let contentToAdd = "";

  if (response.body) {
    await consumeReadableStream(
      response.body,
      (chunk) => {
        console.log(chunk);
        setFirstTokenReceived(true);

        try {
          contentToAdd = chunk;

          fullText += contentToAdd;
        } catch (error) {
          console.error(error);
        }

        setChatMessages((prev) =>
          prev.map((chatMessage) => {
            if (chatMessage.message.id === lastChatMessage.message.id) {
              const updatedChatMessage: ChatMessage = {
                message: {
                  ...chatMessage.message,
                  content: fullText,
                },
              };

              return updatedChatMessage;
            }
            return chatMessage;
          })
        );
      },
      controller.signal
    );

    return fullText;
  } else {
    throw new Error("Response body is null");
  }
};

export const handleCreateChat = async (
  chatSettings: ChatSettings,
  profile: Tables<"profiles">,
  messageContent: string,
  setSelectedChat: Dispatch<SetStateAction<Tables<"chats"> | null>>,
  setChats: Dispatch<SetStateAction<Tables<"chats">[]>>
) => {
  const createdChat = await createChatOnClient({
    user_id: profile.user_id,
    assistant_id: null,
    context_length: chatSettings.contextLength,
    include_profile_context: chatSettings.includeProfileContext,
    model: chatSettings.model,
    name: messageContent.substring(0, 100),
    prompt: chatSettings.prompt,
    temperature: chatSettings.temperature,
  });

  setSelectedChat(createdChat);
  setChats((chats) => [createdChat, ...chats]);

  return createdChat;
};

export const handleCreateMessages = async (
  chatMessages: ChatMessage[],
  currentChat: Tables<"chats">,
  profile: Tables<"profiles">,
  modelData: LLM,
  messageContent: string,
  generatedText: string,
  isRegeneration: boolean,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const finalUserMessage: TablesInsert<"messages"> = {
    chat_id: currentChat.id,
    assistant_id: null,
    user_id: profile.user_id,
    content: messageContent,
    model: modelData.modelId,
    role: "user",
    sequence_number: chatMessages.length,
  };

  const finalAssistantMessage: TablesInsert<"messages"> = {
    chat_id: currentChat.id,
    assistant_id: null, // null for now
    user_id: profile.user_id,
    content: generatedText,
    model: modelData.modelId,
    role: "assistant",
    sequence_number: chatMessages.length + 1,
  };

  let finalChatMessages: ChatMessage[] = [];

  if (isRegeneration) {
    // TODO HANDLE REGENERATION
  } else {
    const createdMessages = await createMessagesOnClient([
      finalUserMessage,
      finalAssistantMessage,
    ]);

    const updatedMessage = await updateMessageOnClient(createdMessages[0].id, {
      ...createdMessages[0],
    });

    finalChatMessages = [
      ...chatMessages,
      {
        message: updatedMessage,
      },
      {
        message: createdMessages[1],
      },
    ];

    setChatMessages(finalChatMessages);
  }
};
