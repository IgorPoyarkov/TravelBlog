import { NavLink } from "react-router-dom";
import UserMenu from "../User/UserMenu";
import { useUser } from "../../servises/User/user.api";
import { asset } from "../../utils/asset";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const { data: user } = useUser();
  return (
    <header className={`header ${!user ? "header--big" : ""}`}>
      <nav className="header-navigation ">
        <ul className="header-navigation__list">
          <li className="header-navigation__item">
            <NavLink
              className={
                "header-navigation__link header-navigation__link--logo"
              }
              to={"/"}
            >
              <span className="header-navigation__link-name">Travel</span>
              <svg className="header-navigation__icon">
                <use href={asset("/sprite.svg#logo-icon")} />
              </svg>
            </NavLink>
          </li>
          <li className="header-navigation__item">
            <span
              className={
                "header-navigation__link header-navigation__link--login"
              }
            >
              <UserMenu />
            </span>
          </li>
        </ul>
      </nav>
      <h2 className="header-title">
        {!user
          ? "Там, где мир начинается с путешествий"
          : "Истории ваших путешествий"}
      </h2>
      <div className="header-picture">
        <img
          className="header-img"
          src="../../../public/mainImg.png"
          alt="Основная картинка сайта"
        />
      </div>
    </header>
  );
};

export default Header;
