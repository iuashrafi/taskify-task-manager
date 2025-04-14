import { useState, useEffect, useRef } from "react";
import { PenLine } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserDropdown } from "../user-dropdown";
import { updateProjectName } from "@/lib/api";
import TextareaAutosize from "react-textarea-autosize";
import toast from "react-hot-toast";

export function SiteHeader({ title: initialTitle }: { title: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [isLoading, setIsLoading] = useState(false);
  // @ts-ignore
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditing &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("button")
      ) {
        handleSave();
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, title]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!isEditing) return;

    if (title.trim() === initialTitle) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);

    try {
      await updateProjectName({ projectName: title.trim() });
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to rename");
      setTitle(initialTitle); // revert
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setIsEditing(false);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <header className="bg-white group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-2" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <TextareaAutosize
                ref={textareaRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 w-auto outline-none border-b resize-none bg-transparent text-base font-medium"
                autoFocus
                disabled={isLoading}
              />
            </div>
          ) : (
            <div
              className="font-medium flex space-x-2 items-center hover:underline cursor-pointer"
              onClick={handleEditClick}
            >
              <span className="text-lg">{title}</span>
              <PenLine size={16} />
            </div>
          )}
        </div>

        <div className="ml-auto">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
