import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PostListSchema,
  PostDetailSchema,
  PostCardSchema,
  CommentSchema,
} from "./post.schema";
import type {
  Comment,
  PaginatedPosts,
  PostCard,
  PostDetail,
} from "./post.schema";
import { api } from "../axios.instance";
import { z } from "zod";

interface CreateCommentParams {
  postId: string | number;
  commentData: Omit<Comment, "id">;
}

export const fetchPosts = async (
  page: number,
  limit: number,
): Promise<PaginatedPosts> => {
  const response = await api.get<unknown>(
    `/posts?_page=${page}&_limit=${limit}`,
  );

  const validatedData = PostListSchema.parse(response.data);

  const totalCount =
    Number(response.headers["x-total-count"]) || validatedData.length;

  return {
    data: validatedData,
    totalCount,
  };
};

export const fetchPostById = async (
  id: string | number,
): Promise<PostDetail> => {
  const response = await api.get<unknown>(`/posts/${id}`);
  return PostDetailSchema.parse(response.data);
};

export const createPostApi = async (
  newPost: Omit<PostCard, "id">,
): Promise<PostCard> => {
  const response = await api.post<unknown>("/posts", newPost);
  return PostCardSchema.parse(response.data);
};

export const createCommentApi = async ({
  postId,
  commentData,
}: CreateCommentParams): Promise<Comment> => {
  const payload = {
    ...commentData,
    post_id: String(postId),
    created_at: new Date().toISOString(),
  };

  const response = await api.post<unknown>("/comments", payload);
  return CommentSchema.parse(response.data);
};

export const fetchCommentsById = async (
  id: string | number,
): Promise<Comment[]> => {
  const response = await api.get<unknown>(`/comments?post_id=${id}`);
  return z.array(CommentSchema).parse(response.data);
};

export const usePosts = (page: number = 1, limit: number = 6) => {
  return useQuery({
    queryKey: ["posts", { page, limit }],
    queryFn: () => fetchPosts(page, limit),

    placeholderData: (previousData) => previousData,
  });
};

export const usePost = (id: string | number | undefined) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPostById(id!),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useCreateComment = (postId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", postId, "comments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["posts", postId],
      });
    },
  });
};

export const useComments = (postId: string | number) => {
  return useQuery({
    queryKey: ["posts", postId, "comments"],
    queryFn: () => fetchCommentsById(postId!),
    enabled: !!postId,
  });
};
