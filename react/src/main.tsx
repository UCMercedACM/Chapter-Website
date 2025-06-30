// biome-ignore format: suppress import sorting

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router";


// biome-ignore lint/style/noNonNullAssertion: Provided by React. Nothing we can do
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
