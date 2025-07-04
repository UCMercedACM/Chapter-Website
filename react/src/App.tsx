import * as reactRouter from "react-router";
import { Route, Routes } from "react-router";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import Session from "supertokens-auth-react/recipe/session";
import ThirdParty from "supertokens-auth-react/recipe/thirdparty";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { Index } from "@/routes/index";

function App() {
  SuperTokens.init({
    appInfo: {
      appName: "ucmacm-website",
      apiDomain: import.meta.env.VITE_API_DOMAIN,
      websiteDomain: import.meta.env.VITE_WEBSITE_DOMAIN,
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailPassword.init(),
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [ThirdParty.Google.init()],
        },
      }),
      Session.init(),
    ],
    disableAuthRoute: false,
  });

  return (
    <SuperTokensWrapper>
      <Routes>
        {getSuperTokensRoutesForReactRouterDom(reactRouter, [
          ThirdPartyPreBuiltUI,
          EmailPasswordPreBuiltUI,
        ])}
        <Route path="/" element={<Index />} />
      </Routes>
    </SuperTokensWrapper>
  );
}

export default App;
