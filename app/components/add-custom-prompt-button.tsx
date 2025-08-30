"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { usePrompt } from "../Context/CustomPromptButtonContext";

export function AddPromptButton({ pageKey }: { pageKey: string }) {
  const [open, setOpen] = useState(false);
  const { setPrompt, getPrompt } = usePrompt();

  const [localPrompt, setLocalPrompt] = useState(getPrompt(pageKey));

  const handleConfirm = () => {
    setPrompt(pageKey, localPrompt.trim());
    setOpen(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Add Custom Prompt
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Your Custom Prompt Here</DialogTitle>
          </DialogHeader>

          <Textarea
            placeholder="Enter your custom prompt here..."
            value={localPrompt}
            className="w-full h-40 mb-4"
            onChange={(e) => setLocalPrompt(e.target.value)}
          />

          <DialogFooter>
            <Button variant="secondary" onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
