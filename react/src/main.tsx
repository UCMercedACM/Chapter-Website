// biome-ignore format: supress import sorting
import { scan } from "react-scan";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import "./index.css";

import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter } from "react-router";

scan({ enabled: import.meta.env.DEV });

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
