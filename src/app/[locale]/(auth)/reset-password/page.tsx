import ResetPasswordContainer from "@/components/reset-password/reset-password-container";
import { redirect } from "next/navigation";

type SearchParams = {
  email: string;
};

const ResetPassword = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { email: encodedEmail } = await searchParams;
  const email = decodeURIComponent(encodedEmail);

  if (!email) {
    redirect("/global-error?type=email-disappear");
  }

  return <ResetPasswordContainer email={email} />;
};

export default ResetPassword;
