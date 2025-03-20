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
import { Tables } from "@/types/supabase.types";
import { BrainCircuit, LogOut, UserCog } from "lucide-react";
import { ReactNode, useState } from "react";
import ProfileSettingsDialog from "./profile-settings-dialog";

interface ProfilePopoverProps {
  children: ReactNode;
  profile: Tables<"profiles">;
  side?: "bottom" | "left" | "right" | "top";
  triggerAsChild?: boolean;
}

const ProfilePopover = ({
  children,
  profile: initialProfile,
  side = "bottom",
  triggerAsChild = true,
}: ProfilePopoverProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        asChild={triggerAsChild}
        className="rounded-full cursor-pointer"
      >
        {children}
      </PopoverTrigger>

      <PopoverContent side={side} className="!p-0">
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
          <PopoverButton className="gap-3">
            <LogOut />
            Log out
          </PopoverButton>
        </PopoverGroup>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
