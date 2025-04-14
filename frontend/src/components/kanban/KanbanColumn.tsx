import { useMemo } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Ellipsis, GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import { CSS } from "@dnd-kit/utilities";
import { Column, Task } from "@/lib/types";
import { KanbanTaskItem } from "./KanbanTaskItem";
import { CreateTaskModal } from "./create-task-modal";
import { deleteColumn } from "@/lib/api";
import { CreateColumnModal } from "./create-column-modal";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (
    columnId: string | undefined,
    title: string,
    content: string,
    priority: string
  ) => void;
}

export const KanbanColumn = ({
  column,
  tasks,
  onAddTask,
}: KanbanColumnProps) => {
  const queryClient = useQueryClient();
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

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`gap-2 border-none shadow-none p-2 w-[250px] bg-[#f2f5f5] flex flex-col ${
        isDragging ? "opacity-50 z-0" : ""
      }`}
    >
      <CardHeader className="flex flex-row justify-between items-center p-0">
        <div className="py-0.5 px-2 rounded-md bg-[#e3e8e9] flex items-center space-x-1">
          <Button
            variant={"ghost"}
            {...attributes}
            {...listeners}
            className="!p-0.5  bg-transparent hover:bg-transparent text-gray-500 -ml-1 h-auto cursor-grab relative"
          >
            <GripVertical size={16} />
          </Button>
          <span className="text-xs font-light">{column.title}</span>
        </div>
        <div className=" flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="!p-1 h-auto ">
                <Ellipsis size={16} color="#4b4d4d" fill="#4b4d4d" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="w-40">
              <DropdownMenuItem asChild>
                <CreateColumnModal
                  columnId={column._id}
                  initialTitle={column.title}
                  trigger={
                    <div className="hover:bg-gray-100 w-full cursor-pointer text-sm px-2 py-1 rounded-md">
                      Rename
                    </div>
                  }
                  // @ts-ignore
                  onUpdate={(newTitle) => {
                    toast.success("Column Renamed!");
                  }}
                />
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  const confirmed = window.confirm(
                    "Are you sure you want to delete this column and all its tasks?"
                  );
                  if (confirmed) {
                    deleteColumn(column.id.toString())
                      .then(() => {
                        queryClient.invalidateQueries({
                          queryKey: ["columns"],
                        });
                        toast.success("Column deleted");
                      })
                      .catch((error) => {
                        console.error("Failed to delete column:", error);
                      });
                  }
                }}
              >
                <span className="text-red-500">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CreateTaskModal columnId={column._id} onAddTask={onAddTask} />
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 min-h-0">
        <CardContent className="p-0 space-y-2 mb-1.5">
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
