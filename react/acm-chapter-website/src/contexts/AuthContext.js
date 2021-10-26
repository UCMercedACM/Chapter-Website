import React, { useContext, useState, useEffect } from "react";
import { auth, firebase } from "../firebase/config";
import { useHistory } from "react-router-dom";
import { getAuth, linkWithPopup, GithubAuthProvider } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [authError, setAuthError] = useState("");
  const history = useHistory();

  const githubProvider = new GithubAuthProvider();

  function signup(email, password, name) {
    let data;
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        if (cred.user.emailVerified === false) {
          cred.user.sendEmailVerification();
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
            history.push("/dashboard");
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

  function linkGithub() {
    let data;
    linkWithPopup(auth.currentUser, githubProvider).then((result) => {
      const credential = GithubAuthProvider.credentialFromResult(result);
      const user = result.user;
      const usersRef = firebase.firestore().collection("users");
      usersRef
        .doc(user.uid)
        .get()
        .then((document) => {
          data = document.data();
          data.github = credential;
        });
      usersRef
        .doc(user.uid)
        .set(data)
        .then(() => {
          setTimeout(function () {
            history.push("/dashboard");
          }, 2000);
        });
    });
  }

  async function logout() {
    return auth.signOut();
  }

  function sendEmailVerif() {
    console.log("email sent");
    return auth.sendEmailVerification();
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
            user.reload();
          });
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    sendEmailVerif,
    currentUser,
    authError,
    login,
    signup,
    linkGithub,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
