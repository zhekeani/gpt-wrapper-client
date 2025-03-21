"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ChevronRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogHasOpened = useRef<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const error = searchParams.get("error");
  const prefillEmail = searchParams.get("email")
    ? decodeURIComponent(searchParams.get("email")!)
    : null;
  const state = searchParams.get("reset-state");

  const isSuccess = state === "success";
  const formAction = "/api/auth/forgot-password";

  const onSubmit = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    if (isSuccess && !dialogHasOpened.current) {
      setIsDialogOpen(true);

      const params = new URLSearchParams(searchParams.toString());
      params.delete("reset-state");

      router.replace(`?${params.toString()}`, { scroll: false });
      dialogHasOpened.current = true;
    }
  }, [isSuccess, router, searchParams]);

  return (
    <>
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md ">
            <DialogHeader className="flex flex-col items-center">
              <CheckCircle className="my-6 w-12 h-12 mx-auto text-green-500" />
              <DialogTitle>Link has been sent!</DialogTitle>
              <DialogDescription className="mt-2 text-center">
                A reset password link has been sent to{" "}
                {prefillEmail || "your email address"}. Please check your inbox
                to reset your password.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)} className="w-full">
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your account email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="md:min-w-86">
          <form method="POST" action={formAction} onSubmit={onSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    defaultValue={prefillEmail || undefined}
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Email"
                    required
                  />
                </div>

                {error && (
                  <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-center text-sm text-destructive">
                    {error}
                  </div>
                )}

                {!error && message && (
                  <div className="rounded-md border border-border bg-muted p-3 text-center text-sm text-foreground">
                    {message}
                  </div>
                )}

                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading ? (
                    <LoaderCircle className="animate-spin !aspect-square" />
                  ) : (
                    "Send link"
                  )}
                </Button>
              </div>
              <div className="text-center text-sm flex items-center justify-center gap-1">
                Back to{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 flex items-center"
                >
                  login
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default ForgotPasswordPage;
