import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";

// import { Droppable } from "./Droppable";
// import { Draggable } from "./Draggable";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

import { Column, Task } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";

const initialTasks: Task[] = [
  {
    id: "task1",
    columnId: "done",
    content: "Project initiation and planning",
  },
  {
    id: "task2",
    columnId: "done",
    content: "Gather requirements from stakeholders",
  },
  {
    id: "task3",
    columnId: "done",
    content: "Create wireframes and mockups",
  },
  {
    id: "task4",
    columnId: "in-progress",
    content: "Develop homepage layout",
  },
  {
    id: "task5",
    columnId: "in-progress",
    content: "Design color scheme and typography",
  },
  {
    id: "task6",
    columnId: "todo",
    content: "Implement user authentication",
  },
  {
    id: "task7",
    columnId: "todo",
    content: "Build contact us page",
  },
  {
    id: "task8",
    columnId: "todo",
    content: "Create product catalog",
  },
  {
    id: "task9",
    columnId: "todo",
    content: "Develop about us page",
  },
  {
    id: "task10",
    columnId: "todo",
    content: "Optimize website for mobile devices",
  },
  {
    id: "task11",
    columnId: "todo",
    content: "Integrate payment gateway",
  },
  {
    id: "task12",
    columnId: "todo",
    content: "Perform testing and bug fixing",
  },
  {
    id: "task13",
    columnId: "todo",
    content: "Launch website and deploy to server",
  },
];

const defaultColumns: Column[] = [
  {
    id: "todo" as const,
    title: "Todo",
  },
  {
    id: "in-progress" as const,
    title: "In progress",
  },
  {
    id: "done" as const,
    title: "Done",
  },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  // const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    console.log("columns = ", columns);
  }, [columns]);

  const handleDragStart = (event: DragStartEvent) => {
    console.log("draggingg.... (started)");
    console.log(`drag start end  = `, event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log(`Dragging ended`);
    console.log(`drag end event = `, event);

    setActiveColumn(null);
    // setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];
        if (
          activeTask &&
          overTask &&
          activeTask.columnId !== overTask.columnId
        ) {
          activeTask.columnId = overTask.columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const activeTask = tasks[activeIndex];
        if (activeTask) {
          activeTask.columnId = overId as string; // as ColumnId
          return arrayMove(tasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={tasks.filter((task: any) => task.columnId === col.id)}
            />
          ))}
        </SortableContext>
      </BoardContainer>
    </DndContext>
  );
}

const BoardContainer = ({ children }: any) => {
  return (
    <ScrollArea>
      <div className="bg-indigo-200 flex gap-6 p-4 scroll-auto">{children}</div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
