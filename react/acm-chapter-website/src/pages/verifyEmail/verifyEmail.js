import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { auth } from "../../firebase/config";
import "./verifyEmail.scss";

const VerifyEmail = () => {
  const [user, setUser] = useState();
  const [dummy, setDummy] = useState(true);
  const [verified, setVerified] = useState();

  function sendEmail() {
    user.sendEmailVerification();
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged((curUser) => {
      setVerified(curUser.emailVerified);
      setUser(curUser);
    });
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
      <div className="login__landing">
        <header>
          <h2>Verify Your Email</h2>
          <p>Click the Link at the Email</p>
        </header>
        {user ? (
          <p className={verified ? "verified" : ""}>
            {verified ? "Verified" : "Not Verified"}
          </p>
        ) : (
          <p>"User unavailable"</p>
        )}
        <button onClick={sendEmail}>Send Verification Email</button>
        {verified ? (
          <Link to="/dashboard">Go to Dashboard</Link>
        ) : (
          setTimeout(() => {
            <Redirect to="/dashboard" />;
          }, 2000)
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
