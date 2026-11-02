import { NavLink } from "react-router-dom";
import type { PostListItem } from "../../servises/Posts/post.schema";
import { usePost } from "../../servises/Posts/post.api";
import Loader from "../UI/Loader/Loader";
import { useUser } from "../../servises/User/user.api";

interface TripCardProps {
  post: PostListItem;
}

const TripCard = ({ post }: TripCardProps) => {
  const { data: postData, isLoading, isFetching } = usePost(post.id);
  const { data: user } = useUser();

  const currentLink = user ? `/posts/${post.id}` : "/account?mode=login";

  return (
    <div className="trip-card" key={post.id}>
      <ul className="trip-card__list">
        <li className="trip-card__item">
          <div className="trip-card__picture">
            <img className="trip-card__img" src={post.photo} alt="Заглавная картинка путешествия" />
          </div>
        </li>
        <li className="trip-card__item">
          <span className="trip-card__title">{post.title}</span>
        </li>
        <li className="trip-card__item">
          <span className="trip-card__text">
            {post.excerpt ? post.excerpt : post.description}
          </span>
        </li>
        <li className="trip-card__item">
          {isLoading || isFetching ? (
            <Loader modifer="pendulum" size={100} count={7} />
          ) : (
            <div className="trip-card__location">
              <span className="trip-card__location-country">
                {postData?.city}
                {", "}
              </span>
              <span className="trip-card__location-city">
                {postData?.country}
              </span>
            </div>
          )}
        </li>
        <li className="trip-card__item">
          <NavLink className="trip-card__link" to={currentLink}>
            {"Подробнее"}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default TripCard;
