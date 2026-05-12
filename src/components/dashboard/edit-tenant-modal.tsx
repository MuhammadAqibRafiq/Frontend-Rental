"use client";

import { useActionState, useState, useEffect } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { updateTenantAction } from "@/controllers/tenants.actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import type { ChargeKind, Tenant } from "@/lib/types";

interface ChargeRow {
  label: string;
  chargeType: ChargeKind;
  amount: string;
}

interface EditTenantModalProps {
  tenant: Tenant;
}

export function EditTenantModal({ tenant }: EditTenantModalProps) {
  const [open, setOpen] = useState(false);

  const boundAction = updateTenantAction.bind(null, tenant.id);
  const [state, action, pending] = useActionState(boundAction, undefined);

  useEffect(() => {
    if (!pending && state === undefined && open) handleClose();
  }, [pending]);

  const [charges, setCharges] = useState<ChargeRow[]>(() =>
    tenant.charges.map((c) => ({
      label: c.label,
      chargeType: c.chargeType,
      amount: c.chargeType === "fixed" ? String(c.amount ?? "") : "",
    })),
  );


  function addCharge() {
    setCharges((prev) => [...prev, { label: "", chargeType: "fixed", amount: "" }]);
  }

  function removeCharge(i: number) {
    setCharges((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateCharge(i: number, field: keyof ChargeRow, value: string) {
    setCharges((prev) =>
      prev.map((c, idx) => {
        if (idx !== i) return c;
        const updated = { ...c, [field]: value };
        if (field === "chargeType" && value === "variable") updated.amount = "";
        return updated;
      }),
    );
  }

  function handleOpen() {
    setCharges(
      tenant.charges.map((c) => ({
        label: c.label,
        chargeType: c.chargeType,
        amount: c.chargeType === "fixed" ? String(c.amount ?? "") : "",
      })),
    );
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title="Edit tenant"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        title="Edit Tenant"
        description="Update tenant info and charges."
        className="max-w-xl"
      >
        <form action={action} className="space-y-5">
          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Name *</Label>
              <Input id="edit-name" name="name" defaultValue={tenant.name} placeholder="Full name" />
              {state?.errors?.name && (
                <p className="text-xs text-destructive">{state.errors.name[0]}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-unit">Unit</Label>
              <Input id="edit-unit" name="unit" defaultValue={tenant.unit ?? ""} placeholder="e.g. Floor 1, Shop 2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <PhoneInput name="phone" defaultValue={tenant.phone ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-active">Status</Label>
              <select
                id="edit-active"
                name="active"
                defaultValue={tenant.active ? "true" : "false"}
                className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* Charges */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Charges</Label>
              <button
                type="button"
                onClick={addCharge}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Plus className="h-3 w-3" /> Add field
              </button>
            </div>

            <div className="space-y-2 rounded-lg border border-border p-3">
              {charges.map((charge, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    name="chargeLabel"
                    placeholder="e.g. Rent"
                    value={charge.label}
                    onChange={(e) => updateCharge(i, "label", e.target.value)}
                    className="flex-1"
                  />
                  <select
                    name="chargeType"
                    value={charge.chargeType}
                    onChange={(e) => updateCharge(i, "chargeType", e.target.value)}
                    className="h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="variable">Variable</option>
                  </select>

                  {charge.chargeType === "fixed" ? (
                    <Input
                      name="chargeAmount"
                      type="number"
                      min="0"
                      placeholder="Amount"
                      value={charge.amount}
                      onChange={(e) => updateCharge(i, "amount", e.target.value)}
                      className="w-28"
                    />
                  ) : (
                    <>
                      <input type="hidden" name="chargeAmount" value="" />
                      <span className="w-28 text-xs text-muted-foreground italic px-1">entered on bill</span>
                    </>
                  )}

                  {charges.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCharge(i)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {state?.errors?.charges && (
              <p className="text-xs text-destructive">{state.errors.charges[0]}</p>
            )}
          </div>

          {charges.some((c) => c.label) && (
            <div className="rounded-lg bg-muted/50 border border-border px-4 py-3">
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Monthly Formula</p>
              <div className="flex flex-wrap items-center gap-1.5 text-sm">
                {charges.filter((c) => c.label).map((c, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-muted-foreground">+</span>}
                    <span className="capitalize font-semibold">{c.label}</span>
                  </span>
                ))}
                <span className="text-muted-foreground">+</span>
                <span className="font-semibold">Previous Balance</span>
                <span className="text-muted-foreground">−</span>
                <span className="font-semibold text-red-500">Amount Received</span>
                <span className="text-muted-foreground">=</span>
                <span className="font-bold text-primary">Total</span>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground rounded-lg border border-dashed border-border px-3 py-2">
            <span className="font-semibold text-foreground">Previous balance</span> and <span className="font-semibold text-foreground">amount received</span> are entered at the time of bill generation.
          </p>

          {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
