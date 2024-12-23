import { Route, Routes } from 'react-router-dom'
import * as reactRouterDom from 'react-router-dom'
import SuperTokens, { SuperTokensWrapper } from 'supertokens-auth-react'
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword'
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui'
import Session from 'supertokens-auth-react/recipe/session'
import ThirdParty from 'supertokens-auth-react/recipe/thirdparty'
import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui'
import { getSuperTokensRoutesForReactRouterDom } from 'supertokens-auth-react/ui'
import Front from './pages/front.tsx'
import Sigs from './pages/sigs.tsx'

SuperTokens.init({
  appInfo: {
    appName: 'ucmacm-website',
    apiDomain: import.meta.env.VITE_API_DOMAIN,
    websiteDomain: import.meta.env.VITE_WEBSITE_DOMAIN,
    apiBasePath: '/auth',
    websiteBasePath: '/auth',
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
})

function App() {
  return (
    <>
      <SuperTokensWrapper>
        <Routes>
          {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [
            ThirdPartyPreBuiltUI,
            EmailPasswordPreBuiltUI,
          ])}
          <Route path="/" element={<Front />} />
          <Route path="/sigs" element={<Sigs />} />
        </Routes>
      </SuperTokensWrapper>
    </>
  )
}

export default App
