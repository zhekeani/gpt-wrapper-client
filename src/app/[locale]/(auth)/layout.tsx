import QueryProvider from "@/components/utility/query-provider";
import { getSupabaseCookiesUtilClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const AuthGroupLayout = async ({ children }: { children: ReactNode }) => {
  const supabase = await getSupabaseCookiesUtilClient();
  const user = (await supabase.auth.getUser()).data.user;

  if (user && user.confirmed_at) {
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("has_onboarded")
      .eq("user_id", user.id)
      .single();

    if (!profileError && data.has_onboarded) {
      const { data: latestChat, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .order("created_at", { ascending: false })
        .maybeSingle();

      if (error) {
        console.error(error);
      }

      if (latestChat) {
        return redirect(`/chat/${latestChat.id}`);
      }

      return redirect(`/chat`);
    }
  }

  return (
    <div className="flex w-full flex-1 items-center justify-center px-8 sm:max-w-md">
      <QueryProvider>{children}</QueryProvider>
    </div>
  );
};

export default AuthGroupLayout;
