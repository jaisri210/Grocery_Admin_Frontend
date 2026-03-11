import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AdminProductProvider } from "./context/AdminProductContext";
import { AdminOrderProvider } from "./context/AdminOrderContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AdminProductProvider>
        <AdminOrderProvider>
          <App />
        </AdminOrderProvider>
      </AdminProductProvider>
    </BrowserRouter>
  </StrictMode>,
);
