import { CreateColumnModal } from "@/components/kanban/create-column-modal";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const fetchColumns = async () => {
  const res = await api.get("/column");
  const data = res.data;

  return data.map((column: any) => ({
    id: column._id,
    _id: column._id,
    title: column.title,
    order: column.order,
    tasks: column.tasks.map((task: any) => {
      return {
        id: task._id,
        _id: task._id,
        title: task.title,
        content: task.content,
        columnId: column._id,
        column: task.column,
        is_completed: task.is_completed,
        order: task.order,
        priority: task.priority,
        dueDate: task.due_date,
      };
    }),
  }));
};

const Board = () => {
  const { data: columns, isLoading } = useQuery({
    queryKey: ["columns"],
    queryFn: fetchColumns,
  });

  if (isLoading) return <div>Loading Board Data...</div>;

  return (
    <div>
      <div className="bg-white py-2 px-4 border-b flex items-center justify-between">
        <div></div>
        <CreateColumnModal
          trigger={
            <Button variant="default" size="sm" className="text-sm">
              <Plus size={16} /> Add Column
            </Button>
          }
        />
      </div>
      <div>
        <KanbanBoard initialColumns={columns} />
      </div>
    </div>
  );
};

export default Board;
