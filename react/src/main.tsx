// biome-ignore format: suppress import sorting

import React from "react";
import ReactDOM from "react-dom/client";
import { scan } from "react-scan";

import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router";

scan({ enabled: import.meta.env.DEV });

// biome-ignore lint/style/noNonNullAssertion: Provided by React. Nothing we can do
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
