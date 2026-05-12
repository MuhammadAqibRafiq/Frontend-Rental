"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { apiUrls } from "@/lib/api-urls";
import { routes } from "@/lib/routes";

export type HomeFormState =
  | { errors?: { name?: string[]; address?: string[] }; message?: string }
  | undefined;

export async function createHomeAction(
  _state: HomeFormState,
  formData: FormData,
): Promise<HomeFormState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim();

  if (!name) return { errors: { name: ["Name is required."] } };

  try {
    await apiFetch(apiUrls.homes.list, {
      method: "POST",
      body: { name, address: address || undefined },
    });
    revalidatePath(routes.dashboard);
  } catch (err) {
    return { message: err instanceof Error ? err.message : "Failed to create home." };
  }
}

export async function updateHomeAction(
  id: string,
  _state: HomeFormState,
  formData: FormData,
): Promise<HomeFormState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim();

  if (!name) return { errors: { name: ["Name is required."] } };

  try {
    await apiFetch(apiUrls.homes.detail(id), {
      method: "PUT",
      body: { name, address: address || undefined },
    });
    revalidatePath(routes.dashboard);
  } catch (err) {
    return { message: err instanceof Error ? err.message : "Failed to update home." };
  }
}

export async function deleteHomeAction(id: string): Promise<void> {
  await apiFetch(apiUrls.homes.detail(id), { method: "DELETE" });
  revalidatePath(routes.dashboard);
  redirect(routes.dashboard);
}
