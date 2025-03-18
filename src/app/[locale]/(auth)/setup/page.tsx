"use client";

import { APIStep } from "@/components/setup/api-step";
import { FinishStep } from "@/components/setup/finish-step";
import { ProfileStep } from "@/components/setup/profile-step";
import {
  SETUP_STEP_COUNT,
  StepContainer,
} from "@/components/setup/step-container";
import { GptWrapperContext } from "@/context/context";
import {
  getProfileByUserIdOnClient,
  updateProfileOnClient,
} from "@/lib/db/profile";
import { fetchOpenRouterModels } from "@/lib/models/fetch-models";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { TablesUpdate } from "@/types/supabase.types";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

const Setup = () => {
  const { profile, setProfile, setAvailableOpenRouterModels } =
    useContext(GptWrapperContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const isInitialLoad = useRef<boolean>(true);

  // Profile step
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState(profile?.username || "");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [apiKeyValid, setApiKeyValid] = useState(false);

  // Api step
  const [openrouterAPIKey, setOpenrouterAPIKey] = useState("");

  useEffect(() => {
    (async () => {
      if (isInitialLoad.current) {
        const supabase = getSupabaseBrowserClient();
        const session = (await supabase.auth.getSession()).data.session;

        if (!session) {
          return router.push("/login");
        } else {
          const user = session.user;

          const profile = await getProfileByUserIdOnClient(user.id);
          setProfile(profile);
          setUsername(profile.username);

          if (!profile.has_onboarded) {
            setLoading(false);
          } else {
            if (profile["openrouter_api_key"]) {
              const openRouterModels = await fetchOpenRouterModels();
              if (!openRouterModels) return;
              setAvailableOpenRouterModels(openRouterModels);
            }
            return router.push(`/chat`);
          }
        }

        isInitialLoad.current = false;
      }
    })();
  }, [router, setAvailableOpenRouterModels, setProfile]);

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
    const supabase = getSupabaseBrowserClient();
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) {
      return router.push("/login");
    }

    const user = session.user;
    const profile = await getProfileByUserIdOnClient(user.id);

    const updateProfilePayload: TablesUpdate<"profiles"> = {
      ...profile,
      has_onboarded: apiKeyValid,
      display_name: displayName,
      username,
      openrouter_api_key: openrouterAPIKey,
    };

    const updatedProfile = await updateProfileOnClient(
      profile.id,
      updateProfilePayload
    );
    setProfile(updatedProfile);

    return router.push(`/chat`);
  };

  const renderStep = (stepNum: number) => {
    switch (stepNum) {
      // Profile Step
      case 1:
        return (
          <StepContainer
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
            stepDescription="Our app uses models hosted on OpenRouter, but unfortunately, we need you to provide your own API key."
            stepNum={currentStep}
            stepTitle="Set API Keys"
            onShouldProceed={handleShouldProceed}
            enableNextButton={apiKeyValid}
            enableBackButton={true}
          >
            <APIStep
              openrouterAPIKey={openrouterAPIKey}
              apiKeyValid={apiKeyValid}
              onOpenrouterAPIKeyChange={setOpenrouterAPIKey}
              onApiKeyValidChange={setApiKeyValid}
            />
          </StepContainer>
        );

      // Finish Step
      case 3:
        return (
          <StepContainer
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

  if (loading) {
    return null;
  }

  return <>{renderStep(currentStep)}</>;
};

export default Setup;
