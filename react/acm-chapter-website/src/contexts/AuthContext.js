import React, { useContext, useState, useEffect } from "react"
import { auth,firebase } from "../firebase/config"
const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  
  function signup(email, password,name) {
    var data;
    return auth.createUserWithEmailAndPassword(email, password).then((response) => {
      const uid = response.user.uid
       data = {
          id: uid,
          email: email,
          name: name,
      };
    const usersRef = firebase.firestore().collection('users')
    usersRef
        .doc(uid)
        .set(data)
        .catch((error) => {
            alert(error)
        });
  })
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    console.log(email + 'yeet')
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        firebase.firestore().collection("users")
          .doc(user.uid)
          .get()
          .then((document) => {
      setCurrentUser(document.data())
          })
    }})
  
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}