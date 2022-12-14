import logo from "../images/logo.svg";
import { Switch, Route, Link } from "react-router-dom";
import { useState } from "react";

function Header({ userEmail, onLogOut }) {
  const [isBurgerMenu, setIsBurgerMenu] = useState(false);

  return (
    <header
      className={`${isBurgerMenu ? "header header_burger-menu" : "header"}`}
    >
      <img src={logo} className="header__logo" alt="Место Россия" />
      <Switch>
        <Route path="/sign-up">
          <Link className="header__link" to="/sign-in">
            Войти
          </Link>
        </Route>
        <Route path="/sign-in">
          <Link className="header__link" to="/sign-up">
            Регистрация
          </Link>
        </Route>
        <Route exact path="/">
          <div
            className={`${
              isBurgerMenu
                ? "header__user-data header__user-data_show"
                : "header__user-data"
            }`}
          >
            <p className="header__email">{userEmail}</p>
            <Link className="header__burger-link" to="/sign-in" onClick={onLogOut}>
              Выйти
            </Link>
          </div>
          <button
            className="burger-button"
            onClick={() => {
              setIsBurgerMenu(!isBurgerMenu);
            }}
          >
            <span
              className={`${
                isBurgerMenu
                  ? "burger-button__line burger-button__line_show"
                  : "burger-button__line"
              }`}
            ></span>
            <span
              className={`${
                isBurgerMenu
                  ? "burger-button__line burger-button__line_show"
                  : "burger-button__line"
              }`}
            ></span>
            <span
              className={`${
                isBurgerMenu
                  ? "burger-button__line burger-button__line_show"
                  : "burger-button__line"
              }`}
            ></span>
          </button>
        </Route>
      </Switch>
    </header>
  );
}

export default Header;
