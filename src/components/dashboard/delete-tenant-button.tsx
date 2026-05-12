"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteTenantAction } from "@/controllers/tenants.actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export function DeleteTenantButton({
  tenantId,
  tenantName,
  homeId,
}: {
  tenantId: string;
  tenantName: string;
  homeId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    await deleteTenantAction(tenantId, homeId);
    setOpen(false);
    setPending(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
        title="Delete tenant"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} title="Delete Tenant">
        <p className="text-sm text-muted-foreground">
          Remove <span className="font-semibold text-foreground">{tenantName}</span> from this home?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={pending}>
            {pending ? "Removing…" : "Remove"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
