import { z } from "zod";
import { FileUploadSchema } from "../Shared/Schemas/file.schema";
import {
  withPasswordConfirmation,
  PasswordValidation,
} from "../Shared/Schemas/password.schema";

export const UserInfoSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  email: z.string().email("Некорректный формат email"),
  password: PasswordValidation,
  full_name: z.string().min(1, "Укажите как Вас зовут").default("").optional(),
  city: z.string().min(1, "Укажите свой город").default("").optional(),
  country: z.string().min(1, "Укажите свою страну").default("").optional(),
  bio: z.string().default("").optional(),
  photo: FileUploadSchema.optional(),
});
export type UserInfo = z.infer<typeof UserInfoSchema>;

export const BaseUserInfoSchema = UserInfoSchema.pick({
  id: true,
  full_name: true,
  city: true,
  country: true,
  bio: true,
}).extend({
  photo: FileUploadSchema.optional(),
  email: z.string().optional(),
});
export type BaseUserInfo = z.infer<typeof BaseUserInfoSchema>;

export const LoginCredentialsSchema = UserInfoSchema.pick({
  email: true,
  password: true,
});
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

const BaseRegisterSchema = UserInfoSchema.pick({
  email: true,
  password: true,
}).extend({
  confirmPassword: z.string().min(1, "Повторите пароль"),
});

export const RegisterCredentialsSchema =
  withPasswordConfirmation(BaseRegisterSchema);
export type RegisterCredentials = z.infer<typeof RegisterCredentialsSchema>;

export const ChangePasswordSchema = UserInfoSchema.pick({ password: true });
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;

export const EditingUserInfoSchema = UserInfoSchema.pick({
  password: true,
  full_name: true,
  city: true,
  bio: true,
}).extend({
  photo: FileUploadSchema.optional(),
});
export type EditingUserInfo = z.infer<typeof EditingUserInfoSchema>;

export const StoryUserInfoSchema = UserInfoSchema.pick({
  full_name: true,
  city: true,
  bio: true,
}).extend({
  photo: FileUploadSchema.optional(),
});
export type StoryUserInfo = z.infer<typeof StoryUserInfoSchema>;

const BaseStoryUserInfoPasswordSchema = z.object({
  full_name: z.string().min(1, "Укажите как Вас зовут"),
  city: z.string().min(1, "Укажите свой город"),
  bio: z.string(),
  photo: z.any().optional(),
  password: z
    .string()
    .trim()
    .pipe(z.string().max(0).or(PasswordValidation))
    .optional(),
  confirmPassword: z.string().optional(),
});

export const StoryUserInfoPasswordSchema = withPasswordConfirmation(
  BaseStoryUserInfoPasswordSchema,
);
export type StoryUserInfoPassword = z.infer<typeof StoryUserInfoPasswordSchema>;
