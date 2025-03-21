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
import { removeResetPasswordToken } from "@/lib/auth/reset-password";
import { CheckCircle, LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ContainerProps {
  email: string;
}

const ResetPasswordContainer = ({ email: initialEmail }: ContainerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const dialogHasOpened = useRef<boolean>(false);
  const initialLoad = useRef<boolean>(true);

  const searchParams = useSearchParams();
  const router = useRouter();

  const message = searchParams.get("message");
  const error = searchParams.get("error");
  const state = searchParams.get("reset-state");

  const isSuccess = state === "success";
  const formAction = "/api/auth/reset-password";

  const onSubmit = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    if (initialEmail && initialLoad.current) {
      setEmail(initialEmail);

      const params = new URLSearchParams(searchParams.toString());
      params.delete("email");

      router.replace(`?${params.toString()}`, { scroll: false });

      initialLoad.current = false;
    }
  }, [initialEmail, router, searchParams]);

  useEffect(() => {
    if (isSuccess && !dialogHasOpened.current) {
      setIsDialogOpen(true);

      setTimeout(() => {
        removeResetPasswordToken();
        router.push("/login");
      }, 3000);

      const params = new URLSearchParams(searchParams.toString());
      params.delete("reset-state");

      router.replace(`?${params.toString()}`, { scroll: false });
      dialogHasOpened.current = true;
    }
  }, [isSuccess, router, searchParams]);

  useEffect(() => {
    if (!initialEmail && !email) {
      router.push("/global-error?type=email-disappear");
    }
  }, [email, initialEmail, router]);

  return (
    <>
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md ">
            <DialogHeader className="flex flex-col items-center">
              <CheckCircle className="my-6 w-12 h-12 mx-auto text-green-500" />
              <DialogTitle>Reset password success!</DialogTitle>
              <DialogDescription className="mt-2 text-center">
                You will be redirected to the login page.
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
                    name="email"
                    id="email"
                    type="email"
                    value={email || ""}
                    className="hidden"
                    readOnly
                  />
                  <Input
                    value={email || ""}
                    disabled
                    name="displayed-email"
                    id="displayed-email"
                    type="email"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
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
                    "Reset password"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default ResetPasswordContainer;
