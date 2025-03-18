import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { FC, useCallback, useState } from "react";

interface APIStepProps {
  openrouterAPIKey: string;
  apiKeyValid: boolean;
  onOpenrouterAPIKeyChange: (value: string) => void;
  onApiKeyValidChange: (isValid: boolean) => void;
}

export const APIStep: FC<APIStepProps> = ({
  openrouterAPIKey,
  apiKeyValid,
  onOpenrouterAPIKeyChange,
  onApiKeyValidChange,
}) => {
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout | null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args: any[]) => {
      const later = () => {
        if (timeout) clearTimeout(timeout);
        func(...args);
      };

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const checkApiKeyValidity = useCallback(
    debounce(async (apiKey: string) => {
      if (!apiKey) return;

      setLoading(true);

      const response = await fetch(`/api/api-key/openrouter/available`, {
        method: "POST",
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();
      const isValid = data.isValid;

      onApiKeyValidChange(isValid);

      setLoading(false);
    }, 500),
    []
  );

  return (
    <>
      <div className="space-y-1">
        <Label>OpenRouter API Key</Label>

        <div className="relative">
          <Input
            className="pr-10"
            placeholder="OpenRouter API Key"
            type="password"
            value={openrouterAPIKey}
            onChange={(e) => {
              onOpenrouterAPIKeyChange(e.target.value);
              checkApiKeyValidity(e.target.value);
            }}
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {loading ? (
              <LoaderCircle className="animate-spin !aspect-square" />
            ) : apiKeyValid ? (
              <CircleCheck className="text-green-500" />
            ) : (
              <CircleX className="text-red-500" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
