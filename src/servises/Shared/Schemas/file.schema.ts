import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const FileUploadSchema = z
  .any()
  .refine((value) => {
    if (typeof value === "string") return true;

    if (value instanceof FileList) return value.length > 0;

    return false;
  }, "Добавьте фотографию")
  .refine((value) => {
    if (typeof value === "string") return true;
    if (value instanceof FileList && value[0]) {
      return value[0].size <= MAX_FILE_SIZE;
    }
    return false;
  }, "Максимальный размер фото — 5MB")
  .refine((value) => {
    if (typeof value === "string") return true;
    if (value instanceof FileList && value[0]) {
      return ACCEPTED_IMAGE_TYPES.includes(value[0].type);
    }
    return false;
  }, "Допустимы только форматы .jpeg и .png ");
