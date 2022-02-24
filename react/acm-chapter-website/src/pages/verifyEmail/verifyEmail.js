import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DelayRedirect from "../../components/CustomLink/DelayRedirect";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase/config";
import "../../sass/components/verifyEmail.scss";
import { useAuth } from "../../contexts/AuthContext";

const VerifyEmail = () => {
  const [user, setUser] = useState();
  const [dummy, setDummy] = useState(true);
  const [verified, setVerified] = useState();

  function sendEmail() {
    const loadedUser = auth.currentUser;
    setUser(loadedUser);
    sendEmailVerification(loadedUser);
  }

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
        {user || auth.currentUser ? (
          <p
            className={
              verified || auth.currentUser.emailVerified ? "verified" : ""
            }
          >
            {verified || auth.currentUser.emailVerified
              ? "Verified"
              : "User Not Verified "}
          </p>
        ) : (
          <p>User unavailable</p>
        )}
        {!verified ? (
          <button onClick={sendEmail}>Send Verification Email to verify</button>
        ) : (
          ""
        )}
        {verified && <Link to="/dashboard">Go to Dashboard</Link>}
      </div>
    </div>
  );
};

export default VerifyEmail;
