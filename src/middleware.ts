import { i18nRouter } from "next-i18n-router";
import { NextRequest, NextResponse } from "next/server";
import i18nConfig from "./i18nConfig";

export async function middleware(request: NextRequest) {
  const i18nResult = i18nRouter(request, i18nConfig);
  if (i18nResult) return i18nResult;

  try {
    // Commented out session checking and workspace redirection

    // const { supabase, response } = createClient(request)
    // const session = await supabase.auth.getSession()

    // const redirectToChat = session && request.nextUrl.pathname === "/"

    // if (redirectToChat) {
    //   const { data: homeWorkspace, error } = await supabase
    //     .from("workspaces")
    //     .select("*")
    //     .eq("user_id", session.data.session?.user.id)
    //     .eq("is_home", true)
    //     .single()

    //   if (!homeWorkspace) {
    //     throw new Error(error?.message)
    //   }

    //   return NextResponse.redirect(
    //     new URL(`/${homeWorkspace.id}/chat`, request.url)
    //   )
    // }

    return NextResponse.next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|auth).*)",
};
