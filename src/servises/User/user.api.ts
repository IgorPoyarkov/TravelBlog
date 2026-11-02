import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios.instance";
import {
  type LoginCredentials,
  type RegisterCredentials,
  type ChangePassword,
  type StoryUserInfo,
  type BaseUserInfo,
  BaseUserInfoSchema,
} from "./user.schema";
import axios from "axios";


export const fetchCurrentUser = async (): Promise<BaseUserInfo | null> => {
  const token = localStorage.getItem("auth_token");
  const userId = localStorage.getItem("user_id"); 

  if (!token || !userId) return null;

  try {
    const response = await api.get<unknown>(`/users/${userId}`);
    return BaseUserInfoSchema.parse(response.data);
  } catch (error) {
    return null;
  }
};

export const updateCurrentUser = async (
  newInfoUser: StoryUserInfo,
): Promise<BaseUserInfo> => {
  const userId = localStorage.getItem("user_id");
  if (!userId) throw new Error("Пользователь не авторизован");

  const response = await api.patch<unknown>(`/users/${userId}`, newInfoUser);
  return BaseUserInfoSchema.parse(response.data);
};

export const loginUserApi = async (
  credentials: LoginCredentials,
): Promise<BaseUserInfo> => {
  try {
    const response = await api.post<{ accessToken: string; user: unknown }>(
      "/login",
      credentials,
    );

    localStorage.setItem("auth_token", response.data.accessToken);
    localStorage.setItem("user_id", String((response.data.user as any).id));

    return BaseUserInfoSchema.parse(response.data.user);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw "Неверный логин или пароль";
    }
    throw "Ошибка соединения с сервером";
  }
};

export const registerUserApi = async (
  credentials: RegisterCredentials,
): Promise<BaseUserInfo> => {
  try {
    const response = await api.post<{ accessToken: string; user: unknown }>(
      "/register",
      credentials,
    );

    localStorage.setItem("auth_token", response.data.accessToken);
    localStorage.setItem("user_id", String((response.data.user as any).id));

    return BaseUserInfoSchema.parse(response.data.user);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw "Аккаунт с данным Email уже существует";
    }
    throw "Не удалось создать аккаунт";
  }
};

export const logoutUserApi = async (): Promise<void> => {
  try {
    await api.post("/logout");
  } catch (error) {
  } finally {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
  }
};

export const changePasswordApi = async (
  data: ChangePassword,
): Promise<void> => {
  const userId = localStorage.getItem("user_id");
  if (!userId) throw new Error("Пользователь не авторизован");

  await api.patch(`/users/${userId}`, data);
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    retry: false,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (validatedUser) => {
      queryClient.setQueryData(["user"], validatedUser);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUserApi,
    onSuccess: (validatedUser) => {
      queryClient.setQueryData(["user"], validatedUser);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUserApi,
    onSuccess: (validatedUser) => {
      queryClient.setQueryData(["user"], validatedUser);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUserApi,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries();
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePasswordApi,
  });
};
