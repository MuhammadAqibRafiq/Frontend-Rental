"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { updateHomeAction } from "@/controllers/homes.actions";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Home } from "@/lib/types";

export function EditHomeModal({ home }: { home: Home }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSave() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    setPending(true);
    const result = await updateHomeAction(home.id, undefined, formData);
    setPending(false);

    if (result?.message) {
      toast.error(result.message);
    } else if (result?.errors?.name) {
      toast.error(result.errors.name[0]);
    } else {
      toast.success("Home updated successfully");
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); setOpen(true); }}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title="Edit home"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} title="Edit home" description="Update property name or address.">
        <form ref={formRef} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-home-name">Name *</Label>
            <Input id="edit-home-name" name="name" defaultValue={home.name} placeholder="e.g. Sunny St. Duplex" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-home-address">Address</Label>
            <Input id="edit-home-address" name="address" defaultValue={home.address ?? ""} placeholder="e.g. 12 Garden Road, Lahore" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={pending} onClick={handleSave}>
              {pending ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
