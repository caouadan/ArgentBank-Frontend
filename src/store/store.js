import { configureStore } from "@reduxjs/toolkit";
// Importer le reducer de l'utilisateur pour gérer l'état de l'utilisateur dans le store (etat actuel + actions pour le mettre à jour)
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
