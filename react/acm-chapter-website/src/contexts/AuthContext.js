import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import useSessionStorage from "../hooks/useSessionStorage";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [authUser, setAuthUser] = useSessionStorage("authUser");
  const [authError, setAuthError] = useState("");
  const history = useHistory();

  function signup(email, password, name) {
    console.log("signup");
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (cred) => {
        const uid = cred.user.uid;
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, {
          id: uid,
          email: email,
          name: name,
          eventsAttended: [],
        }).then(() => {
          setAuthUser(cred.user);

          history.push("/dashboard");
        });
        console.log("signup2");
      })
      .catch((err) => {
        console.log(err, "errCode");
        switch (err.code) {
          case "auth/email-already-in-use":
            setAuthError("Email is Already Used");
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
    console.log("signin");

    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        if (cred.user.emailVerified === false) {
          sendEmailVerification(cred.user);
          history.push("/verifyEmail");
        } else if (cred.user) {
          setAuthUser(cred.user);
          console.log(cred.user);
          history.push("/");
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
            setAuthError("");
        }
      });
  }

  // function linkGithub() {
  //   let data;
  //   linkWithPopup(auth.currentUser, githubProvider).then((result) => {
  //     const credential = GithubAuthProvider.credentialFromResult(result);
  //     const user = result.user;
  //     const usersRef = firebase.firestore().collection("users");
  //     usersRef
  //       .doc(user.uid)
  //       .get()
  //       .then((document) => {
  //         data = document.data();
  //         data.github = credential;
  //       });
  //     usersRef
  //       .doc(user.uid)
  //       .set(data)
  //       .then(() => {
  //         setTimeout(function () {
  //           history.push("/dashboard");
  //         }, 2000);
  //       });
  //   });
  // }

  async function logout() {
    signOut(auth).then(async () => {
      history.push("/login");
      setAuthUser("loggedOut");
      window.location.reload();
    });
  }

  function sendEmailVerif() {
    console.log("email sent");

    return auth.sendEmailVerification();
  }

  function resetPassword(email) {
    console.log(email + "yeet");

    sendPasswordResetEmail(auth, email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  async function authListener(user) {
    if (user) {
      setAuthUser(user);
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      setCurrentUser(userSnap.data());
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authListener);
    return unsubscribe;
  }, []);

  const value = {
    sendEmailVerif,
    currentUser,
    authUser,
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
