import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC, useRef } from "react";

export const SETUP_STEP_COUNT = 3;

interface StepContainerProps {
  stepDescription: string;
  stepNum: number;
  stepTitle: string;
  onShouldProceed: (shouldProceed: boolean) => void;
  children?: React.ReactNode;
  enableBackButton?: boolean;
  enableNextButton?: boolean;
}

export const StepContainer: FC<StepContainerProps> = ({
  stepDescription,
  stepNum,
  stepTitle,
  onShouldProceed,
  children,
  enableBackButton = false,
  enableNextButton = true,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

  return (
    <Card
      className="max-h-[calc(100vh-60px)] w-[600px] overflow"
      onKeyDown={handleKeyDown}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div>{stepTitle}</div>

          <div className="text-sm">
            {stepNum} / {SETUP_STEP_COUNT}
          </div>
        </CardTitle>

        <CardDescription>{stepDescription}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">{children}</CardContent>

      <CardFooter className="flex justify-between">
        <div>
          <Button
            disabled={!enableBackButton}
            size="sm"
            variant="outline"
            onClick={() => onShouldProceed(false)}
          >
            Back
          </Button>
        </div>

        <div>
          <Button
            disabled={!enableNextButton}
            ref={buttonRef}
            size="sm"
            onClick={() => onShouldProceed(true)}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
