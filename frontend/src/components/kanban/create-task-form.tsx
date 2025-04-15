import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TaskFormSchema, TaskFormValues } from "@/lib/types";
import FormFieldWrapper from "../custom-forms/form-field-wrapper";

interface CreateTaskFormProps {
  onSubmit: (data: TaskFormValues) => void;
  initialValues?: TaskFormValues;
}

export const CreateTaskForm = ({
  onSubmit,
  initialValues,
}: CreateTaskFormProps) => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      content: initialValues?.content ?? "",
      priority: initialValues?.priority ?? "Normal",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const handleFormSubmit = (data: TaskFormValues) => {
    onSubmit(data);
    reset({ title: "", content: "", priority: "Normal" });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <FormFieldWrapper
          name="title"
          label="Title"
          control={form.control}
          renderInput={(field) => <Input {...field} type="text" />}
        />

        <FormFieldWrapper
          name="content"
          label="Content"
          control={form.control}
          renderInput={(field) => <Textarea {...field} />}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {initialValues ? "Update Task" : "Create Task"}
        </Button>
      </form>
    </Form>
  );
};
