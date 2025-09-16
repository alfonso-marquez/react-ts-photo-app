import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import PhotosPage from "./pages/photoPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PhotosPage />
  </StrictMode>,
);
