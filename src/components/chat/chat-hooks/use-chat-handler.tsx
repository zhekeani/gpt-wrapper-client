import {
  createTempMessages,
  handleCreateChat,
  handleCreateMessages,
  handleHostedChat,
  validateChatSettings,
} from "@/components/chat/chat-helpers";
import { updateChatOnClient } from "@/lib/db/chats";
import { deleteMessagesIncludingAndAfterOnClient } from "@/lib/db/messages";
import { useActiveChatStore } from "@/store/active-chat-store";
import { useItemsStore } from "@/store/items-store";
import { useModelsStore } from "@/store/models-store";
import { usePassiveChatStore } from "@/store/passive-chat-store";
import { useProfileStore } from "@/store/user-profile-store";
import { ChatPayload } from "@/types/chat";
import { ChatMessage } from "@/types/chat-message";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export const useChatHandler = () => {
  const router = useRouter();
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const profile = useProfileStore((state) => state.profile);

  const setIsGenerating = useActiveChatStore((state) => state.setIsGenerating);
  const setFirstTokenReceived = useActiveChatStore(
    (state) => state.setFirstTokenReceived
  );
  const setAbortController = useActiveChatStore(
    (state) => state.setAbortController
  );
  const abortController = useActiveChatStore((state) => state.abortController);

  const setUserInput = usePassiveChatStore((state) => state.setUserInput);
  const setSelectedChat = usePassiveChatStore((state) => state.setSelectedChat);
  const selectedChat = usePassiveChatStore((state) => state.selectedChat);

  const setChatMessages = usePassiveChatStore((state) => state.setChatMessages);
  const chatMessages = usePassiveChatStore((state) => state.chatMessages);
  const setChats = useItemsStore((state) => state.setChats);

  const availableOpenRouterModels = useModelsStore(
    (state) => state.availableOpenRouterModels
  );

  const chatSettings = usePassiveChatStore((state) => state.chatSettings);

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

      console.log(chatSettings, availableOpenRouterModels);

      const modelData = availableOpenRouterModels.find(
        (llm) => llm.modelId === chatSettings?.model
      );

      validateChatSettings(chatSettings, modelData, profile, messageContent);

      const isNewChat = !!!selectedChat;
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

      if (isNewChat) {
        router.replace(`/chat/${currentChat.id}`);
      }
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      setFirstTokenReceived(false);
      setUserInput(startingInput);
    }
  };

  const handleSendEdit = async (
    editedContent: string,
    sequenceNumber: number
  ) => {
    if (!selectedChat) return;

    await deleteMessagesIncludingAndAfterOnClient(
      selectedChat.user_id,
      selectedChat.id,
      sequenceNumber
    );

    const filteredMessages = chatMessages.filter(
      (chatMessage) => chatMessage.message.sequence_number < sequenceNumber
    );

    setChatMessages(filteredMessages);

    handleSendMessage(editedContent, filteredMessages, false);
  };

  return {
    chatInputRef,
    handleNewChat,
    handleFocusChatInput,
    handleStopMessage,
    handleSendMessage,
    handleSendEdit,
  };
};
