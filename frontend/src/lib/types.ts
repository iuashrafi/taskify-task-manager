import type { UniqueIdentifier } from "@dnd-kit/core";

export interface Task {
  id: UniqueIdentifier;
  columnId: string;
  content: string;
}

export interface Column {
  id: UniqueIdentifier;
  title: string;
}
