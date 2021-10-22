import React from "react";
import "../login/Login.scss";
import { useFormik } from "formik";
import { useAuth } from "../../contexts/AuthContext";

const Register = () => {
  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Required";
    } else if (values.name.length > 15) {
      errors.name = "Must be 15 characters or less";
    }
    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Required";
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Required";
    }

    return errors;
  };
  const { signup } = useAuth();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate,
    onSubmit: (values) => {
      signup(values.email, values.password, values.name);
    },
  });
  return (
    <div>
      <main className="login">
        <form onSubmit={formik.handleSubmit} className="login__landing">
          <header>
            <h2>Register</h2>
            <p>Welcome to ACM @UCM</p>
          </header>

          <input
            className="input"
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name && formik.touched.name ? (
            <div>{formik.errors.name}</div>
          ) : null}

          <input
            className="input"
            id="email"
            placeholder="Email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && formik.touched.email ? (
            <div>{formik.errors.email}</div>
          ) : null}
          <input
            className="input"
            id="password"
            placeholder="Password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password && formik.touched.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
          <input
            className="input"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
            <div>{formik.errors.confirmPassword}</div>
          ) : null}
          <button type="submit">Submit</button>
        </form>
      </main>
    </div>
  );
};

export default Register;
