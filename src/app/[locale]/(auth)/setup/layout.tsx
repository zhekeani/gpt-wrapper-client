import { getSupabaseCookiesUtilClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const SetupLayout = async ({ children }: { children: ReactNode }) => {
  const supabase = await getSupabaseCookiesUtilClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user || !user.confirmed_at) {
    redirect("/signup");
  }

  return <>{children}</>;
};

export default SetupLayout;
