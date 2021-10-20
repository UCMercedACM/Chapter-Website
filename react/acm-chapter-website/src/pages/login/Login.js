import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./Login.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const pwElement = useRef();
  const eyeHandler = () => {
    if (pwElement.type === "password") {
      pwElement.current.type = "text";
    } else {
      pwElement.current.type = "password";
    }
  };

  const handleSubmit = () => {};

  return (
    <div>
      <main className="login">
        <form className="login__landing">
          <header>
            <h2>Login</h2>
            <p>Welcome to ACM @UCM</p>
          </header>
          <input
            className="input"
            id="txt-input"
            type="text"
            placeholder="Email"
            name="email"
            required
          />
          {/* <div className="pass-wrapper"> */}
          <input
            className="input"
            type="password"
            placeholder="Password"
            id="pwd"
            name="password"
            ref={pwElement}
            required
          />
          {/* <i>
              <FontAwesomeIcon icon={faEye} id="eye" onClick={eyeHandler} />
            </i> */}
          {/* </div> */}
          <div className="footer-buttons">
            <div className="align-x">
              <input id="c1d" type="checkbox" />
              <label for="c1d">Remember me?</label>
              <Link to="">Forgot my password?</Link>
            </div>
            <button type="submit" onClick={handleSubmit}>
              Sign In
            </button>
            <div className="align-x createAcc">
              <p>Don't have an account?</p>
              <Link to="/register">Create an account</Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
