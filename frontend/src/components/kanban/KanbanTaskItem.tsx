import { useSortable } from "@dnd-kit/sortable";
import { CardHeader } from "../ui/card";
import { GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import { CSS } from "@dnd-kit/utilities";

export const KanbanTaskItem = ({ task }: any) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 border my-2 ${isDragging ? "opacity-30" : ""}`}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row  relative">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
        >
          <span className="sr-only">Move task</span>
          <GripVertical />
        </Button>
        <div>{task.content}</div>
      </CardHeader>
    </div>
  );
};
