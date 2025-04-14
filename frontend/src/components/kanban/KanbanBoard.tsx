import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";

import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

import { Column, Task } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";
import {
  createTask,
  reorderTasksInColumn,
  updateColumnOrder,
  updateTask,
} from "@/lib/api";

interface KanbanBoardProps {
  initialColumns: Column[];
}

export function KanbanBoard({ initialColumns }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<Task[]>(
    initialColumns.flatMap((col) => col.tasks || [])
  );

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // @ts-ignore
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  // @ts-ignore
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    console.log("columns = ", columns);
    console.log("tasks = ", tasks);
  }, [columns, tasks]);

  // Update tasks whenever initialColumns changes
  useEffect(() => {
    setTasks(initialColumns.flatMap((column) => column.tasks || []));
  }, [initialColumns]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === "Column") {
      setActiveColumn(activeData.column);
      return;
    }

    if (activeData?.type === "Task") {
      setActiveTask(activeData.task);
      return;
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const activeData = active.data.current;
    if (!activeData) return;

    // Column reordering
    if (activeData.type === "Column") {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      if (activeColumnIndex !== overColumnIndex) {
        const newColumns = arrayMove(
          columns,
          activeColumnIndex,
          overColumnIndex
        );
        setColumns(newColumns);

        try {
          await updateColumnOrder(newColumns);
        } catch (error: any) {
          console.error("Failed to update column order:", error);
          // Revert if API call fails
          setColumns(columns);
          alert(`Failed to save column order: ${error.message}`);
        }
      }
    }
  };

  const handleDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData) return;

    // dropping a Task over another Task
    if (activeData.type === "Task" && overData?.type === "Task") {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];

        if (!activeTask || !overTask) return tasks;

        // If moving to different column
        if (activeTask.columnId !== overTask.columnId) {
          const updatedTask = {
            ...activeTask,
            columnId: overTask.columnId,
            column: overTask.columnId.toString(), // converted to string to fix type error
          };

          updateTask(activeTask._id || activeTask.id.toString(), {
            column: overTask.columnId.toString(),
          }).catch((error) => {
            console.error("Failed to update task:", error);
          });

          return [
            ...tasks.slice(0, activeIndex),
            ...tasks.slice(activeIndex + 1),
            updatedTask,
          ];
        }

        // Same column reordering
        const newTasks = arrayMove(tasks, activeIndex, overIndex);

        reorderTasksInColumn(
          overTask.columnId.toString(),
          newTasks
            .filter((t) => t.columnId === overTask.columnId)
            .map((t) => t._id || t.id.toString())
        ).catch(console.error);

        return newTasks;
      });
    }

    // dropping a Task over a column
    if (activeData.type === "Task" && overData?.type === "Column") {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const activeTask = tasks[activeIndex];

        if (!activeTask) return tasks;

        if (activeTask.columnId !== overId) {
          const updatedTask = {
            ...activeTask,
            columnId: overId as string,
            column: overId as string,
          };

          updateTask(activeTask._id || activeTask.id.toString(), {
            column: overId.toString(),
          }).catch((error) => {
            console.error("Failed to update task:", error);
          });

          return [
            ...tasks.slice(0, activeIndex),
            ...tasks.slice(activeIndex + 1),
            updatedTask,
          ];
        }

        return tasks;
      });
    }
  };

  const onAddTask = async (
    columnId: string | undefined,
    title: string,
    content: string,
    priority: string
  ) => {
    const newTask = {
      title,
      content,
      columnId,
      priority,
    };

    try {
      const createdTask = await createTask(newTask);
      setTasks((prev) => [
        ...prev,
        {
          ...createdTask,
          id: createdTask._id || createdTask.id,
          columnId: createdTask.column || createdTask.columnId,
        },
      ]);
    } catch (error) {
      console.error("Failed to create task:", error);
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
              onAddTask={onAddTask}
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
      <div className="bg-white flex gap-6 p-4 scroll-auto items-start h-full">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
