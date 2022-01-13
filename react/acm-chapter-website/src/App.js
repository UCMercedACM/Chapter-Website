import "./App.scss";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  HashRouter,
} from "react-router-dom";
import React, { useEffect } from "react";

import WebFont from 'webfontloader';

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/home/Home";
import Events from "./pages/events/Events";
import Sigs from "./pages/sigs/Sigs";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Dashboard from "./pages/dashboard/dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import VerifyEmail from "./pages/verifyEmail/verifyEmail";

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Hind:400,700"]
      }
    })
  }, []);

  return (
    <HashRouter>
      <AuthProvider>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/events" component={Events} exact />
          <Route path="/sigs" component={Sigs} />
          {/* <Route path="/resources" component={Resources} /> */}
          <Route path="/reset" component={ResetPassword} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/verifyEmail" component={VerifyEmail} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
        </Switch>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
