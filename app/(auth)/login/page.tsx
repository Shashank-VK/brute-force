import Link from "next/link";
import { Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FloatingOrbs } from "@/components/ui/floating-orbs";
import { login } from "../actions";

type AuthSearchParams = {
  mode?: string;
  error?: string;
  signup?: string;
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: AuthSearchParams;
}) {
  const mode = searchParams?.mode === "admin" ? "admin" : "student";
  const isAdminMode = mode === "admin";

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-base px-6 py-12" style={{ background: "linear-gradient(135deg, #fefae0 0%, #faedcd 50%, #e9edc9 100%)" }}>
      <FloatingOrbs variant="auth" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Terminal className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-xl tracking-wide text-heading">BRUTE FORCE</span>
          </Link>
          <h1 className="text-2xl font-bold text-heading">Welcome back</h1>
          <p className="text-muted mt-1">
            {isAdminMode ? "Sign in to the admin control center" : "Sign in to your student account"}
          </p>
        </div>

        <Card>
          <form>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-hover-bg/70 p-1">
                <Link
                  href="/login?mode=student"
                  className={`rounded-lg px-3 py-2 text-center text-sm font-medium transition-colors ${
                    !isAdminMode ? "bg-surface text-heading shadow-sm" : "text-muted hover:text-heading"
                  }`}
                >
                  Student
                </Link>
                <Link
                  href="/login?mode=admin"
                  className={`rounded-lg px-3 py-2 text-center text-sm font-medium transition-colors ${
                    isAdminMode ? "bg-surface text-heading shadow-sm" : "text-muted hover:text-heading"
                  }`}
                >
                  Admin
                </Link>
              </div>

              {searchParams?.signup === "success" ? (
                <CardDescription className="rounded-lg border border-success/40 bg-success/10 p-3 text-success">
                  Account created. Sign in to continue.
                </CardDescription>
              ) : null}

              {searchParams?.error ? (
                <CardDescription className="rounded-lg border border-error/40 bg-error/10 p-3 text-error">
                  {searchParams.error}
                </CardDescription>
              ) : null}

              <input type="hidden" name="role" value={isAdminMode ? "ADMIN" : "MEMBER"} readOnly />

              <div className="space-y-2">
                <Label htmlFor="email" className="text-body">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-body">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Your password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 p-6 pt-0">
              <Button formAction={login} className="w-full" size="lg">
                Sign In
              </Button>
              <p className="text-sm text-muted text-center">
                Don&apos;t have an account?{" "}
                <Link href={`/signup?mode=${mode}`} className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
