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

  asChild?: boolean;
}

export const TooltipWrapper: FC<TooltipWrapperProps> = ({
  display,
  trigger,
  asChild = false,
  delayDuration = 500,
  side = "right",
}) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{trigger}</TooltipTrigger>

        {display && <TooltipContent side={side}>{display}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};
