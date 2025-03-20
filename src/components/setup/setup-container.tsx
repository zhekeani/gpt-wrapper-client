"use client";

import Loading from "@/app/[locale]/loading";
import { APIStep } from "@/components/setup/api-step";
import { FinishStep } from "@/components/setup/finish-step";
import { ProfileStep } from "@/components/setup/profile-step";
import {
  SETUP_STEP_COUNT,
  StepContainer,
} from "@/components/setup/step-container";
import { updateProfileOnClient } from "@/lib/db/profile";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useProfileStore } from "@/store/user-profile-store";
import { Tables, TablesUpdate } from "@/types/supabase.types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface SetupContainerProps {
  profile: Tables<"profiles">;
}

const SetupContainer = ({ profile: initialProfile }: SetupContainerProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const isInitialLoad = useRef<boolean>(true);
  const [currentStep, setCurrentStep] = useState(1);

  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);

  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [apiKeyValid, setApiKeyValid] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      if (isInitialLoad.current) {
        setProfile(initialProfile);

        isInitialLoad.current = false;
      }
      setLoading(false);
    })();
  }, [initialProfile, setProfile]);

  const setUsername = (username: string) => {
    setProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        username,
      };
    });
  };

  const setDisplayName = (name: string) => {
    setProfile((prev) => {
      if (!prev) return null;
      return name
        ? {
            ...prev,
            display_name: name,
          }
        : prev;
    });
  };

  const setApiKey = (apiKey: string) => {
    setProfile((prev) => {
      if (!prev) return null;
      return { ...prev, openrouter_api_key: apiKey };
    });
  };

  const handleShouldProceed = (proceed: boolean) => {
    if (proceed) {
      if (currentStep === SETUP_STEP_COUNT) {
        handleSaveSetupSetting();
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveSetupSetting = async () => {
    setIsSaving(true);
    const supabase = getSupabaseBrowserClient();
    const session = (await supabase.auth.getSession()).data.session;
    if (!session || !profile) {
      return router.push("/login");
    }

    const updateProfilePayload: TablesUpdate<"profiles"> = {
      ...profile,
      has_onboarded: apiKeyValid && usernameAvailable,
    };

    const updatedProfile = await updateProfileOnClient(
      profile.id,
      updateProfilePayload
    );
    setProfile(updatedProfile);
    setIsSaving(false);

    return router.push(`/chat`);
  };

  if (loading || !profile) {
    return <Loading />;
  }

  const {
    username,
    display_name: displayName,
    openrouter_api_key: openrouterAPIKey,
  } = profile;

  const renderStep = (stepNum: number) => {
    switch (stepNum) {
      // Profile Step
      case 1:
        return (
          <StepContainer
            isSaving={isSaving}
            stepDescription="Let's create your profile."
            stepNum={currentStep}
            stepTitle="Welcome to GPT Wrapper"
            onShouldProceed={handleShouldProceed}
            enableNextButton={!!(username && usernameAvailable)}
            enableBackButton={false}
          >
            <ProfileStep
              username={username}
              usernameAvailable={usernameAvailable}
              displayName={displayName}
              onUsernameAvailableChange={setUsernameAvailable}
              onUsernameChange={setUsername}
              onDisplayNameChange={setDisplayName}
            />
          </StepContainer>
        );

      // API Step
      case 2:
        return (
          <StepContainer
            isSaving={isSaving}
            stepDescription="Our app uses models hosted on OpenRouter, but unfortunately, we need you to provide your own API key."
            stepNum={currentStep}
            stepTitle="Set API Keys"
            onShouldProceed={handleShouldProceed}
            enableNextButton={apiKeyValid}
            enableBackButton={true}
          >
            <APIStep
              openrouterAPIKey={openrouterAPIKey || ""}
              apiKeyValid={apiKeyValid}
              onOpenrouterAPIKeyChange={setApiKey}
              onApiKeyValidChange={setApiKeyValid}
            />
          </StepContainer>
        );

      // Finish Step
      case 3:
        return (
          <StepContainer
            isSaving={isSaving}
            stepDescription="You are all set up!"
            stepNum={currentStep}
            stepTitle="Setup Complete"
            onShouldProceed={handleShouldProceed}
            enableNextButton={true}
            enableBackButton={true}
          >
            <FinishStep displayName={displayName} />
          </StepContainer>
        );
      default:
        return null;
    }
  };

  return <>{renderStep(currentStep)}</>;
};

export default SetupContainer;
