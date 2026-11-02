import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "../UI/Input/CustomInput";
import { useEffect } from "react";
import { useLogin, useRegister, useUser } from "../../servises/User/user.api";
import {
  LoginCredentialsSchema,
  RegisterCredentialsSchema,
  type LoginCredentials,
  type RegisterCredentials,
} from "../../servises/User/user.schema";
import { CustomInputConfigData } from "../UI/Input/CustomInputConfig";

interface AuthFormProps {}

const AuthForm = ({}: AuthFormProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = searchParams.get("mode") || "register";
  const isLoginPage = mode === "login";
  const currentType = isLoginPage ? "login" : "register";

  const { data: user } = useUser();
  const { mutate: login, isPending, isError, error } = useLogin();

  const {
    mutate: registerUser,
    isPending: isPendingRegister,
    error: errorRegister,
  } = useRegister();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const currentConfig = CustomInputConfigData.find(
    (config) => config.type === currentType,
  );

  const currentSchema = isLoginPage
    ? LoginCredentialsSchema
    : RegisterCredentialsSchema;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(currentSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (errorRegister) {
      const errorMessage = errorRegister.message || String(errorRegister);
      if (
        errorMessage.toLowerCase().includes("email") ||
        errorMessage.toLowerCase().includes("существует")
      ) {
        setError("email", {
          type: "server",
          message: "Аккаунт с данным email уже существует",
        });
      }
    }
  }, [errorRegister, setError]);

  useEffect(() => {
    reset();
  }, [currentType, reset]);

  const onSubmit = (data: LoginCredentials | RegisterCredentials) => {
    if (isLoginPage) {
      login(data as LoginCredentials);
    } else {
      registerUser(data as RegisterCredentials);
    }
  };

  return (
    <div
      className={`auth-form ${isError ? "auth-form--error" : ""} ${currentType === "register" ? "auth-form--register" : ""}`}
    >
      <form
        className="auth-form__form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <h2 className="auth-form__title">
          {isLoginPage ? "Вход в профиль" : "Регистрация"}
        </h2>

        {isError && <p className="auth-form__error">{String(error)}</p>}

        {currentConfig && (
          <CustomInput
            fieldsCustomInput={currentConfig.fields}
            register={register}
            watch={watch}
            errors={errors}
            modifer={`${isError ? "error-login" : ""}`}
          />
        )}
        <div className="auth-form__actions">
          <button
            className={`auth-form__btn btn ${isLoginPage ? "btn--additionally" : ""} `}
            type={isLoginPage ? "button" : "submit"}
            onClick={
              isLoginPage
                ? () => setSearchParams({ mode: "register" })
                : undefined
            }
          >
            {isPendingRegister ? "Регистрация..." : "Зарегистрироваться"}
          </button>
          {isLoginPage && (
            <button
              className="auth-form__btn btn"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Вход..." : "Войти"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
