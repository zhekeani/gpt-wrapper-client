"use client";

import ModelSelect from "@/components/models/model-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits";
import { cn } from "@/lib/utils";
import { useModelsStore } from "@/store/models-store";
import { useProfileStore } from "@/store/user-profile-store";
import { ChatSettings } from "@/types/chat";
import { AlertCircle, Info } from "lucide-react";
import { AdvancedSettings } from "./advanced-settings";

interface ChatSettingsFormProps {
  chatSettings: ChatSettings;
  onChangeChatSettings: (value: ChatSettings) => void;
  useAdvancedDropdown?: boolean;
  showTooltip?: boolean;
}

const ChatSettingsForm = ({
  chatSettings,
  onChangeChatSettings,
  useAdvancedDropdown = true,
  showTooltip = true,
}: ChatSettingsFormProps) => {
  const profile = useProfileStore((state) => state.profile);

  if (!profile) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-start space-x-2 rounded-lg border border-yellow-500 bg-yellow-100 p-3 text-yellow-900">
        <AlertCircle
          strokeWidth={1.5}
          className="mt-0.5 !size-[18px] shrink-0"
        />
        <p className="text-sm">
          Chat settings can only be managed <strong>before</strong> the chat
          begins. Once a conversation starts, changes won’t take effect.
        </p>
      </div>

      <div className="space-y-1">
        <Label>Model</Label>

        <ModelSelect
          selectedModelId={chatSettings.model}
          onSelectModel={(model) => {
            onChangeChatSettings({ ...chatSettings, model });
          }}
        />
      </div>

      <div className="space-y-1">
        <Label>Prompt</Label>

        <TextareaAutosize
          className="bg-background border-input border-2"
          placeholder="You are a helpful AI assistant."
          onValueChange={(prompt) => {
            onChangeChatSettings({ ...chatSettings, prompt });
          }}
          value={chatSettings.prompt}
          minRows={3}
          maxRows={6}
        />
      </div>

      {useAdvancedDropdown ? (
        <AdvancedSettings>
          <AdvancedContent
            chatSettings={chatSettings}
            onChangeChatSettings={onChangeChatSettings}
            showTooltip={showTooltip}
          />
        </AdvancedSettings>
      ) : (
        <div>
          <AdvancedContent
            chatSettings={chatSettings}
            onChangeChatSettings={onChangeChatSettings}
            showTooltip={showTooltip}
          />
        </div>
      )}
    </div>
  );
};

interface AdvancedContentProps {
  chatSettings: ChatSettings;
  onChangeChatSettings: (value: ChatSettings) => void;
  showTooltip: boolean;
}

const AdvancedContent = ({
  chatSettings,
  onChangeChatSettings,
  showTooltip,
}: AdvancedContentProps) => {
  const profile = useProfileStore((state) => state.profile);
  const availableOpenRouterModels = useModelsStore(
    (state) => state.availableOpenRouterModels
  );

  function findOpenRouterModel(modelId: string) {
    return availableOpenRouterModels.find((model) => model.modelId === modelId);
  }

  const MODEL_LIMITS = CHAT_SETTING_LIMITS[chatSettings.model] || {
    MIN_TEMPERATURE: 0,
    MAX_TEMPERATURE: 1,
    MAX_CONTEXT_LENGTH:
      findOpenRouterModel(chatSettings.model)?.maxContext || 4096,
  };

  return (
    <div className="mt-5">
      <div className="space-y-3">
        <Label className="flex items-center space-x-1">
          <div>Temperature:</div>

          <div>{chatSettings.temperature}</div>

          <TooltipWrapper
            delayDuration={0}
            display={
              <div className="flex max-w-52 flex-wrap p-2">
                <p className="mt-1">
                  Controls the randomness of responses. Lower values (e.g., 0.1)
                  make replies more <strong>deterministic and focused</strong>,
                  while higher values (e.g., 1.0) make them more{" "}
                  <strong>creative and diverse</strong>.
                </p>
              </div>
            }
            trigger={<Info className="cursor-hover:opacity-50" size={16} />}
          />
        </Label>

        <Slider
          value={[chatSettings.temperature]}
          onValueChange={(temperature) => {
            onChangeChatSettings({
              ...chatSettings,
              temperature: temperature[0],
            });
          }}
          min={MODEL_LIMITS.MIN_TEMPERATURE}
          max={MODEL_LIMITS.MAX_TEMPERATURE}
          step={0.01}
        />
      </div>

      <div className="mt-6 space-y-3">
        <Label className="flex items-center space-x-1">
          <div>Context Length:</div>

          <div>{chatSettings.contextLength}</div>
          <TooltipWrapper
            delayDuration={0}
            display={
              <div className="flex max-w-52 flex-wrap p-2">
                <p className="mt-1">
                  Determines how much prior conversation history the model
                  considers in generating responses. A higher context length
                  allows for <strong>better continuity</strong>, but it also
                  increases <strong>cost and processing time</strong>.
                </p>
              </div>
            }
            trigger={<Info className="cursor-hover:opacity-50" size={16} />}
          />
        </Label>

        <Slider
          value={[chatSettings.contextLength]}
          onValueChange={(contextLength) => {
            onChangeChatSettings({
              ...chatSettings,
              contextLength: contextLength[0],
            });
          }}
          min={0}
          max={MODEL_LIMITS.MAX_CONTEXT_LENGTH}
          step={1}
        />
      </div>

      <div className="mt-7 flex items-center space-x-2">
        <Checkbox
          checked={chatSettings.includeProfileContext}
          onCheckedChange={(value: boolean) =>
            onChangeChatSettings({
              ...chatSettings,
              includeProfileContext: value,
            })
          }
        />

        <Label>Chats Include Profile Context</Label>

        {showTooltip && (
          <TooltipWrapper
            delayDuration={0}
            display={
              <div
                className={cn(
                  " p-2",
                  profile?.profile_context ? "w-[400px]" : "w-fit"
                )}
              >
                {profile?.profile_context || "No profile context."}
              </div>
            }
            trigger={<Info className="cursor-hover:opacity-50" size={16} />}
          />
        )}
      </div>
    </div>
  );
};

export default ChatSettingsForm;
