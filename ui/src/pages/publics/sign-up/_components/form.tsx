import { RHFForm } from "@/components/rhf/rhf-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFInput } from "@/components/rhf/rhf-input";
import { Loader2, LockKeyhole, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { ApiRegister } from "@/api/endpoints";
import { Link, useNavigate } from "react-router";
import type { ApiError, RegisterBodyType } from "@/api/api-types";
import { signUpSchema, type SignUpSchema } from "./schema";

const passwordConstraintContent: {
  id: number;
  name: string;
  message: string;
}[] = [
  {
    id: 1,
    name: "minLength",
    message: "Password must be at least 6 characters",
  },
  {
    id: 2,
    name: "lowercase",
    message: "Must contain at least one lowercase letter",
  },
  {
    id: 3,
    name: "uppercase",
    message: "Must contain at least one uppercase letter",
  },
  {
    id: 4,
    name: "number",
    message: "Must contain at least one number",
  },
  {
    id: 5,
    name: "special",
    message: "Must contain at least one special character",
  },
];

export const SignUpForm = () => {
  const navigate = useNavigate();

  const forms = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (body: RegisterBodyType) => ApiRegister(body),
    onSuccess: ({ message }) => {
      if (message) {
        navigate("/");
      }
    },
    onError: ({ response: { data } }: ApiError) => {
      console.error(data.error);
      if (data.error === "Email already in use") {
        forms.setError("email", { message: data.error });
      }
    },
  });

  const handleLogin = ({ name, email, password }: SignUpSchema) => {
    if (isPending) return;
    mutate({ name, email, password });
  };

  const errors = forms.formState.errors["password"]?.message?.split(",") || [];
  const passwordFieldHasValue = !!forms.watch("password");

  return (
    <RHFForm methods={forms}>
      <form
        onSubmit={forms.handleSubmit(handleLogin, (error) => {
          console.log("Login form validade issues >>", error);
        })}
        className="space-y-4">
        <RHFInput<SignUpSchema>
          label="Name"
          name="name"
          iconLeft={() => <User className="text-blue-400" />}
          placeholder=""
          type="text"
        />
        <RHFInput<SignUpSchema>
          label="Email"
          name="email"
          iconLeft={() => <Mail className="text-blue-400" />}
          placeholder="example@gmail.com"
          type="email"
        />
        <RHFInput<SignUpSchema>
          label="Password"
          name="password"
          type="password"
          iconLeft={() => <LockKeyhole className="text-blue-400" />}
          placeholder="••••••••••••"
          showIssue={false}
        />
        <div className="flex flex-col gap-.5">
          {passwordConstraintContent.map((child) => (
            <div
              key={child.id}
              className={`text-sm flex flex-row items-center gap-x-2 ${
                !passwordFieldHasValue
                  ? "text-zinc-600"
                  : errors.includes(child.name)
                  ? "text-red-400"
                  : "text-green-400"
              }`}>
              <p
                aria-live="polite"
                aria-atomic="true"
                aria-describedby="helper message">
                {!passwordFieldHasValue
                  ? "🔹"
                  : errors.includes(child.name)
                  ? "❌"
                  : "✅"}{" "}
                {child.message}
              </p>
            </div>
          ))}
        </div>

        <RHFInput<SignUpSchema>
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          iconLeft={() => <LockKeyhole className="text-blue-400" />}
          placeholder="••••••••••••"
          showIssue
        />
        <div className="w-full inline-flex items-center mt-1">
          <p className="ml-auto text-sm text-zinc-800 font-semibold">
            Did you remember?{" "}
            <Link
              className="hover:underline hover:text-blue-500 underline-offset-2"
              to={"/"}>
              Sign in
            </Link>
          </p>
        </div>
        <Button disabled={isPending} variant="blue">
          {isPending && <Loader2 className="animate-spin" />}
          Register
        </Button>
      </form>
    </RHFForm>
  );
};
