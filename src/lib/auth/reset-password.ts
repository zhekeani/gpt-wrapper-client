"use server";

import { cookies } from "next/headers";

export async function removeResetPasswordToken() {
  const cookieStore = await cookies();

  cookieStore.set("reset_password_token", "", {
    maxAge: 0,
    path: "/reset-password",
  });
}
