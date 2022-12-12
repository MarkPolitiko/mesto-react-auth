import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { useState, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/Api";
import * as auth from "../utils/Auth";

import { Route, Switch, withRouter, useHistory } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  const [isRegistered, setIsRegistered] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoOpened, setIsInfoOpened] = useState(false);
  //const [userData, setUserData] = useState("");
  const [email, setEmail] = useState("");
  /* const [isAuth, setIsAuth] = useState(false); */
  const history = useHistory();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          setEmail(res.data.email); // ВОТ ЗДЕСЬ НУЖЕН ДАБЛЧЕК
          setLoggedIn(true);
          history.push("/");
        })
        .catch((err) => {
          if (err.status === 400) {
            console.log("400 — Токен не передан или передан не в том формате");
          } else if (err.status === 401) {
            console.log("401 — Переданный токен некорректен");
          }
        });
    }
  }, [history]);

  useEffect(() => {
    api
      .getProfileInfo()
      .then((res) => setCurrentUser(res))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    api
      .getInitialCards()
      .then((res) => setCards(res))
      .catch((err) => console.error(err));
  }, []);

  function handleAddPlaceSubmit(name, link) {
    api
      .postNewCard(name, link)
      .then((card) => {
        setCards([card, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    function updatedCardStatus(newCard) {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    }

    // Отправляем запрос в API и получаем обновлённые данные карточки
    if (!isLiked) {
      api
        .putLike(card._id)
        .then(updatedCardStatus)
        .catch((err) => console.log(err));
    } else {
      api
        .deleteLike(card._id)
        .then(updatedCardStatus)
        .catch((err) => console.log(err));
    }
  }

  function handleCardDelete(cardToDelete) {
    api
      .deleteCard(cardToDelete._id)
      .then(() => {
        setCards((prevCard) =>
          prevCard.filter((i) => i._id !== cardToDelete._id)
        );
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(data) {
    api
      .patchProfile(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  function handleUpdateAvatar(data) {
    api
      .patchAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({});
  }

  function handleRegister(data) {
    auth
      .register(data)
      .then(() => {
        setIsRegistered(true);
        setIsInfoOpened(true);
        history.push("/sign-in");
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - некорректно заполнено одно из полей");
        }
        setIsRegistered(false);
        setIsInfoOpened(true);
      });
  }

  function handleLogin(data) {
    auth
      .login(data)
      .then((res) => {
        if (res.jwt) {
          setLoggedIn(true);
          setEmail(data.res.email);
          localStorage.setItem("jwt", res.token); 
          history.push("/");
        }
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - не передано одно из полей");
        } else if (err.status === 401) {
          console.log("401 - пользователь с email не найден");
        }
      });
  }

  function handleLogOut() {
    setLoggedIn(false);
    //setIsRegistered(false);
    localStorage.removeItem("jwt");
    history.push("/sign-in");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header email={email} onLogOut={handleLogOut} />
          <Switch>
            <ProtectedRoute
              exact
              path="/"
              loggedIn={loggedIn}
              component={Main}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
              logOut={handleLogOut}
              //userData={userData}
            ></ProtectedRoute>
            <Route path="/sign-up">
              <Register onRegister={handleRegister} />
            </Route>
            <Route path="/sign-in">
              <Login onLogin={handleLogin} />
            </Route>
          </Switch>
          <Footer />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />
          <InfoTooltip
            isOpen={isInfoOpened}
            onClose={closeAllPopups}
            isSuccessReg={isRegistered}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default /* withRouter( */ App;
