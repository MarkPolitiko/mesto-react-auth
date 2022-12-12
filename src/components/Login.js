import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login({ onLogin }) {
  //const [authData, setAuthData] = useState[{ email: "", password: "" }];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmail(evt) {
    setEmail(evt.target.value);
  }
  function handlePassword(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onLogin({ email, password });
  }

  /* function handleOnChange(evt) {
    const { name, value } = evt.target;
    setAuthData({ ...authData, [name]: value });
  } */

  return (
    <>
      <div className="auth">
        <form onSubmit={handleSubmit} className="auth__content">
          <h3 className="auth__title">Вход</h3>
          <input
            value={email}
            className="auth__data"
            onChange={handleEmail}
            name="email"
            type="email"
            placeholder="E-mail"
            minLength="2"
            maxLength="200"
            title="Длина поля должна быть 2 и более символов и менее или равно 200"
            required
          />
          <span className="popup__input-error place-input-error popup__input-error_field_name"></span>{" "}
          {/* ПОПРАВИТЬ КЛАССЫ */}
          <input
            value={password}
            className="auth__data"
            onChange={handlePassword}
            name="password"
            type="password"
            placeholder="Пароль"
            minLength="2"
            maxLength="30"
            title="Длина поля должна быть 2 и более символов и менее или равно 30"
            required
          />
          <span className="popup__input-error place-input-error popup__input-error_field_name"></span>{" "}
          {/* ПОПРАВИТЬ КЛАССЫ */}
          <button className="auth__button">Войти</button>
          <Link to="/sign-up" className="auth__signup-ask">
            Нет учетной записи? Зарегистрироваться
          </Link>
        </form>
      </div>
    </>
  );
}

export default Login;
