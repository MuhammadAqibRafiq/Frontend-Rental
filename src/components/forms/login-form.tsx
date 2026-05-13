"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/controllers/auth.controller";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className="space-y-5">
      {/* Social buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#ddd6fe] py-2.5 text-sm font-medium text-[#1a0f3c] hover:bg-[#f8f7ff] transition"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#ede9ff]" />
        <span className="text-[11px] font-medium tracking-wide text-[#7c6fa0]">OR WITH EMAIL</span>
        <div className="h-px flex-1 bg-[#ede9ff]" />
      </div>

      <form action={action} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            defaultValue={state?.values?.email ?? ""}
          />
          {state?.errors?.email && (
            <p className="text-xs text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="text-xs font-medium text-[#7c3aed] hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <PasswordInput id="password" name="password" autoComplete="current-password" />
          {state?.errors?.password && (
            <p className="text-xs text-destructive">{state.errors.password[0]}</p>
          )}
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="remember"
            defaultChecked
            className="h-4 w-4 rounded border-[#ddd6fe] accent-[#7c3aed]"
          />
          <span className="text-sm text-[#1a0f3c]">Keep me signed in on this device</span>
        </label>

        {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in →"}
        </Button>
      </form>

      <p className="text-center text-sm text-[#7c6fa0]">
        New to RentalApp?{" "}
        <Link
          href={routes.register}
          className="font-semibold text-[#7c3aed] hover:underline"
        >
          Create an account →
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 814 1000" fill="currentColor">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 411.6 29.7 292.6 34.3 175.8c0-167.8 97.9-256.7 193.5-256.7 60.4 0 110.4 40.2 149 40.2 37 0 96.7-42.7 158.1-42.7 25.8 0 118.6 2.2 178.9 96.5zm-234.9-181.4c27.2-33.2 47.5-79.4 47.5-125.6 0-6.5-.6-13-1.9-18.3-45.3 1.7-99.8 30.2-132.5 64.2-25.2 27.6-48.8 73.8-48.8 120.7 0 7.1 1.3 14.2 1.9 16.5 2.6.3 6.5.9 10.4.9 40.8 0 92.4-27.2 123.4-58.4z"/>
    </svg>
  );
}
