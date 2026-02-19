import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ErrorContextProvider from "./context/errorContext/context.jsx";
import UserContextProvider from "./context/userContext/context.jsx";
import { CookiesProvider } from "react-cookie";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorContextProvider>
        <CookiesProvider defaultSetOptions>
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </CookiesProvider>
      </ErrorContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
