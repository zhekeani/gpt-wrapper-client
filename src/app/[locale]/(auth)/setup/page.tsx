import SetupContainer from "@/components/setup/setup-container";
import { getProfileByUserIdOnServer } from "@/lib/db/profile-server";
import { getSupabaseCookiesUtilClient } from "@/lib/supabase/server";
import { Tables } from "@/types/supabase.types";
import { redirect } from "next/navigation";

const fetchInitialData = async (): Promise<Tables<"profiles">> => {
  const supabase = await getSupabaseCookiesUtilClient();

  const user = (await supabase.auth.getUser()).data.user;
  if (!user || !user.confirmed_at) {
    redirect("/login");
  }

  const profile = await getProfileByUserIdOnServer(user.id);

  if (profile.has_onboarded) {
    redirect("/chat");
  }

  return profile;
};

const SetupPage = async () => {
  const profile = await fetchInitialData();

  return <SetupContainer profile={profile} />;
};

export default SetupPage;
