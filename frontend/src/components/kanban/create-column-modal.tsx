import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createColumn, updateColumn } from "@/lib/api";

export const CreateColumnModal = ({
  trigger,
  onCreate,
  onUpdate,
  columnId,
  initialTitle = "",
}: {
  trigger?: React.ReactNode;
  onCreate?: () => void;
  onUpdate?: (newTitle: string) => void;
  columnId?: string;
  initialTitle?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
    }
  }, [open, initialTitle]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Title cannot be empty");
      return;
    }

    setLoading(true);
    try {
      if (columnId) {
        await updateColumn(columnId, { title });
        onUpdate?.(title);
      } else {
        await createColumn({ title });
        onCreate?.();
      }
      setOpen(false);
      setTitle("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>{columnId ? "Rename Column" : "Add Column"}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {columnId ? "Rename Column" : "Create New Column"}
          </DialogTitle>
        </DialogHeader>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter column title"
          className="mt-2"
          required
        />
        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? columnId
                ? "Renaming..."
                : "Creating..."
              : columnId
              ? "Rename"
              : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
