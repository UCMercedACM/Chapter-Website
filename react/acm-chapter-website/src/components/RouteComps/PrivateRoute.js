import React from "react";
import { auth } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { Route, Redirect } from "react-router-dom";

export default function PrivateRoute({ children, ...rest }) {
  console.log("PrivateRoute");
  console.log(auth.currentUser);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.currentUser ? (
          auth.currentUser.emailVerified ? (
            children
          ) : (
            <Redirect to="/verifyEmail" />
          )
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
