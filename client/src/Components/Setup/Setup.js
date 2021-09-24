import React from "react";
import Draggable from "react-draggable";
import closeIcon from "../../assets/icons/close-icon.png";

export default function Setup(props) {
  const { setupOn, handleSetupIconClick, activeWindow, setSetupToActive } =
    props;
  return (
    <Draggable
      allowAnyClick={false}
      bounds="parent"
      handle=".player__header-grabbable"
    >
      <div
        className={`player__container ${
          setupOn ? "" : "player__container--hidden"
        } ${"player" === activeWindow ? "active" : ""}`}
        // onClick={() => setPlayerToActive()}
        onMouseDownCapture={() => setSetupToActive()}
      >
        <div className="setup__header">
          <p className="setup__header-title">Setup</p>
          <div className="setup__header-grabbable"></div>
          <button className="setup__close-button">
            <img src={closeIcon} onClick={() => handleSetupIconClick()} />
          </button>
        </div>
        <div>Content</div>
      </div>
    </Draggable>
  );
}
