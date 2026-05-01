"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { ApiError, apiFetch } from "@/lib/api";
import { apiUrls } from "@/lib/api-urls";
import { routes } from "@/lib/routes";
import { LoginSchema, RegisterSchema, type LoginFormState, type RegisterFormState } from "@/lib/schemas";
import { clearSessionToken, setSessionToken } from "@/lib/session";
import type { AuthResponse } from "@/lib/types";

export async function loginAction(_state: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const email = (formData.get("email") ?? "").toString();
  const password = (formData.get("password") ?? "").toString();

  const parsed = LoginSchema.safeParse({ email, password });

  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: { email } };
  }

  try {
    const data = await apiFetch<AuthResponse>(apiUrls.auth.login, {
      method: "POST",
      body: parsed.data,
      auth: false,
    });
    await setSessionToken(data.token);
  } catch (err) {
    return {
      message: err instanceof ApiError ? err.message : "Login failed. Try again.",
      values: { email },
    };
  }

  redirect(routes.dashboard);
}

export async function registerAction(
  _state: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const name = (formData.get("name") ?? "").toString();
  const email = (formData.get("email") ?? "").toString();
  const password = (formData.get("password") ?? "").toString();

  const parsed = RegisterSchema.safeParse({ name, email, password });

  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: { name, email } };
  }

  try {
    const data = await apiFetch<AuthResponse>(apiUrls.auth.register, {
      method: "POST",
      body: parsed.data,
      auth: false,
    });
    await setSessionToken(data.token);
  } catch (err) {
    return {
      message: err instanceof ApiError ? err.message : "Registration failed. Try again.",
      values: { name, email },
    };
  }

  redirect(routes.dashboard);
}

export async function logoutAction() {
  await clearSessionToken();
  redirect(routes.home);
}

function fieldErrors(error: ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}
