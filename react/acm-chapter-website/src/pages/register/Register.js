import React from "react";
import "../login/Login.scss";
import { ErrorMessage, Formik, Form, Field } from "formik";
import { useAuth } from "../../contexts/AuthContext";
import * as Yup from "yup";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .matches(
      /([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@ucmerced([\.])edu/g,
      "Not @ucmerced.edu Email"
    )
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
      onSubmit={async (values) => {
        console.log(signup, "signup");
        await signup(values.email, values.password, values.name);
      }}
    >
      {({ errors }) => (
        <div>
          <main className="login">
            <Form className="login__landing">
              <header>
                <h2>Register</h2>
                <p>Welcome to ACM @UCM</p>
              </header>

              <Field
                className="input"
                id="name"
                name="name"
                type="text"
                placeholder="Name"
              />
              <ErrorMessage name="name" />

              <Field
                className="input"
                id="email"
                placeholder="Email"
                name="email"
                type="email"
              />
              <ErrorMessage name="email" />

              <Field
                className="input"
                id="password"
                placeholder="Password"
                name="password"
                type="password"
              />
              <ErrorMessage name="password" />

              <Field
                className="input"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
              />
              <ErrorMessage name="confirmPassword" />

              <button type="submit">Submit</button>
              {authError}
            </Form>
          </main>
        </div>
      )}
    </Formik>
  );
};

export default Register;
