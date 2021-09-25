import React from "react";
import closeIcon from "../../assets/icons/close-icon.png";

export default function PlayerHeader({ handlePlayerIconClick }) {
  return (
    <div className="player__header">
      <div className="player__header-grabbable">
        <p>Media Player</p>
      </div>
      <button className="player__close-button">
        <img
          src={closeIcon}
          onClick={() => handlePlayerIconClick()}
          alt="Click X to close"
        />
      </button>
    </div>
  );
}
