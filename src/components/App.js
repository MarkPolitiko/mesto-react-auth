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

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

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
      setCards((state) =>
        state.map((c) => (c._id === card._id ? newCard : c))
      );
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
        setCards(prevCard => prevCard.filter((i) => i._id !== cardToDelete._id));
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header />
          <Main
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
          />
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
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
