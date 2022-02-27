import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../firebase/config";

function PublicRoute({ children, ...rest }) {
  console.log("PUBLIC ROUTE");
  console.log(auth.currentUser);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.currentUser ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    />
  );
}

export default PublicRoute;
