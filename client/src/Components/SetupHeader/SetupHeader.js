import React from "react";
import closeIcon from "../../assets/icons/close-icon.png";

export default function SetupHeader({ handleSetupIconClick }) {
  return (
    <div className="setup-header__container">
      <div className="setup-header__grabbable">
        <p>Setup</p>
      </div>
      <button className="setup-header__button">
        <img
          src={closeIcon}
          onClick={() => handleSetupIconClick()}
          alt="Click X to close"
        />
      </button>
    </div>
  );
}
