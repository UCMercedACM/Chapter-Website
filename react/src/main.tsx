import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import "./index.css";

import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter } from "react-router-dom";

// biome-ignore lint/style/noNonNullAssertion: Provided by React. Nothing we can do
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<HeroUIProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</HeroUIProvider>
	</React.StrictMode>,
);
