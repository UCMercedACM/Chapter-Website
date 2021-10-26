import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase/config";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();
  const history = useHistory();
  if (!currentUser) {
    history.push("/login");
  }

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
