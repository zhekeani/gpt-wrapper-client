import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useProfileStore } from "@/store/user-profile-store";
import ProfilePopover from "./profile-popover";

const HeaderProfileButton = () => {
  const profile = useProfileStore((state) => state.profile);

  if (!profile) return null;

  const { username, image_url } = profile;

  return (
    <ProfilePopover profile={profile}>
      <Avatar>
        {image_url && (
          <AvatarImage src={image_url} className="w-full h-full object-cover" />
        )}

        {!image_url && (
          <div className="bg-muted flex size-full items-center justify-center rounded-full text-sm">
            {username.slice(0, 2).toUpperCase()}
          </div>
        )}
      </Avatar>
    </ProfilePopover>
  );
};

export default HeaderProfileButton;
