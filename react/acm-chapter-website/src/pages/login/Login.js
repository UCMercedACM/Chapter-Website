import React from "react";
import { Link, useHistory } from "react-router-dom";
import "./Login.scss";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../firebase/config";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

const Login = () => {
  const { login, authError } = useAuth();
  console.log(auth.currentUser);

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={LoginSchema}
      validateOnBlur
      onSubmit={async (values) => {
        console.log("login");
        await login(values.email, values.password);
      }}
    >
      {({ handleSubmit, handleChange, values }) => (
        <main className="login">
          <Form onSubmit={handleSubmit} className="landing">
            <header>
              <h2>Login</h2>
              <p>Welcome to ACM @UCM</p>
            </header>
            <div className="field">
              <Field
                className="input"
                id="email"
                placeholder="Email"
                name="email"
                type="email"
                onChange={handleChange}
                value={values.email}
              />
              <div className="error">
                <ErrorMessage name="email" />
              </div>
            </div>
            <div className="field">
              <Field
                className="input"
                id="password"
                placeholder="Password"
                name="password"
                type="password"
                onChange={handleChange}
                value={values.password}
              />
              <div className="error">
                <ErrorMessage name="password" />
              </div>
            </div>
            {authError}
            <div className="footer-buttons">
              <div className="align-x">
                <input id="c1d" type="checkbox" />
                <label for="c1d">Remember me?</label>
                <Link to="/reset">Forgot my password?</Link>
              </div>
              <button type="submit" onClick={handleSubmit}>
                Sign In
              </button>
              <div className="align-x createAcc">
                <p>Don't have an account?</p>
                <Link to="/register">Create an account</Link>
              </div>
            </div>
          </Form>
        </main>
      )}
    </Formik>
  );
};

export default Login;
