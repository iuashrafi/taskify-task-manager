import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
} from "@dnd-kit/core";

// import { Droppable } from "./Droppable";
// import { Draggable } from "./Draggable";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader } from "../ui/card";
import { GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import { cva } from "class-variance-authority";
import { CSS } from "@dnd-kit/utilities";

// dummy
const tasks = [
  {
    id: 1,
    title: "task 1",
  },
  {
    id: 2,
    title: "task 2",
  },
  {
    id: 3,
    title: "task 3",
  },
  {
    id: 4,
    title: "task 4",
  },
  {
    id: 5,
    title: "task 5",
  },
  {
    id: 6,
    title: "task 6",
  },
  {
    id: 7,
    title: "task 7",
  },
  {
    id: 8,
    title: "task 8",
  },
];

const defaultColumns = [
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
  {
    id: "extra" as const,
    title: "Done",
  },
  {
    id: "test1" as const,
    title: "Done",
  },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState(defaultColumns);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<any>(null);

  // const containers = ["A", "B", "C"];
  // const [parent, setParent] = useState(null);
  // const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>;

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

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={() => {}}
    >
      {/* {parent === null ? draggableMarkup : null}

      {containers.map((id) => (
        // We updated the Droppable component so it would accept an `id`
        // prop and pass it to `useDroppable`
        <Droppable key={id} id={id}>
          {parent === id ? draggableMarkup : "Drop here"}
        </Droppable>
      ))} */}
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <BoardColumn key={col.id} column={col} />
          ))}
        </SortableContext>
      </BoardContainer>
    </DndContext>
  );

  // function handleDragEnd(event) {
  //   const { over } = event;

  //   // If the item is dropped over a container, set it as the parent
  //   // otherwise reset the parent to `null`
  //   setParent(over ? over.id : null);
  // }
}

const BoardContainer = ({ children }: any) => {
  return (
    <ScrollArea>
      <div className="bg-indigo-200 flex gap-6 p-4 scroll-auto">{children}</div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

const BoardColumn = ({ column }: any) => {
  // const { attributes, listeners, setNodeRef, transform } = useDraggable({
  //   id: column.id,
  // });

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
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  // note : this is important - see doc
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "h-[500px] max-h-[500px] w-[350px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      // className={variants({
      //   dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      // })}
      className="border-3 border-dashed p-5 min-h-[500px]  w-[300px] bg-green-300"
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
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

const TaskCard = ({ task }: any) => {
  return <div className="p-4 border my-2">{task.title}</div>;
};
