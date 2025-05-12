"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { appName } from "@/lib/constants";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will go here later
    // For now, we'll just redirect to the login page
    router.push("/login");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign up for {appName}. It&apos;s free!</CardTitle>
          <CardDescription>
            Enter your details below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Repeat Password</Label>
                  <Input id="confirm-password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Sign Up
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
      <div className="text-balance text-center text-xs text-muted-foreground">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}