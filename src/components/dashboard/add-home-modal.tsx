"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { createHomeAction } from "@/controllers/homes.actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddHomeModal() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createHomeAction, undefined);

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        <span className="md:hidden">Home</span>
        <span className="hidden md:inline">Add Home</span>
      </Button>

      <Dialog open={open} onClose={handleClose} title="Create a home 🏠" description="Add a new property to manage.">
        <form action={action} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="home-name">Name *</Label>
            <Input id="home-name" name="name" placeholder="e.g. Sunny St. Duplex" />
            {state?.errors?.name && <p className="text-xs text-destructive">{state.errors.name[0]}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="home-address">Address</Label>
            <Input id="home-address" name="address" placeholder="e.g. 12 Garden Road, Lahore" />
          </div>

          {state?.message && <p className="text-sm text-destructive">{state.message}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save Home"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
