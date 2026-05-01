import * as z from "zod";

export const LoginSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z.string().min(1, { error: "Password is required." }),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }).trim(),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." })
    .regex(/[a-zA-Z]/, { error: "Must contain a letter." })
    .regex(/[0-9]/, { error: "Must contain a number." }),
});

export type LoginFormState =
  | {
      errors?: { email?: string[]; password?: string[] };
      message?: string;
      values?: { email?: string };
    }
  | undefined;

export type RegisterFormState =
  | {
      errors?: { name?: string[]; email?: string[]; password?: string[] };
      message?: string;
      values?: { name?: string; email?: string };
    }
  | undefined;
