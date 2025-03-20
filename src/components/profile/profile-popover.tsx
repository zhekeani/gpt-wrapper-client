"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PopoverButton,
  PopoverDivider,
  PopoverGroup,
} from "@/components/ui/popover-extended";
import { cn } from "@/lib/utils";
import { Tables } from "@/types/supabase.types";
import { BrainCircuit, LogOut, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabase/browser-client";
import ProfileSettingsDialog from "./profile-settings-dialog";

interface ProfilePopoverProps {
  children: ReactNode;
  profile: Tables<"profiles">;
  contentClassName?: string;
  side?: "bottom" | "left" | "right" | "top";
  triggerAsChild?: boolean;
}

const ProfilePopover = ({
  children,
  profile: initialProfile,
  contentClassName,
  side = "bottom",
  triggerAsChild = true,
}: ProfilePopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    const signOut = async () => {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();

      setIsOpen(false);
      router.push("/login");
      router.refresh();
      return;
    };
    signOut();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        asChild={triggerAsChild}
        className="rounded-full cursor-pointer"
      >
        {children}
      </PopoverTrigger>

      <PopoverContent side={side} className={cn("!p-0", contentClassName)}>
        <PopoverGroup className="gap-1">
          <PopoverButton className="gap-3">
            <BrainCircuit />
            My GPTs
          </PopoverButton>

          <ProfileSettingsDialog profile={initialProfile}>
            <PopoverButton className="gap-3">
              <UserCog /> Profile Settings
            </PopoverButton>
          </ProfileSettingsDialog>
        </PopoverGroup>
        <PopoverDivider />
        <PopoverGroup>
          <PopoverButton onClick={handleSignOut} className="gap-3">
            <LogOut />
            Log out
          </PopoverButton>
        </PopoverGroup>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
