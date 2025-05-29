import { SignInForm } from "./_components/form";

export function SignIn() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="w-full space-y-2">
        <h2 className="text-3xl text-zinc-700 font-semibold">Welcome back!</h2>
        <p className="text-sm text-zinc-600">
          Start managing your finance faster and batter
        </p>
      </div>
      <SignInForm />
    </div>
  );
}
