import {
  useChangePassword,
  useUpdateUser,
  useUser,
} from "../../servises/User/user.api";
import { CustomInputConfigData } from "../UI/Input/CustomInputConfig";
import CustomInput from "../UI/Input/CustomInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StoryUserInfoPasswordSchema,
  type StoryUserInfoPassword,
} from "../../servises/User/user.schema";
import Loader from "../UI/Loader/Loader";

interface ProfileProps {}

const Profile = ({}: ProfileProps) => {
  const { data: user, isLoading } = useUser();
  const { mutate: changePassword } = useChangePassword();
  const { mutate: updateProfile } = useUpdateUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = searchParams.get("mode");
  const isEditing = mode === "editing";
  const currentType = isEditing ? "editing" : "";

  const currentConfigFields = (currentType: string) => {
    const config = CustomInputConfigData.find(
      (item) => item.type === currentType,
    );
    return config ? config.fields : [];
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<StoryUserInfoPassword>({
    resolver: zodResolver(StoryUserInfoPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      full_name: user?.full_name || "",
      city: user?.city || "",
      bio: user?.bio || "",
      photo: user?.photo || "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPhoto = watch("photo");

  useEffect(() => {
    if (
      typeof watchedPhoto === "string" &&
      watchedPhoto.startsWith("data:image") &&
      watchedPhoto !== user?.photo
    ) {
      const currentFormValues = getValues();

      const profileData = {
        full_name: currentFormValues.full_name,
        city: currentFormValues.city,
        bio: currentFormValues.bio,
        photo: watchedPhoto,
      };

      updateProfile(profileData, {
        onSuccess: (updatedUser) => {
          setValue("photo", updatedUser.photo);
        },
      });
    }
  }, [watchedPhoto, user?.photo, updateProfile, getValues, setValue]);

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name,
        city: user.city,
        bio: user.bio,
        photo: user?.photo || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  const handleFormSubmit = async (data: StoryUserInfoPassword) => {
    const profileData = {
      full_name: data.full_name,
      city: data.city,
      bio: data.bio,
      photo: data.photo || user?.photo || "",
    };

    updateProfile(profileData, {
      onSuccess: (updatedUser) => {
        setValue("photo", updatedUser.photo);
      },
    });

    if (data.password && data.password.trim().length > 0) {
      changePassword(
        { password: data.password },
        {
          onSuccess: () => {
            setValue("password", "");
            setValue("confirmPassword", "");
          },
        },
      );
    }

    navigate("/profile?mode=editing");
  };

  if (isLoading) return <Loader />;

  return (
    <div className={`profile ${isEditing ? "profile--editing" : ""}`}>
      <form className="profile-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <ul className="profile-list">
          <li className="profile-item">
            <CustomInput
              fieldsCustomInput={currentConfigFields("editing")}
              errors={errors}
              register={register}
              watch={watch}
              setValue={setValue}
              modifer={currentType}
            />
            <button
              className="profile-btn btn"
              type="button"
              onClick={() => navigate("/profile")}
            >
              <svg className="profile-icon">
                <use href="/sprite.svg#editing__icon" />
              </svg>
            </button>
          </li>
          <li className="profile-item profile-item--password">
            <p className="profile-title">Смена пароля</p>
            <CustomInput
              fieldsCustomInput={currentConfigFields("changePassword")}
              errors={errors}
              register={register}
              watch={watch}
              setValue={setValue}
            />
          </li>
          <li className="profile-item profile-item--actions">
            <button
              className="profile-btn btn btn--additionally btn--arrow"
              type="button"
              onClick={() => navigate("/profile?mode=editing")}
            >
              <svg className="btn-icon ">
                <use href={"/sprite.svg#arrow__icon"} />
              </svg>
              Назад
            </button>
            <button className="profile-btn btn" type="submit">
              Сохранить
            </button>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default Profile;
