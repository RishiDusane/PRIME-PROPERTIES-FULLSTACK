import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

/* ✅ IMPORTANT: LOAD BOTH */
import "./index.css";   // Tailwind
import "./styles.css";  // Your custom UI

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
