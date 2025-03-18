import { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface TooltipWrapperProps {
  display: React.ReactNode;
  trigger: React.ReactNode;

  delayDuration?: number;
  side?: "left" | "right" | "top" | "bottom";
}

export const TooltipWrapper: FC<TooltipWrapperProps> = ({
  display,
  trigger,
  delayDuration = 500,
  side = "right",
}) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger>{trigger}</TooltipTrigger>

        {display && <TooltipContent side={side}>{display}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};
