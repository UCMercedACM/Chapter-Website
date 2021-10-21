import React from "react";
import "./ErrorCard.scss";
import { ErrorMessage } from "formik";

const ErrorCard = ({ errors, values }) => {
  const valuesArr = Object.keys(values);
  const errorsArr = Object.keys(errors);

  return (
    <div className="errorCard">
      {valuesArr.map((value) => {
        console.log(value, "value");
        return (
          <div className="tag">
            {value}
            <div className="error">
              {errorsArr.map((error) => {
                console.log(error, "error");
                return <ErrorMessage name={error} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ErrorCard;
