"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits";
import { useModelsStore } from "@/store/models-store";
import { usePassiveChatStore } from "@/store/passive-chat-store";
import { SlidersHorizontal } from "lucide-react";
import { useEffect } from "react";
import ChatSettingsForm from "./chat-settings-form";

const ChatSettings = () => {
  const chatSettings = usePassiveChatStore((state) => state.chatSettings);
  const setChatSettings = usePassiveChatStore((state) => state.setChatSettings);
  const availableOpenRouterModels = useModelsStore(
    (state) => state.availableOpenRouterModels
  );

  useEffect(() => {
    if (!chatSettings) return;

    setChatSettings({
      ...chatSettings,
      temperature: Math.min(
        chatSettings.temperature,
        CHAT_SETTING_LIMITS[chatSettings.model]?.MAX_TEMPERATURE || 1
      ),
      contextLength: Math.min(
        chatSettings.contextLength,
        CHAT_SETTING_LIMITS[chatSettings.model]?.MAX_CONTEXT_LENGTH || 4096
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatSettings?.model]);

  if (!chatSettings) return null;

  const allModels = availableOpenRouterModels;
  const selectedModel = allModels.find(
    (llm) => llm.modelId === chatSettings?.model
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center space-x-2" variant="ghost">
          <div className="max-w-[120px] truncate text-base sm:max-w-[300px] lg:max-w-[500px]">
            {selectedModel?.modelName || chatSettings?.model}
          </div>

          <SlidersHorizontal strokeWidth={2} className="!size-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="bg-background !border-input relative flex max-h-[calc(100vh-60px)] w-[300px] flex-col space-y-4 overflow-auto rounded-lg !border-[1px] p-6 sm:w-[350px] md:w-[400px] lg:w-[500px] "
        align="end"
      >
        <ChatSettingsForm
          chatSettings={chatSettings}
          onChangeChatSettings={setChatSettings}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ChatSettings;
