import { RHFForm } from "@/components/rhf/rhf-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RHFInput } from "@/components/rhf/rhf-input";
import { LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { ApiLogin } from "@/api/endpoints";
import { cookie } from "@/lib/cookies";
import { Link, useNavigate } from "react-router";
import type { ApiError } from "@/api/api-types";

const signInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(1),
});

type SignInSchema = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const navigate = useNavigate();

  const forms = useForm({
    resolver: zodResolver(signInSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (body: SignInSchema) => ApiLogin(body),
    onSuccess: ({ token }) => {
      if (token) {
        cookie.setCookie("access_token", token, {});
        navigate("/dashboard", { replace: true });
      }
    },
    onError: ({ response: { data } }: ApiError) => {
      console.error(data);
      if (data.error === "Invalid credentials") {
        forms.setError("email", { message: data.error });
        forms.setError("password", { message: data.error });
      }
    },
  });

  const handleLogin = ({ email, password }: SignInSchema) => {
    if (isPending) return;
    mutate({ email, password });
  };

  return (
    <RHFForm methods={forms}>
      <form
        onSubmit={forms.handleSubmit(handleLogin, (error) => {
          console.log("Login form validade issues >>", error);
        })}
        className="space-y-4">
        <RHFInput<SignInSchema>
          label="Email"
          name="email"
          iconLeft={() => <Mail className="text-blue-400" />}
          placeholder="example@gmail.com"
        />
        <RHFInput<SignInSchema>
          label="Password"
          name="password"
          type="password"
          iconLeft={() => <LockKeyhole className="text-blue-400" />}
          placeholder="••••••••••••"
        />
        <div className="w-full inline-flex items-center mt-1">
          <p className="ml-auto text-sm text-zinc-800 font-semibold">
            Don't have an account?{" "}
            <Link
              className="hover:underline hover:text-blue-500 underline-offset-2"
              to={"/sign-up"}>
              Sign up
            </Link>
          </p>
        </div>
        <Button variant="blue">Login</Button>
      </form>
    </RHFForm>
  );
};
