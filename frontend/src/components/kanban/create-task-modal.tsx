"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateTaskForm } from "./create-task-form";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { CreateTaskModalInterface } from "@/lib/types";

export const CreateTaskModal = ({
  modalTitle,
  columnId,
  task,
  onAddTask,
  onUpdateTask,
  trigger,
}: CreateTaskModalInterface) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: any) => {
    if (task && onUpdateTask) {
      onUpdateTask(task.id, data.title, data.content, data.priority);
      queryClient.invalidateQueries({
        queryKey: ["columns"],
      });
    } else if (onAddTask) {
      onAddTask(columnId, data.title, data.content, data.priority);
      queryClient.invalidateQueries({
        queryKey: ["columns"],
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DialogTrigger asChild>
          {trigger ?? (
            <Button variant="ghost" className="!p-1 h-auto">
              <Plus size={16} />
            </Button>
          )}
        </DialogTrigger>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <CreateTaskForm
          onSubmit={handleSubmit}
          initialValues={
            task
              ? {
                  title: task.title,
                  content: task.content,
                  priority: task.priority as "Normal" | "Medium" | "High",
                }
              : undefined
          }
        />
      </DialogContent>
    </Dialog>
  );
};
