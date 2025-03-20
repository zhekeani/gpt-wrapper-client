import Loading from "@/app/[locale]/loading";
import { ReactNode, Suspense } from "react";

const SetupLayout = async ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default SetupLayout;
