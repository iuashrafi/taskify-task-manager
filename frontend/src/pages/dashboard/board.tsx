import { CreateColumnModal } from "@/components/kanban/create-column-modal";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Column } from "@/lib/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

const Board = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    api
      .get("/column")
      .then((res) => {
        const data = res.data;
        console.log("columns fetched = ", data);

        const transformedColumns = data.map((column: any) => ({
          id: column._id,
          _id: column._id,
          title: column.title,
          order: column.order,
          tasks: column.tasks.map((task: any) => ({
            id: task._id,
            _id: task._id,
            title: task.title,
            content: task.content,
            columnId: column._id,
            column: task.column,
            is_completed: task.is_completed,
            order: task.order,
            priority: task.priority,
          })),
        }));

        setColumns(transformedColumns);
        setLoading(false);
      })
      .catch((err) => {
        console.log("error = ", err);
      });
  }, []);

  if (loading) return <div>Loading Board Data....</div>;

  return (
    <div>
      <div className="bg-white py-2 px-4 border-b flex items-center justify-between">
        <div>{/* Due Date | Priority | Filters  */}</div>
        <CreateColumnModal
          trigger={
            <Button variant="default" size="sm" className="text-sm">
              <Plus size={16} /> Add Column
            </Button>
          }
          onCreate={() => {}}
        />
      </div>
      <div className="">
        <KanbanBoard initialColumns={columns} />
      </div>
    </div>
  );
};

export default Board;
