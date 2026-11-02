import { useState } from "react";
import { usePosts } from "../../servises/Posts/post.api";
import Loader from "../UI/Loader/Loader";
import TripCard from "./TripCard";
import FloatingPagination from "../UI/ScrollWidget/FloatingPagination";

interface TripCardProps {}

const TripCards = ({}: TripCardProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const POSTS_LIMIT = 6;
  const {
    data: posts,
    isLoading,
    isError,
    isSuccess,
  } = usePosts(currentPage, POSTS_LIMIT);

  function handlePageChange(isNext: boolean): void {
    setCurrentPage((prevPage) => {
      if (isNext) {
        return prevPage < totalPages ? prevPage + 1 : prevPage;
      } else {
        return prevPage > 1 ? prevPage - 1 : prevPage;
      }
    });
  }

  const totalPosts = posts?.totalCount || 0;

  const totalPages = Math.ceil(totalPosts / POSTS_LIMIT);

  return (
    <div className={`trip-cards ${isError ? "trip-cards--error" : ""}`}>
      {isLoading && <Loader size={600} count={12} />}

      {isError && (
        <p className="trip-cards__error">Ошибка при загрузке данных</p>
      )}

      {isSuccess && (
        <ul className="trip-cards__list">
          {posts.data?.map((post) => (
            <li key={post.id} className="trip-cards__item">
              <TripCard post={post} />
            </li>
          ))}
        </ul>
      )}

      <FloatingPagination
        paginationSettings={{
          currentPage: currentPage,
          totalPages: totalPages,
        }}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TripCards;
