import { GptWrapperContext } from "@/context/context";
import { updateChatOnClient } from "@/lib/db/chats";
import { ChatPayload } from "@/types/chat";
import { ChatMessage } from "@/types/chat-message";
import { useContext, useRef } from "react";
import {
  createTempMessages,
  handleCreateChat,
  handleCreateMessages,
  handleHostedChat,
  validateChatSettings,
} from "../chat-helpers";
import { useRouter } from "next/navigation";

export const useChatHandler = () => {
  const router = useRouter();
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const {
    profile,
    setIsGenerating,
    setUserInput,
    setChatMessages,
    setFirstTokenReceived,
    selectedChat,
    setChats,
    availableOpenRouterModels,
    setAbortController,
    abortController,
    chatSettings,
    setSelectedChat,
  } = useContext(GptWrapperContext);

  // Handle new chat
  const handleNewChat = () => {
    setUserInput("");
    setChatMessages([]);
    setSelectedChat(null);

    setIsGenerating(false);
    setFirstTokenReceived(false);

    router.push(`/chat`);
  };

  const handleFocusChatInput = () => {
    chatInputRef.current?.focus();
  };

  const handleStopMessage = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  // Handle send message
  const handleSendMessage = async (
    messageContent: string,
    chatMessages: ChatMessage[],
    isRegeneration: boolean
  ) => {
    const startingInput = messageContent;

    try {
      setUserInput("");
      setIsGenerating(true);

      const newAbortController = new AbortController();
      setAbortController(newAbortController);

      const modelData = availableOpenRouterModels.find(
        (llm) => llm.modelId === chatSettings?.model
      );

      validateChatSettings(chatSettings, modelData, profile, messageContent);

      let currentChat = selectedChat ? { ...selectedChat } : null;

      const { tempAssistantChatMessage, tempUserChatMessage } =
        createTempMessages(
          messageContent,
          chatMessages,
          chatSettings!,
          isRegeneration,
          setChatMessages
        );

      const payload: ChatPayload = {
        chatSettings: chatSettings!,
        chatMessages: isRegeneration
          ? [...chatMessages]
          : [...chatMessages, tempUserChatMessage],
      };

      const generatedText = await handleHostedChat(
        payload,
        profile!,
        modelData!,
        tempAssistantChatMessage,
        isRegeneration,
        newAbortController,
        setIsGenerating,
        setFirstTokenReceived,
        setChatMessages
      );

      if (!currentChat) {
        currentChat = await handleCreateChat(
          chatSettings!,
          profile!,
          messageContent,
          setSelectedChat,
          setChats
        );
        // router.replace(`/chat/${currentChat.id}`);
      } else {
        const updatedChat = await updateChatOnClient(currentChat.id, {
          updated_at: new Date().toISOString(),
        });

        setChats((prevChats) => {
          const updatedChats = prevChats.map((prevChat) =>
            prevChat.id === updatedChat.id ? updatedChat : prevChat
          );

          return updatedChats;
        });
      }

      await handleCreateMessages(
        chatMessages,
        currentChat,
        profile!,
        modelData!,
        messageContent,
        generatedText,
        isRegeneration,
        setChatMessages
      );

      setIsGenerating(false);
      setFirstTokenReceived(false);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      setFirstTokenReceived(false);
      setUserInput(startingInput);
    }
  };

  return {
    chatInputRef,
    handleNewChat,
    handleFocusChatInput,
    handleStopMessage,
    handleSendMessage,
  };
};
