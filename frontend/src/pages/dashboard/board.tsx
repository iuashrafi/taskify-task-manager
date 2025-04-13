import { KanbanBoard } from "@/components/kanban/KanbanBoard";

const Board = () => {
  return (
    <div>
      <div>due date | Priority </div>
      <div>
        <KanbanBoard />
      </div>
    </div>
  );
};

export default Board;
