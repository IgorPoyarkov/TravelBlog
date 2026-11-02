import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogout, useUser } from "../../servises/User/user.api";

interface UserMenuProps {}

const UserMenu = ({}: UserMenuProps) => {
  const [dropMenu, setDropMenu] = useState(false);

  const navigate = useNavigate();

  const { data: user } = useUser();
  const { mutate: logout } = useLogout();

  function openDropMenu() {
    setDropMenu(!dropMenu);
  }

  const classOpenDropMenu: { main: string; arrow: string } = {
    main: dropMenu ? "user-menu__drop--open" : "",
    arrow: dropMenu ? "user-menu__btn--arrow" : "",
  };

  return (
    <div className="user-menu">
      {!user ? (
        <ul className="user-menu__list">
          <li className="user-menu__item">
            <NavLink className="user-menu__link" to={"/account?mode=login"}>
              <span className="user-menu__field user-menu__field--login">
                Войти
              </span>
            </NavLink>
          </li>
        </ul>
      ) : (
        <>
          <ul className="user-menu__list">
            <li className="user-menu__item">
              <div
                className={`user-menu__picture ${user?.photo ? "" : "user-menu__picture--substrate"}`}
              >
                <img
                  className="user-menu__img"
                  src={user?.photo}
                  alt="Аватар пользователя"
                />
              </div>
            </li>
            <li className="user-menu__item">
              <span className="user-menu__field user-menu__field--name">
                {user?.full_name || user?.email || ""}
              </span>
            </li>
            <li className="user-menu__item">
              <button
                className={`user-menu__btn btn ${classOpenDropMenu.arrow}`}
                onClick={openDropMenu}
              >
                <svg className="user-menu__icon">
                  <use href="/sprite.svg#user-icon" />
                </svg>
              </button>
            </li>
          </ul>
          <div className={`user-menu__drop ${classOpenDropMenu.main}`}>
            <ul className="user-menu__list">
              <li className="user-menu__item">
                <button
                  className="user-menu__btn btn"
                  onClick={() => {
                    (navigate("/profile?mode=editing"), setDropMenu(!dropMenu));
                  }}
                >
                  <span className="user-menu__field">Профиль</span>
                </button>
              </li>
              <li className="user-menu__item">
                <button
                  className="user-menu__btn btn"
                  onClick={() => {
                    (logout(), setDropMenu(!dropMenu), navigate("/"));
                  }}
                >
                  <span className="user-menu__field">Выйти</span>
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
