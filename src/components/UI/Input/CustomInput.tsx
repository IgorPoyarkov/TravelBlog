import { useState } from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import type { FieldsCustomInput } from "../Input/CustomInputConfig";
import useUtils from "../../../hooks/useUtils";
import Loader from "../Loader/Loader";
import { asset } from "../../../utils/asset";

interface CustomInputProps {
  fieldsCustomInput: FieldsCustomInput[];
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  setValue?: UseFormSetValue<any>;
  modifer?: string;
}

const CustomInput = ({
  fieldsCustomInput,
  register,
  errors,
  watch,
  setValue,
  modifer = "",
}: CustomInputProps) => {
  const { fileToBase64 } = useUtils();

  const [isConvertingFields, setIsConvertingFields] = useState<
    Record<string, boolean>
  >({});

  return (
    <div
      className={`custom-input ${modifer ? `custom-input--${modifer}` : ""}`}
    >
      {fieldsCustomInput.map((field) => {
        const hasError = !!errors[field.name];
        const errorMessage = errors[field.name]?.message as string;
        let customFieldClass = "";
        let svgFile = "";
        let labelPhoto = "";

        const isConverting = !!isConvertingFields[field.name];

        switch (modifer) {
          case "editing":
            customFieldClass = "custom-input__input--" + field.name;
            svgFile = "camera__icon";
            labelPhoto = "Изменить фото";
            break;
          case "story":
            customFieldClass = "custom-input__input--" + field.name;
            svgFile = "loading-photo__icon";
            labelPhoto = "Файл загружен";
            break;
          default:
            customFieldClass = "";
            svgFile = "camera__icon";
            labelPhoto = "Изменить фото";
            break;
        }

        const fieldValue = watch(field.name);
        const currentLength = ((fieldValue as string) || "").length;

        const textareaCounterListError =
          currentLength > Number(field.textareaData)
            ? "custom-input__counter-item--error"
            : "";

        const isFileUploaded =
          typeof fieldValue === "string" &&
          fieldValue.startsWith("data:image") &&
          !hasError;

        const getPreviewSrc = () => {
          if (isFileUploaded) {
            return fieldValue;
          }
          return field.photo || "";
        };

        const fieldWrapperModifiers = [
          isFileUploaded ? "custom-input__field-wrapper--uploaded" : "",
          isConverting ? "custom-input__field-wrapper--loading" : "",
          hasError ? "custom-input__field-wrapper--error" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            className={`custom-input__field-wrapper ${fieldWrapperModifiers}`}
            key={field.name}
          >
            <label
              className={`custom-input__label ${isFileUploaded ? "custom-input__label--success" : ""} ${isConverting ? "custom-input__label--loading" : ""}`}
              htmlFor={field.name}
            >
              {isConverting ? (
                <Loader count={12} size={320} modifer="file" />
              ) : isFileUploaded ? (
                labelPhoto
              ) : (
                field.value
              )}
              {customFieldClass !== "" && field.type !== "file" && ":"}
              {field.required && (
                <svg className="custom-input__icon">
                  <use href={asset("/sprite.svg#required-field__icon")} />
                </svg>
              )}
            </label>

            {field.type === "textarea" ? (
              <>
                <textarea
                  className={`custom-input__textarea ${hasError ? "custom-input__input--error" : ""} ${customFieldClass}`}
                  id={field.name}
                  placeholder={field.placeholder}
                  {...register(field.name)}
                ></textarea>
                <ul className="custom-input__counter-list">
                  <li
                    className={`custom-input__counter-item  ${textareaCounterListError} `}
                  >
                    {currentLength}
                  </li>
                  <li className="custom-input__counter-item ">
                    {field.textareaData}
                  </li>
                </ul>
              </>
            ) : field.type === "file" ? (
              <input
                className={`custom-input__input ${hasError ? "custom-input__input--error" : ""} visually-hidden ${customFieldClass}`}
                type="file"
                id={field.name}
                accept="image/*"
                disabled={isConverting}
                {...register(field.name, {
                  onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                    const files = e.target.files;
                    if (setValue && files && files.length > 0) {
                      try {
                        setIsConvertingFields((prev) => ({
                          ...prev,
                          [field.name]: true,
                        }));

                        const base64String = await fileToBase64(files);

                        setValue(field.name, base64String, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      } catch (err) {
                        console.error(
                          "Ошибка конвертации файла в Base64:",
                          err,
                        );
                      } finally {
                        setIsConvertingFields((prev) => ({
                          ...prev,
                          [field.name]: false,
                        }));
                      }
                    }
                  },
                })}
              />
            ) : (
              <input
                className={`custom-input__input ${hasError ? "custom-input__input--error" : ""} ${customFieldClass}`}
                type={field.type}
                id={field.name}
                placeholder={field.placeholder}
                {...register(field.name)}
              />
            )}

            {hasError && (
              <span className="custom-input__error-text">{errorMessage}</span>
            )}

            {field.type === "file" && (
              <>
                <picture
                  className={`custom-input__picture ${isFileUploaded ? "custom-input__picture--active" : ""} ${isConverting ? "custom-input__picture--loading" : ""}`}
                >
                  <img
                    className="custom-input__img"
                    src={getPreviewSrc()}
                    alt="Превью загруженного файла"
                  />
                </picture>

                <svg
                  className={`custom-input__icon custom-input__icon--picture ${isFileUploaded ? "custom-input__icon--success" : ""} ${isConverting ? "custom-input__icon--spinning" : ""}`}
                >
                  <use href={asset(`/sprite.svg#${svgFile}`)} />
                </svg>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CustomInput;
