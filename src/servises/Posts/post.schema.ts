import { z } from "zod";
import { StoryUserInfoSchema } from "../User/user.schema";
import { FileUploadSchema } from "../Shared/Schemas/file.schema";

export const CommentSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  post_id: z.union([z.string(), z.number()]).optional(),
  author_name: z.string().trim().min(1, "Напишите имя"),
  comment: z
    .string()
    .trim()
    .min(1, "Добавьте текст отзыва")
    .max(600, "Ваш отзыв превышает 600 символов"),
  created_at: z.string().optional(),
});
export type Comment = z.infer<typeof CommentSchema>;

export const PostDetailSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string().trim().min(1, "Напишите заголовок"),
  description: z
    .string()
    .min(1, "Добавьте описание")
    .max(2000, "Описание не должно превышать 1200 символов")
    .optional(),
  country: z.string().trim().min(1, "Напишите название страны"),
  city: z.string().trim().min(1, "Напишите название города"),
  excerpt: z.string().trim().min(1, "Добавьте описание").optional(),
  photo: z.string().optional(),

  comments: z.array(CommentSchema).default([]),
  userInfo: StoryUserInfoSchema.optional(),
});
export type PostDetail = z.infer<typeof PostDetailSchema>;

export const PostFormSchema = PostDetailSchema.extend({
  photo: FileUploadSchema,
});
export type PostFormValues = z.infer<typeof PostFormSchema>;

export const PostCardSchema = PostFormSchema.pick({
  id: true,
  photo: true,
  title: true,
  country: true,
  city: true,
  description: true,
});

export type PostCard = z.infer<typeof PostCardSchema>;

export const PostListItemSchema = PostDetailSchema.pick({
  id: true,
  photo: true,
  title: true,
  excerpt: true,
}).extend({
  description: z.string().optional(),
});

export type PostListItem = z.infer<typeof PostListItemSchema>;

export const PostListSchema = z.array(PostListItemSchema);
export type PostList = z.infer<typeof PostListSchema>;

export const PaginatedPostsSchema = z.object({
  data: PostListSchema,
  totalCount: z.number(),
});

export type PaginatedPosts = z.infer<typeof PaginatedPostsSchema>;
