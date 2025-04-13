import { useDroppable } from "@dnd-kit/core";

export function Droppable(props: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div className="border border-dashed p-8" ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
