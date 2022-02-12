import React from "react";
import "./SectionTitle.scss";

const SectionTitle = ({ text }) => {
  return (
    <div className="section-title">
      <div className="section-title__content">
        <h1 className="section-title__content__text">{text}</h1>
        <div className="section-title__content__bar"></div>
      </div>
    </div>
  );
};

export default SectionTitle;
