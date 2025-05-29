import z from "zod";

export const passwordSchema = z
  .string()
  .trim()
  .max(255)
  .superRefine((value, ctx) => {
    const issues = [];
    if (!/^.{8,}$/.test(value)) {
      issues.push("minLength");
    }

    if (!/[A-Z]/.test(value)) {
      issues.push("uppercase");
    }
    if (!/[a-z]/.test(value)) {
      issues.push("lowercase");
    }
    if (!/\d/.test(value)) {
      issues.push("number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      issues.push("special");
    }

    if (issues.length && value.length !== 0)
      ctx.addIssue({ code: "custom", message: issues.join(",") });

    return value.length === 0 || issues.length === 0;
  });

export const signUpSchema = z
  .object({
    name: z.string().trim().min(3).max(255),
    email: z.string().trim().email(),
    password: passwordSchema,
    confirmPassword: z.string().trim().max(255),
  })
  .refine(
    ({ password, confirmPassword }) => {
      return password === confirmPassword;
    },
    {
      path: ["confirmPassword"],
      message: "password don't match",
    }
  );

export type SignUpSchema = z.infer<typeof signUpSchema>;
