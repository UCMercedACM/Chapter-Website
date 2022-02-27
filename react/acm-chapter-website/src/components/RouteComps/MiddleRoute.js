import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../firebase/config";

function MiddleRoute({ children, ...rest }) {
  const { authUser } = useAuth();
  console.log("MIDDLE ROUTE");
  console.log(auth.currentUser);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.currentUser && auth.currentUser.emailVerified ? (
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

export default MiddleRoute;
