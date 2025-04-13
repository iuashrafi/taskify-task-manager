import { useMemo } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader } from "../ui/card";
import { GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import { CSS } from "@dnd-kit/utilities";
import { Column, Task } from "@/lib/types";
import { KanbanTaskItem } from "./KanbanTaskItem";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
}

export const KanbanColumn = ({ column, tasks }: KanbanColumnProps) => {
  const tasksIds = useMemo(() => {
    return tasks.map((task: any) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  // note : this is important - see doc
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`border-3 border-dashed p-5 min-h-[500px]  w-[300px] bg-green-300 ${
        isDragging ? "opacity-50 z-0" : ""
      }`}
    >
      <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className=" p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
        >
          <span className="sr-only">{`Move column: ${column.title}`}</span>
          <GripVertical />
        </Button>
        <span className="ml-auto">{column.title}</span>
      </CardHeader>

      <ScrollArea>
        <CardContent className=" max-h-[500px]">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <KanbanTaskItem key={task.id} task={task} />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};
