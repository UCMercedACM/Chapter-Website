import React from "react";
import { auth } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { Route, Redirect } from "react-router-dom";

export default function PrivateRoute({ children, ...rest }) {
  let { currentUser } = useAuth();
  console.log("PrivateRoute");
  return (
    <Route
      {...rest}
      render={({ location }) =>
        currentUser || auth.currentUser ? (
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
