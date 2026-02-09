import React from "react";
import ReactDOM from "react-dom/client";
// Importer le Provider de react-redux et le store pour fournir l'accès au store à toute l'application
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import './assets/main.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
