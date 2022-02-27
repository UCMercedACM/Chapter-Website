import "./App.scss";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React, { Suspense, useEffect, lazy } from "react";

import WebFont from "webfontloader";

import Header from "./components/Header/Header";
import Home from "./pages/home/Home";
import EventsPage from "./pages/events/EventsPage";
import Sigs from "./pages/sigs/Sigs";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/RouteComps/PrivateRoute";
import PublicRoute from "./components/RouteComps/PublicRoute";
import ProtectedRoutes from "./components/RouteComps/ProtectedRoutes";
import { MutatingDots } from "react-loader-spinner";
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));
const VerifyEmail = lazy(() => import("./pages/verifyEmail/verifyEmail"));
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword"));

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Hind:400,700"],
      },
    });
  }, []);

  return (
    <Router>
      <AuthProvider>
        {/* test */}
        <Header />
        <Suspense fallback={<MutatingDots height={80} width={80} />}>
          <Switch>
            <PublicRoute path="/login">
              <Login />
            </PublicRoute>
            <PublicRoute path="/register" exact>
              <Register />
            </PublicRoute>
            <PublicRoute path="/verifyEmail">
              <VerifyEmail />
            </PublicRoute>
            <PublicRoute path="/reset">
              <ResetPassword />
            </PublicRoute>

            <Route exact path="/" component={Home} />
            <Route path="/events" component={EventsPage} exact />
            <Route path="/sigs" component={Sigs} />
            {/* <Route path="/resources" component={Resources} /> */}
            <PrivateRoute path="/">
              <ProtectedRoutes />
            </PrivateRoute>
          </Switch>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
