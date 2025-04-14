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

interface CreateTaskModalInterface {
  columnId?: string | undefined;
  task?: {
    id: string;
    title: string;
    content: string;
    priority: string;
  };
  onAddTask?: (
    columnId: string | undefined,
    title: string,
    content: string,
    priority: string
  ) => void;

  onUpdateTask?: (
    taskId: string,
    title: string,
    content: string,
    priority: string
  ) => void;

  trigger?: React.ReactNode;
}

export const CreateTaskModal = ({
  columnId,
  task,
  onAddTask,
  onUpdateTask,
  trigger,
}: CreateTaskModalInterface) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: any) => {
    if (task && onUpdateTask) {
      console.log("updating task : ", {
        id: task.id,
        title: data.title,
        content: data.content,
        priority: data.priority,
      });
      onUpdateTask(task.id, data.title, data.content, data.priority);
    } else if (onAddTask) {
      onAddTask(columnId, data.title, data.content, data.priority);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DialogTrigger asChild>
          {trigger ?? (
            <Button variant="ghost" className="!p-1  h-auto">
              <Plus size={16} />
            </Button>
          )}
        </DialogTrigger>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create a new task"}</DialogTitle>
        </DialogHeader>
        <CreateTaskForm
          onSubmit={handleSubmit}
          initialValues={
            task
              ? {
                  title: task.title,
                  content: task.content,
                  priority: task.priority,
                }
              : undefined
          }
        />
      </DialogContent>
    </Dialog>
  );
};
