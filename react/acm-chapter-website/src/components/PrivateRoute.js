import React from "react";
import { auth } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import { Route, Redirect, useHistory } from "react-router-dom";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();
  console.log(currentUser);
  console.log(auth.currentUser);

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser || auth.currentUser ? (
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
