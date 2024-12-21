import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import "./index.css";

import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from "react-router-dom";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";

// biome-ignore lint/style/noNonNullAssertion: Provided by React. Nothing we can do
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		{/* <SuperTokensWrapper> */}
		<NextUIProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</NextUIProvider>
		{/* </SuperTokensWrapper> */}
	</React.StrictMode>,
);
