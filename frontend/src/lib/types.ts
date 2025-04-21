import type { UniqueIdentifier } from "@dnd-kit/core";
import { z } from "zod";
export interface Task {
  id: UniqueIdentifier;
  _id?: string;
  title: string;
  content: string;
  columnId: UniqueIdentifier;
  column?: string;
  is_completed?: boolean;
  order?: number;
  priority?: string;
  dueDate?: string;
}

export interface Column {
  id: UniqueIdentifier;
  _id?: string;
  title: string;
  order?: number;
  tasks?: Task[];
}

export interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (
    columnId: string | undefined,
    title: string,
    content: string,
    priority: string,
    dueDate: string
  ) => void;
}

export interface KanbanTaskItemProps {
  task: Task;
}

export interface CreateTaskModalInterface {
  modalTitle: string;
  columnId?: string | undefined;
  task?: {
    id: string;
    title: string;
    content: string;
    priority: string;
    dueDate: string;
  };
  onAddTask?: (
    columnId: string | undefined,
    title: string,
    content: string,
    priority: string,
    dueDate: string
  ) => void;

  onUpdateTask?: (
    taskId: string,
    title: string,
    content: string,
    priority: string
  ) => void;

  trigger?: React.ReactNode;
}

// Form Schemas

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;

export const SignupFormSchema = z.object({
  username: z.string().min(3),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type SignupFormValues = z.infer<typeof SignupFormSchema>;

export const TaskFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  priority: z.enum(["Normal", "Medium", "High"], {
    required_error: "Priority is required",
  }),
  dueDate: z.string(),
});

export type TaskFormValues = z.infer<typeof TaskFormSchema>;
