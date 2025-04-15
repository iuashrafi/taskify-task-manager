import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { Form } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormSchema, SignupFormValues } from "@/lib/types";
import FormFieldWrapper from "../custom-forms/form-field-wrapper";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { register } = useAuthContext();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
  });

  const onSubmit = async (values: SignupFormValues) => {
    console.log(values);
    const { email, password, username } = values;
    const result = await register({ username, email, password });
    if (!result.success) {
      toast.error(result.message ?? "Something went wrong!");
    } else {
      toast.success("Account created");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Sign up</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <FormFieldWrapper
          name="username"
          label="Username"
          placeholder="imtiaz"
          control={form.control}
          renderInput={(field) => <Input {...field} />}
        />

        <FormFieldWrapper
          name="email"
          label="Email"
          placeholder="imtiaz@example.com"
          control={form.control}
          renderInput={(field) => <Input {...field} />}
        />

        <FormFieldWrapper
          name="password"
          label="Password"
          placeholder="Password"
          control={form.control}
          renderInput={(field) => <Input {...field} type="password" />}
        />

        <Button type="submit" className="w-full">
          Sign up
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
