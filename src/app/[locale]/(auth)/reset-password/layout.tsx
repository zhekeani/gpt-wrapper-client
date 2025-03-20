import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const ResetPasswordLayout = async ({ children }: { children: ReactNode }) => {
  const cookieStore = await cookies();

  const resetPasswordToken = cookieStore.get("reset_password_token");

  if (!resetPasswordToken) {
    redirect("/global-error?type=missing-reset-token");
  }

  return <>{children}</>;
};

export default ResetPasswordLayout;
