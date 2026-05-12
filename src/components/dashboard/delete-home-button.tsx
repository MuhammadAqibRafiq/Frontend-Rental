"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteHomeAction } from "@/controllers/homes.actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export function DeleteHomeButton({ homeId, homeName }: { homeId: string; homeName: string }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    await deleteHomeAction(homeId);
    setOpen(false);
    setPending(false);
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} title="Delete home">
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} title="Delete Home">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <span className="font-semibold text-foreground">{homeName}</span>?
          This will also remove all associated tenants.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={pending}>
            {pending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
