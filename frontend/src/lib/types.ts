import type { UniqueIdentifier } from "@dnd-kit/core";

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
}

export interface Column {
  id: UniqueIdentifier;
  _id?: string;
  title: string;
  order?: number;
  tasks?: Task[];
}
