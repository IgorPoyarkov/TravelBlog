// src/Shared/Schemas/password.schema.ts
import { z } from "zod";

export const PasswordValidation = z
  .string()
  .min(6, "Пароль должен быть не менее 6 символов");

export const withPasswordConfirmation = <T extends z.ZodTypeAny>(schema: T) => {
  return schema.superRefine((data, ctx) => {
    const { password, confirmPassword } = data as Record<string, unknown>;
    if (
      typeof password === "string" &&
      password.trim().length > 0 &&
      confirmPassword !== password
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Пароли не совпадают",
        path: ["password"],
      });
    }
  });
};
