import { useSortable } from "@dnd-kit/sortable";
import { Card } from "../ui/card";
import { Calendar, Flag, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { CSS } from "@dnd-kit/utilities";
import { KanbanTaskItemProps } from "@/lib/types";
import { CreateTaskModal } from "./create-task-modal";
import { deleteTask, updateTask } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const KanbanTaskItem = ({ task }: KanbanTaskItemProps) => {
  const queryClient = useQueryClient();
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

  const handleDeleteTask = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmed) {
      deleteTask(task.id.toString())
        .then(() => {
          toast.success("Task deleted");
          queryClient.invalidateQueries({ queryKey: ["columns"] });
        })
        .catch((error: any) => {
          console.error("Failed to delete task:", error);
          toast.error("Error deleting task");
        });
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={`bg-white !shadow-sm border-none rounded-sm py-0.5 px-2 gap-1 ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      <div className="px-0 py-2 flex items-center relative border-b-2 border-dotted border-gray-200 mb-1">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="!p-1 text-secondary-foreground/50 -ml-1 h-auto cursor-grab"
        >
          <GripVertical size={14} />
        </Button>
        <div className="ml-1 text-sm font-semibold">{task.title}</div>
        <div className="ml-auto flex space-x-1">
          <CreateTaskModal
            modalTitle="Edit Task"
            task={{
              id: task.id.toString(),
              title: task.title,
              content: task.content,
              priority: task.priority ?? "Normal",
              dueDate: task.dueDate ?? new Date().toISOString(),
            }}
            onUpdateTask={(taskId, title, content, priority) => {
              updateTask(taskId, { title, content, priority }).catch(
                (error) => {
                  console.error("Failed to update task:", error);
                  toast.error("Failed to update task!");
                }
              );
            }}
            trigger={
              <Button
                variant="ghost"
                className="!p-1 h-auto cursor-pointer ml-auto"
              >
                <Pencil size={14} className="text-gray-600" />
              </Button>
            }
          />
          <Button
            variant="ghost"
            className="bg-red-50 !p-1 h-auto"
            onClick={handleDeleteTask}
          >
            <Trash2 size={14} className="text-red-500" />
          </Button>
        </div>
      </div>
      <div className="px-1 pb-2">
        <p className="text-sm">{task.content ?? ""} </p>
        {task.dueDate && (
          <div className="mt-2 flex items-center space-x-1">
            <Calendar size={14} />
            <span className="text-xs font-light">
              {task.dueDate.split("T")[0]}
            </span>
          </div>
        )}
        <div className="mt-2">
          <PriorityFlag level={task.priority} />
        </div>
      </div>
    </Card>
  );
};

const PriorityFlag = ({ level }: { level: string | undefined }) => {
  if (!level) level = "Normal";
  let fillColor = "";
  if (!level || level === "Normal") {
    level = "Normal";
    fillColor = "text-blue-500 fill-blue-500";
  } else if (level === "Medium") {
    fillColor = "text-green-500 fill-green-500";
  } else {
    // high priority
    fillColor = "text-red-500 fill-red-500";
  }

  return (
    <div className="flex items-center space-x-1">
      <Flag size={14} className={` ${fillColor}`} />
      <span className="text-xs font-light">{level}</span>
    </div>
  );
};
