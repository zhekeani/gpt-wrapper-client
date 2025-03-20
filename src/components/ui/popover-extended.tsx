import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type PopoverGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export const PopoverGroup = ({
  children,
  className,
  ...props
}: PopoverGroupProps) => {
  return (
    <div
      className={cn("py-2 px-1 flex flex-col items-start", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const PopoverDivider = () => {
  return <div className="w-full h-[1px] bg-accent" />;
};

type PopoverButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "danger" | "success";
  children: ReactNode;
};

export const PopoverButton = ({
  children,
  variant = "default",
  className,
  asChild = false,
  ...props
}: PopoverButtonProps & { asChild?: boolean }) => {
  return (
    <Button
      asChild={asChild}
      variant={"ghost"}
      className={cn(
        "font-normal hover:text-main-text transition-colors w-full justify-start",
        "focus-visible:ring-0",
        variant === "default" && "text-sub-text",
        variant === "danger" && "text-destructive",
        variant === "success" && "text-main-green",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
