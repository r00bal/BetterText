import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/content/App";
import "./pages/content/style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
