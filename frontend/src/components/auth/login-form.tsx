import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { LoginFormValues, LoginFormSchema } from "@/lib/types";
import FormFieldWrapper from "../custom-forms/form-field-wrapper";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { login } = useAuthContext();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    console.log(values);
    const { email, password } = values;
    const result = await login({ email, password });
    if (!result.success) {
      toast.error(result.message ?? "Something went wrong!");
    } else {
      toast.success("Logging in...");
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-4", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

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
          Login
        </Button>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
