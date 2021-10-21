import React from "react";
import { Link } from "react-router-dom";
import "./Login.scss";
import { useAuth } from "../../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import { useFormik } from 'formik';

const Login = () => {
  const {login} = useAuth()

  const history = useHistory();
 
  const validate = values => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
      errors.password = 'Required';
    } 
    return errors;
  };



  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
      login(values.email,values.password)
      history.push("/");
    },
  });

  return (
    <div>
      <main className="login">

    <form onSubmit={formik.handleSubmit} className="login__landing">
    <header>
            <h2>Login</h2>
            <p>Welcome to ACM @UCM</p>
          </header>
   
    <input
      className="input"
      id="email"
      placeholder="Email"
      name="email"
      type="email"
      onChange={formik.handleChange}
      value={formik.values.email}
    />

    <input
      className="input"
      id="password"
      placeholder="Password"
      name="password"
      type="password"
      onChange={formik.handleChange}
      value={formik.values.password}
    />

    

   

    <div className="footer-buttons">
            <div className="align-x">
              <input id="c1d" type="checkbox" />
              <label for="c1d">Remember me?</label>
              <Link to="/reset">Forgot my password?</Link>
            </div>
            <button type="submit" onClick={formik.handleSubmit}>
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
