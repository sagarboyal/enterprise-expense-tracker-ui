import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ContextProvider } from "./store/ContextApi.jsx";
import AppWrapper from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextProvider>
      <AppWrapper />
    </ContextProvider>
  </StrictMode>
);
