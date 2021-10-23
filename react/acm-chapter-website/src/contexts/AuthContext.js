import React, { useContext, useState, useEffect } from "react";
import { auth, firebase } from "../firebase/config";
import { useHistory } from "react-router-dom";
// import { getAuth, linkWithPopup, GithubAuthProvider } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [authError, setAuthError] = useState("");
  const history = useHistory();

  // const githubProvider = new GithubAuthProvider();

  function signup(email, password, name) {
    let data;
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        if (cred.user.emailVerified === false) {
          auth.signOut();
          cred.user.sendEmailVerification();
          history.push("/verifyEmail");
        }
        const uid = cred.user.uid;
        data = {
          id: uid,
          email: email,
          name: name,
        };
        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            setTimeout(function () {
              history.push("/dashboard");
            }, 2000);
          });
      })
      .catch((err) => {
        console.log(err.code, "errCode");
        switch (err.code) {
          case "auth/email-already-in-use":
            setAuthError("Email is Already Used");
            return;
          case "auth/invalid-credential":
            setAuthError("Email or Password is Incorrect");
            return;
          case "auth/internal-error":
            setAuthError("Something went wrong");
            return;
          case "auth/too-many-requests":
            setAuthError("Too Many Tries, Slow Down");
            return;
          default:
            setAuthError("");
        }
      });
  }

  function login(email, password) {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then((cred) => {
        if (cred.user.emailVerified === false) {
          cred.user.sendEmailVerification();
          history.push("/verifyEmail");
        } else if (cred.user) {
          history.push("/dashboard");
        }
        history.push("/login");
      })
      .catch((err) => {
        console.log(err.code, "errCode");
        switch (err.code) {
          case "auth/email-already-in-use":
            setAuthError("Email is Already Used");
            return;
          case "auth/invalid-credential":
            setAuthError("Email or Password is Incorrect");
            return;
          case "auth/internal-error":
            setAuthError("Something went wrong");
            return;
          case "auth/wrong-password":
            setAuthError("Email or Password is Incorrect");
            return;
          case "auth/too-many-requests":
            setAuthError("Too Many Tries, Slow Down");
            return;
          default:
            setAuthError(err.code);
        }
      });
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    console.log(email + "yeet");
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get()
          .then((document) => {
            setCurrentUser(document.data());
          });
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    authError,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
