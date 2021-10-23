import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase/config";

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
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
}
