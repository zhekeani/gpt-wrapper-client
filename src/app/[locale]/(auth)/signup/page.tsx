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
import { cn } from "@/lib/utils";
import { CheckCircle, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Signup = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dialogHasOpened = useRef<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const encodedEmail = searchParams.get("email");
  const prefillEmail = encodedEmail ? decodeURIComponent(encodedEmail) : null;
  const state = searchParams.get("signup-state");

  const isSuccess = state === "success";
  const formAction = "/api/auth/signup";

  const onSubmit = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    if (isSuccess && !dialogHasOpened.current) {
      setIsDialogOpen(true);

      const params = new URLSearchParams(searchParams.toString());
      params.delete("signup-state");

      router.replace(`?${params.toString()}`, { scroll: false });
      dialogHasOpened.current = true;
    }
  }, [isSuccess, router, searchParams]);

  return (
    <>
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md text-center">
            <DialogHeader>
              <CheckCircle className="my-6 w-12 h-12 mx-auto text-green-500" />
              <DialogTitle>Sign-up Successful!</DialogTitle>
              <DialogDescription className="mt-2">
                A verification email has been sent to{" "}
                {prefillEmail || "your email address"}. Please check your inbox
                to activate your account.
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

      <div className={cn("flex flex-col gap-6")}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create account</CardTitle>
            <CardDescription>Signup with your Google account</CardDescription>
          </CardHeader>
          <CardContent>
            <form method="POST" action={formAction} onSubmit={onSubmit}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Signup with Google
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 !bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      defaultValue={prefillEmail || undefined}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                    />
                  </div>
                  {message && (
                    <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
                      {message}
                    </p>
                  )}
                  <Button disabled={isLoading} type="submit" className="w-full">
                    {isLoading ? (
                      <LoaderCircle className=" animate-spin !aspect-square" />
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Log in
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </>
  );
};

export default Signup;
