import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LimitDisplay } from "@/components/ui/limit-display";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import {
  PROFILE_ACCEPTED_IMAGE_TYPES,
  PROFILE_CONTEXT_MAX,
  PROFILE_DISPLAY_NAME_MAX,
  PROFILE_MAX_IMAGE_SIZE,
  PROFILE_USERNAME_MAX,
  PROFILE_USERNAME_MIN,
} from "@/lib/db/limits";
import { updateProfileAndAvatarOnServer } from "@/lib/db/profile-server";
import { useProfileStore } from "@/store/user-profile-store";
import { Tables } from "@/types/supabase.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { ReactNode, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const formSchema = z.object({
  username: z
    .string()
    .min(PROFILE_USERNAME_MIN, {
      message: `Username must be at least ${PROFILE_USERNAME_MIN} characters long.`,
    })
    .max(PROFILE_USERNAME_MAX, {
      message: `Username must be at most ${PROFILE_USERNAME_MAX} characters long.`,
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  profileImage: z
    .custom<File>((file) => file instanceof File || file === undefined, {
      message: "Invalid file type.",
    })
    .optional()
    .refine((file) => !file || file.size <= PROFILE_MAX_IMAGE_SIZE, {
      message: "Image size must be 5MB or less.",
    })
    .refine(
      (file) => !file || PROFILE_ACCEPTED_IMAGE_TYPES.includes(file.type),
      {
        message: "Only JPEG, PNG, or WebP images are allowed.",
      }
    ),

  displayName: z
    .string()
    .min(3, { message: "Display name must be at least 3 characters long." })
    .max(PROFILE_DISPLAY_NAME_MAX, {
      message: `Display name must be at most ${PROFILE_DISPLAY_NAME_MAX} characters long.`,
    }),

  profileContext: z.string().optional(),
});

interface ProfileSettingsDialogProps {
  children: ReactNode;
  profile: Tables<"profiles">;
  triggerAsChild?: boolean;
}

const ProfileSettingsDialog = ({
  children,
  profile: initialProfile,
  triggerAsChild = true,
}: ProfileSettingsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const setProfile = useProfileStore((state) => state.setProfile);

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialProfile?.image_url || null
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: initialProfile.username,
      displayName: initialProfile.display_name,
      profileContext: initialProfile.profile_context || "",
    },
  });

  const { handleSubmit, control, reset, watch, setError, formState } = form;
  const { isValid } = formState;

  const usernameValue = watch("username");
  const displayNameValue = watch("displayName");
  const profileContextValue = watch("profileContext");

  const { mutate: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      updateProfileAndAvatarOnServer(
        initialProfile.id,
        initialProfile.user_id,
        {
          username:
            values.username !== initialProfile.username
              ? values.username
              : undefined,
          display_name: values.displayName,
          profile_context: values.profileContext,
          image_url: previewUrl || undefined,
        },
        values.profileImage
      ),

    onSuccess: (res) => {
      if (!res.success) {
        if (res.error.includes("Username is used.")) {
          setError("username", { type: "manual", message: res.error });
        } else {
          setGeneralError(res.error);
        }
        toast.error(res.error);
      } else {
        toast.success("Successfully updated profile");

        setProfile((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            ...res.data,
          };
        });

        setIsOpen(false);
      }
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    updateMutation(values);
  };

  const onClose = () => {
    if (isOpen) {
      reset({
        username: initialProfile.username,
        displayName: initialProfile.display_name || "",
        profileContext: initialProfile.profile_context || "",
      });
      setPreviewUrl(initialProfile.image_url);
    }
    setIsOpen((prev) => !prev);
  };

  const handleAvatarChange = (file?: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveAvatar = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild={triggerAsChild}>{children}</DialogTrigger>

      <DialogContent aria-describedby={undefined}>
        <VisuallyHidden>
          <DialogTitle>Profile Settings</DialogTitle>
        </VisuallyHidden>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-8">
              <FormField
                control={control}
                name="profileImage"
                render={({ field: { onChange, ref } }) => (
                  <FormItem>
                    <FormLabel>Photo</FormLabel>
                    <FormControl>
                      <div className="flex gap-6 pt-[10px]">
                        <div className="relative w-20 h-20">
                          {/* Avatar Preview */}
                          <Avatar className="absolute top-0 left-0 pointer-events-none w-20 h-20">
                            {previewUrl && (
                              <AvatarImage
                                className="h-full w-full object-cover"
                                src={previewUrl}
                              />
                            )}
                            {!previewUrl && (
                              <div className="bg-muted flex size-full items-center justify-center rounded-full text-2xl">
                                {initialProfile.username
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                            )}
                          </Avatar>

                          {/* Hidden File Input */}
                          <Input
                            id="avatar"
                            type="file"
                            accept="image/jpeg, image/png, image/webp"
                            className="w-20 h-20 rounded-full opacity-0 absolute"
                            ref={(el) => {
                              ref(el);
                              fileInputRef.current = el;
                            }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              handleAvatarChange(file);
                              onChange(file);
                            }}
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex gap-4">
                            <Button
                              variant="ghost"
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="p-1 font-normal text-main-green"
                            >
                              Update
                            </Button>
                            <Button
                              disabled={!!!previewUrl}
                              onClick={handleRemoveAvatar}
                              variant="ghost"
                              type="button"
                              className="p-1 font-normal text-destructive"
                            >
                              Remove
                            </Button>
                          </div>

                          <FormDescription className="text-sm">
                            Recommended Square JPG or PNG, at least 1,000 pixels
                            per side.
                          </FormDescription>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className=" space-y-4">
              <FormField
                control={control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        minLength={PROFILE_USERNAME_MIN}
                        maxLength={PROFILE_USERNAME_MAX}
                        {...field}
                      />
                    </FormControl>
                    <LimitDisplay
                      used={usernameValue.length}
                      limit={PROFILE_USERNAME_MAX}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="display name"
                        minLength={3}
                        maxLength={PROFILE_DISPLAY_NAME_MAX}
                        {...field}
                      />
                    </FormControl>
                    <LimitDisplay
                      used={displayNameValue.length}
                      limit={PROFILE_DISPLAY_NAME_MAX}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="profileContext"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Profile Context</FormLabel>
                    <FormControl>
                      <TextareaAutosize
                        placeholder="Profile context... (optional)"
                        minRows={6}
                        maxRows={10}
                        onValueChange={onChange}
                        value={value || ""}
                        {...field}
                      />
                    </FormControl>
                    <LimitDisplay
                      used={profileContextValue?.length || 0}
                      limit={PROFILE_CONTEXT_MAX}
                    />
                  </FormItem>
                )}
              />
            </div>

            {generalError && (
              <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-center text-sm text-destructive">
                {generalError}
              </div>
            )}

            <div className="mt-8 flex justify-end gap-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || isUpdating}>
                {isUpdating ? (
                  <LoaderCircle className="animate-spin !aspect-square" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsDialog;
