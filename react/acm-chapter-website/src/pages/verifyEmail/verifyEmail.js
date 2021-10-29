import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DelayRedirect from "../../components/CustomLink/DelayRedirect";
import { auth } from "../../firebase/config";
import "./verifyEmail.scss";

const VerifyEmail = () => {
  const [user, setUser] = useState();
  const [dummy, setDummy] = useState(true);
  const [verified, setVerified] = useState();

  function sendEmail() {
    const loadedUser = auth.currentUser;
    setUser(loadedUser);
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
          const loadedUser = auth.currentUser;
          setUser(loadedUser);
          setVerified(loadedUser.emailVerified);
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
        {user ? (
          <p className={verified ? "verified" : ""}>
            {verified ? "Verified" : "User Not Verified "}
          </p>
        ) : (
          <p>User unavailable</p>
        )}
        {!verified && (
          <button onClick={sendEmail}>Send Verification Email to verify</button>
        )}
        {verified && <Link to="/dashboard">Go to Dashboard</Link>}
      </div>
    </div>
  );
};

export default VerifyEmail;
