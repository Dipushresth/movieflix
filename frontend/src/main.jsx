import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.jsx";
import "./App.css";
import "./assets/css/navbar.css";
import "./assets/css/login.css";
import "./assets/css/hero.css";
import "./assets/css/movie.css";
import "./assets/css/add-movie.css";
import "./assets/css/movie-details.css";
import "./assets/css/movie-menu.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
