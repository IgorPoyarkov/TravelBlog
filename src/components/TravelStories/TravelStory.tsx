import { useNavigate, useParams } from "react-router-dom";
import { useComments, usePost } from "../../servises/Posts/post.api";
import useUtils from "../../hooks/useUtils";
import Loader from "../UI/Loader/Loader";
import { asset } from "../../utils/asset";

interface TravelStoryProps {}

const TravelStory = ({}: TravelStoryProps) => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, isSuccess, isError, error } = usePost(id || 1);
  const { data: comments, isFetching: isCommentsFetching } = useComments(
    id || 1,
  );
  const { formatDate } = useUtils();
  const navigate = useNavigate();

  return (
    <div className="travel-stories">
      {isLoading && <Loader />}

      {isError && <p>Error{error.message}</p>}

      {isSuccess && (
        <>
          <picture className="travel-stories__picture">
            <img
              className="travel-stories__img"
              src={post?.photo}
              alt="Картинка из путешествия"
            />
          </picture>
          <h2 className="travel-stories__title">{post.title}</h2>
          <p className="travel-stories__text">{post.description}</p>

          <div className="travel-stories__comments">
            <ul className="travel-stories__comments-list">
              {comments?.map((comment) => (
                <li className="travel-stories__comments-item">
                  <ul className="travel-stories__comments-list travel-stories__comments-list--wrapper">
                    <li className="travel-stories__comments-item ">
                      <span className="travel-stories__comments-field travel-stories__comments-field--name">
                        {comment.author_name}
                      </span>
                    </li>
                    <li className=" travel-stories__comments-item ">
                      <span className="travel-stories__comments-field travel-stories__comments-field--data">
                        {formatDate(comment.created_at)}
                      </span>
                    </li>
                    <li className=" travel-stories__comments-item ">
                      <span className="travel-stories__comments-field travel-stories__comments-field--comment">
                        {comment.comment}
                      </span>
                    </li>
                  </ul>
                </li>
              ))}
              {isCommentsFetching && (
                <li className="travel-stories__comments-item travel-stories__comments-item--loader">
                  <Loader modifer="pendulum" count={20} size={300} />
                </li>
              )}
            </ul>
          </div>

          <li className="profile-item profile-item--actions">
            <button
              className="travel-stories__btn btn btn--additionally btn--arrow"
              onClick={() => navigate("/")}
            >
              <svg className="btn-icon ">
                <use href={asset("/sprite.svg#arrow__icon")} />
              </svg>
              Назад
            </button>
            <button
              className="travel-stories__btn btn"
              onClick={() => navigate(`/posts/${id}/comments`)}
            >
              Ваше впечатление об этом месте
            </button>
          </li>
        </>
      )}
    </div>
  );
};

export default TravelStory;
