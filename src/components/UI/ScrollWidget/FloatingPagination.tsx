import { useEffect, useState } from "react";
import { usePageStore } from "../../../store/UI/FloatingPaginationStore";
import { useUser } from "../../../servises/User/user.api";
import { useNavigate } from "react-router-dom";

interface FloatingPaginationProps {
  paginationSettings: {
    currentPage: number;
    totalPages: number;
  };

  onPageChange: (isNext: boolean) => void;
}

const FloatingPagination = ({
  paginationSettings,
  onPageChange,
}: FloatingPaginationProps) => {
  const { data: user } = useUser();
  const navigation = useNavigate();
  const { currentPage = 1, totalPages = 1 } = paginationSettings || {};
  const handlePageChange = (isNext: boolean) => {
    user ? onPageChange(isNext) : navigation("/account?mode=login");
  };
  const currentRef = usePageStore((state) => state.currentRef);
  const [isVisibible, setisVisibible] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    if (currentRef) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (totalPages <= 1) {
            setisVisibible(false);
          } else {
            setisVisibible(entry.isIntersecting);
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(currentRef);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [currentRef, totalPages]);

  return (
    <div
      className={`floating-pagination ${isVisibible ? "floating-pagination--visible" : ""} `}
    >
      <ul className="floating-pagination__list">
        <li className="floating-pagination__item">
          <button
            className={`floating-pagination__btn btn  ${currentPage === 1 ? "floating-pagination__btn--borderline" : ""}`}
            type="button"
            onClick={() => handlePageChange(false)}
          ></button>
        </li>
        <li className="floating-pagination__item">
          <span className="floating-pagination__page">{currentPage}</span>
        </li>
        <li className="floating-pagination__item">
          <button
            className={`floating-pagination__btn btn  ${currentPage === totalPages ? "floating-pagination__btn--borderline" : ""}`}
            type="button"
            onClick={() => handlePageChange(true)}
          ></button>
        </li>
      </ul>
    </div>
  );
};

export default FloatingPagination;
