import { useForm } from "react-hook-form";
import CustomInput from "../UI/Input/CustomInput";
import { CustomInputConfigData } from "../UI/Input/CustomInputConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PostCardSchema,
  type PostCard,
} from "../../servises/Posts/post.schema";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "../../servises/Posts/post.api";
import Modal from "../UI/Modal/Modal";

interface StoryCardProps {}

const StoryCard = ({}: StoryCardProps) => {
  const currentConfigFields = () => {
    const config = CustomInputConfigData.find(
      (item) => item.type === "storyCard",
    );
    return config ? config.fields : [];
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostCard>({
    resolver: zodResolver(PostCardSchema),
    mode: "onSubmit",
  });
  const navigate = useNavigate();

  const { mutate: post, isPending, isSuccess } = useCreatePost();

  const onSubmit = (data: PostCard) => {
    post(data as PostCard);
    reset;
  };

  return (
    <div className="story-card">
      {isSuccess && (
        <Modal
          configuration={{
            title: "Ваша история успешно добавлена",
          }}
        />
      )}
      <form className="story-card__form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="story-card__title">Добавление истории о путешествии</h2>
        <ul className="story-card__list">
          <li className="story-card__item">
            <CustomInput
              fieldsCustomInput={currentConfigFields()}
              watch={watch}
              errors={errors}
              register={register}
              setValue={setValue}
              modifer="story"
            />
          </li>
          <li className="story-card__item story-card__item--actions">
            <button
              className="story-card__item-btn btn btn--additionally btn--arrow"
              type="button"
              onClick={() => navigate("/")}
              disabled={isPending}
            >
              <svg className="btn-icon ">
                <use href={"/sprite.svg#arrow__icon"} />
              </svg>
              Назад
            </button>
            <button
              className="story-card__item-btn btn"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Сохранение..." : "Сохранить"}
            </button>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default StoryCard;
