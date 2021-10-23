import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase/config";
import "../../pages/login/Login.scss";

const VerifyEmail = () => {
  const [user, setUser] = useState();
  const [dummy, setDummy] = useState(true);

  function sendEmail() {
    user.sendEmailVerification();
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged((curUser) => setUser(curUser));
    return subscriber; // unsubscribe on unmount
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      setDummy(!dummy);
      try {
        if (user) {
          await user.reload();
        }
      } catch (error) {
        console.log(error);
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div className="login">
      <p>
        {user ? (
          user.emailVerified ? (
            <Link to="/dashboard">Go to Dashboard</Link>
          ) : (
            "Not verified"
          )
        ) : (
          "User unavailable"
        )}
      </p>
      <button onClick={sendEmail}>Send Verification Email</button>
    </div>
  );
};

export default VerifyEmail;
