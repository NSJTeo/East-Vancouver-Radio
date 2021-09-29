import React from "react";
import closeIcon from "../../assets/icons/close-icon.png";

export default function AboutHeader({ handleAboutIconClick }) {
  return (
    <div className="about-header__container">
      <div className="about-header__grabbable">
        <p>About</p>
      </div>
      <button className="about-header__close-button">
        <img
          src={closeIcon}
          onClick={() => handleAboutIconClick()}
          alt="Click X to close"
        />
      </button>
    </div>
  );
}
