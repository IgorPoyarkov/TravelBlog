import { useNavigate, useParams } from "react-router-dom";
import CustomInput from "../UI/Input/CustomInput";
import { CustomInputConfigData } from "../UI/Input/CustomInputConfig";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema, type Comment } from "../../servises/Posts/post.schema";
import { useCreateComment } from "../../servises/Posts/post.api";
import Modal from "../UI/Modal/Modal";

interface CommentProps {}

const Comment = ({}: CommentProps) => {
  const { id } = useParams<{ id: string }>();
  const currentConfigFields = () => {
    const config = CustomInputConfigData.find(
      (item) => item.type === "comment",
    );
    return config ? config.fields : [];
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Comment>({
    resolver: zodResolver(CommentSchema),
    mode: "onSubmit",
  });
  const navigate = useNavigate();

  const {
    mutate: addComment,
    isPending,
    isSuccess,
  } = useCreateComment(id || 1);

  const onSubmit = (data: Comment) => {
    if (!id) return;

    addComment({
      postId: id,
      commentData: data,
    });
  };

  return (
    <div className="comment">
      {isSuccess && (
        <Modal
          configuration={{
            title: "Ваша история успешно добавлена",
            navigate: "comment",
          }}
        />
      )}
      <form className="comment-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="comment-title">Добавление отзыва</h2>
        <CustomInput
          fieldsCustomInput={currentConfigFields()}
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
          modifer="comment"
        />

        <ul className="comment-list">
          <li className="comment-item comment-item--actions">
            <button
              className="comment-btn btn btn--additionally btn--arrow"
              onClick={() => navigate(`/posts/${id}`)}
              type="button"
              disabled={isPending}
            >
              <svg className="btn-icon ">
                <use href={"/sprite.svg#arrow__icon"} />
              </svg>
              Назад
            </button>
            <button
              className="comment-btn btn"
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

export default Comment;
