import { RHFForm } from "@/components/rhf/rhf-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RHFInput } from "@/components/rhf/rhf-input";
import { LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const signInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim(),
});

type SignInSchema = z.infer<typeof signInSchema>;

export function SignIn() {
  const forms = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="w-full space-y-2">
        <h2 className="text-xl text-zinc-800 font-semibold">Welcome back!</h2>
        <p className="text-sm text-zinc-600">
          Start managing your finance faster and batter
        </p>
      </div>
      <RHFForm methods={forms}>
        <form className="space-y-4">
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
          <Button className="bg-blue-500 hover:bg-blue-400 w-full py-5">
            Login
          </Button>
        </form>
      </RHFForm>
    </div>
  );
}
