import React from "react";
import { Link } from "react-router-dom";
import "./Login.scss";
import { useAuth } from "../../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import { useFormik } from 'formik';

const ResetPassword = () => {
  const {resetPassword} = useAuth()

  const history = useHistory();
 
  



  const formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: values => {
      resetPassword(values.email)
      history.push("/login");
    },
  });

  return (
    <div>
      <main className="login">

    <form onSubmit={formik.handleSubmit} className="login__landing">
    <header>
            <h2>Reset</h2>
            <p>We will send you an Email!</p>
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

<button type="submit" onClick={formik.handleSubmit}>
              Reset
            </button>
  </form>
      </main>
    </div>
  );
};

export default ResetPassword;
