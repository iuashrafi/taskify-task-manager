import { ReactNode } from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface FormFieldWrapperProps {
  name: string;
  label: string;
  placeholder?: string;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  control: Control<any>;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  renderInput: (field: any) => ReactNode;
}

const FormFieldWrapper = ({
  name,
  label,
  placeholder,
  control,
  renderInput,
}: FormFieldWrapperProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>{renderInput({ ...field, placeholder })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFieldWrapper;
