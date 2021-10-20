import React from "react";
import "./SectionTitle.scss";

const SectionTitle = ({ text }) => {
  return (
    <div class="section-title">
      <div class="section-title__content">
        <h1 class="section-title__content__text">{text}</h1>
        <div class="section-title__content__bar"></div>
      </div>
    </div>
  );
};

export default SectionTitle;
