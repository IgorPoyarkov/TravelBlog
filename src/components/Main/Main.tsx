import { NavLink } from "react-router-dom";
import TripCards from "../TripCard/TripCards";
import { useUser } from "../../servises/User/user.api";
import { usePageStore } from "../../store/UI/FloatingPaginationStore";

interface MainProps {}

const Main = ({}: MainProps) => {
  const { data: user } = useUser();
  const currentLink = user ? `/posts` : "/account?mode=login";
  const setCurrentRef = usePageStore((state) => state.setCurrentRef);

  return (
    <main className="main">
      <h1
        className="main-title visually-hidden"
        aria-label="Блог для путешественников"
      >
        Блог для путешественников
      </h1>
      <TripCards />
      <NavLink className="main-btn btn " to={currentLink} ref={setCurrentRef}>
        Добавить мое путешествие
      </NavLink>
    </main>
  );
};

export default Main;
