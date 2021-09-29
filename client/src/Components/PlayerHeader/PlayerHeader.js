import React from "react";
import closeIcon from "../../assets/icons/close-icon.png";

export default function PlayerHeader({ handlePlayerIconClick }) {
  return (
    <div className="player-header__container">
      <div className="player-header__grabbable">
        <p>Media Player</p>
      </div>
      <button className="player-header__close-button">
        <img
          src={closeIcon}
          onClick={() => handlePlayerIconClick()}
          alt="Click X to close"
        />
      </button>
    </div>
  );
}
