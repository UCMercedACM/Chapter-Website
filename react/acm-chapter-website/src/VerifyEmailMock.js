import React, { useState } from "react";
import "./verifyEmailMock.scss";

const VerifyEmailMock = () => {
  const [verified, setVerified] = useState(true);
  return (
    <div className="login">
      <div className="login__landing">
        <header>
          <h2>Verify Your Email</h2>
          <p>Click the Link at the Email</p>
        </header>
        <p className={verified ? "verified" : ""}>Not verified</p>
        <button onClick={console.log("button pressed")}>
          Send Verification Email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailMock;
