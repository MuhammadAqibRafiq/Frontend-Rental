"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";
import { apiUrls } from "@/lib/api-urls";
import { routes } from "@/lib/routes";
import type { ChargeKind } from "@/lib/types";

export type TenantFormState =
  | { errors?: { name?: string[]; homeId?: string[]; charges?: string[] }; message?: string }
  | undefined;

function parseCharges(formData: FormData) {
  const labels = formData.getAll("chargeLabel").map((v) => v.toString().trim());
  const kinds = formData.getAll("chargeType") as ChargeKind[];
  const amounts = formData.getAll("chargeAmount");

  return labels
    .map((label, i) => {
      const chargeType = kinds[i] ?? "fixed";
      const amount = Number(amounts[i]) || undefined;
      return chargeType === "fixed"
        ? { label, chargeType, amount: amount ?? 0 }
        : { label, chargeType };
    })
    .filter((c) => c.label);
}

export async function createTenantAction(
  _state: TenantFormState,
  formData: FormData,
): Promise<TenantFormState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const unit = formData.get("unit")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const homeId = formData.get("homeId")?.toString() ?? "";

  if (!name) return { errors: { name: ["Name is required."] } };
  if (!homeId) return { errors: { homeId: ["Home is required."] } };

  const charges = parseCharges(formData);
  if (charges.length === 0) return { errors: { charges: ["Add at least one charge with a label."] } };

  try {
    await apiFetch(apiUrls.tenants.create, {
      method: "POST",
      body: { homeId, name, unit: unit || undefined, phone: phone || undefined, charges },
    });
    revalidatePath(routes.dashboard);
  } catch (err) {
    return { message: err instanceof Error ? err.message : "Failed to create tenant." };
  }
}

export async function updateTenantAction(
  id: string,
  _state: TenantFormState,
  formData: FormData,
): Promise<TenantFormState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const unit = formData.get("unit")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const active = formData.get("active") === "true";

  if (!name) return { errors: { name: ["Name is required."] } };

  const charges = parseCharges(formData);
  if (charges.length === 0) return { errors: { charges: ["Add at least one charge with a label."] } };

  try {
    await apiFetch(apiUrls.tenants.detail(id), {
      method: "PUT",
      body: { name, unit: unit || undefined, phone: phone || undefined, charges, active },
    });
    revalidatePath(routes.dashboard);
    revalidatePath(routes.users);
  } catch (err) {
    return { message: err instanceof Error ? err.message : "Failed to update tenant." };
  }
}

export async function deleteTenantAction(id: string, homeId: string): Promise<void> {
  await apiFetch(apiUrls.tenants.detail(id), { method: "DELETE" });
  revalidatePath(`${routes.dashboard}?home=${homeId}`);
  revalidatePath(routes.users);
}
