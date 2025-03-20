"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

const knownErrors: Record<string, { title: string; message: string }> = {
  "login-failed": {
    title: "Login Failed",
    message:
      "Something went wrong while trying to sign in. Please check your credentials and try again.",
  },
  magicLink: {
    title: "Invalid Magic Link",
    message:
      "This magic link is either expired or invalid. Please request a new one and try again.",
  },
  "missing-reset-token": {
    title: "Unauthorized Access",
    message:
      "You cannot access the reset password page without a valid verification token. Please request a new password reset email.",
  },
};

const statusCodeMap: Record<string, number> = {
  "login-failed": 401,
  magicLink: 400,
  "missing-reset-token": 403,
};

export default function GlobalErrorPage() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("type");

  useEffect(() => {
    console.error("Global error caught:", errorType);
  }, [errorType]);

  const errorContent = knownErrors[errorType || ""] || {
    title: "Something went wrong",
    message: "An unexpected error occurred.",
  };

  const statusCode = statusCodeMap[errorType || ""] || 500;

  return (
    <div className={cn("w-full flex justify-center", inter.className)}>
      <div className="w-full max-w-[680px]">
        <div className="mx-6">
          <div className="mt-[80px] text-center">
            <p className="text-main-text font-light text-xs-sm">
              ERROR OCCURRED
            </p>
            <div className="mt-2">
              <h2 className="text-8xl text-sub-text font-gt-super">
                {statusCode}
              </h2>
            </div>
            <div className="mt-6">
              <h3 className="text-3xl text-main-text font-gt-super">
                {errorContent.title}
              </h3>
            </div>
            <div className="mt-5">
              <p className="font-sohne font-light text-main-text">
                {errorContent.message}
              </p>
            </div>
            <div className="mt-5 flex gap-4 justify-center">
              <Button variant={"outline"}>
                <Link href="/" className="">
                  Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
