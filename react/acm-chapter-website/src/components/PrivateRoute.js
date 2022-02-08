import { auth } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          auth.currentUser.emailVerified ? (
            <Component {...props} />
          ) : (
            <Redirect to="/verifyEmail" />
          )
        ) : (
          <Redirect to="/" />
        );
      }}
    ></Route>
  );
}
