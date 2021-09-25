import React from "react";
import closeIcon from "../../assets/icons/close-icon.png";

export default function SetupHeader({ handleSetupIconClick }) {
  return (
    <div className="setup__header">
      <div className="setup__header-grabbable">
        <p>Setup</p>
      </div>
      <button className="setup__close-button">
        <img
          src={closeIcon}
          onClick={() => handleSetupIconClick()}
          alt="Click X to close"
        />
      </button>
    </div>
  );
}
