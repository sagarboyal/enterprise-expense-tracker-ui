import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ContextProvider } from "./store/ContextApi.jsx";
import AppWrapper from "./App.jsx";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <BrowserRouter>
        <ContextProvider>
          <AppWrapper />
        </ContextProvider>
      </BrowserRouter>
  </StrictMode>
);
