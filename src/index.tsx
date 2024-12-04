import React from "react";
import ReactDOM from "react-dom/client";
import "./global_styles/index.css";
import App from "./components/App";
import { ApiDataContextProvider } from "./contexts/ApiDataContextProvider";
import { StyleContextProvider } from "./contexts/StyleContextProvider";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <ApiDataContextProvider>
    <StyleContextProvider>
      <App />
    </StyleContextProvider>
  </ApiDataContextProvider>
);
