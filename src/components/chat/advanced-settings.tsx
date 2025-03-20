import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FC, useState } from "react";

interface AdvancedSettingsProps {
  children: React.ReactNode;
}

export const AdvancedSettings: FC<AdvancedSettingsProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(
    false
    // localStorage.getItem("advanced-settings-open") === "true"
  );

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    // localStorage.setItem("advanced-settings-open", String(isOpen))
  };

  return (
    <Collapsible className="pt-2" open={isOpen} onOpenChange={handleOpenChange}>
      <CollapsibleTrigger className="hover:opacity-50">
        <div className="flex items-center font-bold">
          <div className="mr-1 text-sm">Advanced Settings</div>
          {isOpen ? (
            <ChevronDown className="size-5" strokeWidth={2} />
          ) : (
            <ChevronRight className="size-5" strokeWidth={2} />
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4">{children}</CollapsibleContent>
    </Collapsible>
  );
};
