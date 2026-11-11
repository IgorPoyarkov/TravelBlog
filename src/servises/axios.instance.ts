import axios from "axios";
import { mockAdapter } from "./mockAdapter";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL || "",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
  // В demo-режиме запросы перехватывает mock-адаптер вместо сети
  ...(API_URL ? {} : { adapter: mockAdapter }),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
