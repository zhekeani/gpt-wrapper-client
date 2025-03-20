"use client";

import ProfilePopover from "@/components/profile/profile-popover";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/user-profile-store";

const SidebarProfileButton = () => {
  const profile = useProfileStore((state) => state.profile);

  if (!profile) return null;

  const { username, display_name, image_url } = profile;
  return (
    <ProfilePopover profile={profile}>
      <Button
        variant={"ghost"}
        className="h-fit w-full flex items-center justify-start gap-2 rounded-md px-1"
      >
        <Avatar className="size-8">
          {image_url && (
            <AvatarImage
              src={image_url}
              className="w-full h-full object-cover"
            />
          )}

          {!image_url && (
            <div className="bg-muted flex size-full items-center justify-center rounded-full text-sm">
              {username.slice(0, 2).toUpperCase()}
            </div>
          )}
        </Avatar>

        <div>
          <p>{display_name || username}</p>
        </div>
      </Button>
    </ProfilePopover>
  );
};

export default SidebarProfileButton;
