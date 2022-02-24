import React from "react";
import "../../sass/components/Login.scss"; // change to Register.scss later
// import "../../sass/components/Register.scss";
import { ErrorMessage, Formik, Form, Field } from "formik";
import { useAuth } from "../../contexts/AuthContext";

import * as Yup from "yup";
import { Link } from "react-router-dom";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string()
    .email("Invalid email")
    // .matches(
    //   /([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@ucmerced([\.])edu/g,
    //   'Not @ucmerced.edu Email'
    // )
    .required("Required"),
  password: Yup.string()
    .min(6, "Too Short!")
    .max(15, "Too Long!")
    .required("Required"),
  confirmPassword: Yup.string()
    .min(6, "Too Short!")
    .max(15, "Too Long!")
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const Register = () => {
  const { signup, authError } = useAuth();
  // function submitHandler(values, setFieldError) {
  //   const { email, password, name } = values;
  //   try {
  //     signup(email, password, name);
  //   } catch (err) {
  //     setFieldError("authErrors", err.message);
  //   }
  // }

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={SignupSchema}
      validateOnBlur
      onSubmit={async (values) => {
        console.log(signup, "signup");
        await signup(values.email, values.password, values.name);
      }}
    >
      {({ handleSubmit }) => (
        <div>
          <main className="login">
            <Form className="landing">
              <header>
                <h2>Register</h2>
                <p>Welcome to ACM @UCM</p>
              </header>
              <div className="field">
                <Field
                  className="input"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name"
                />
                <div className="error">
                  <ErrorMessage name="name" />
                </div>
              </div>
              <div className="field">
                <Field
                  className="input"
                  id="email"
                  placeholder="Email"
                  name="email"
                  type="email"
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
                />
                <div className="error">
                  <ErrorMessage name="password" />
                </div>
              </div>
              <div className="field">
                <Field
                  className="input"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                />
                <div className="error">
                  <ErrorMessage name="confirmPassword" />
                </div>
              </div>
              {authError}
              <div className="footer-buttons">
                <button type="submit" onClick={handleSubmit}>
                  Submit
                </button>

                <div className="align-x createAcc">
                  <p>Don't have an account?</p>
                  <Link to="/register">Create an account</Link>
                </div>
              </div>
            </Form>
          </main>
        </div>
      )}
    </Formik>
  );
};

export default Register;
