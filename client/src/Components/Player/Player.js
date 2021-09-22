import React, { useState, createRef } from "react";
import Draggable from "react-draggable";
import closeIcon from "../../assets/icons/close-icon.png";

export default function Player(props) {
  const playerRef = createRef();
  const { playerOn, handlePlayerIconClick } = props;
  console.log(playerOn);

  const toggleMute = () => {
    // playerRef.current.play();
  };

  const playAudio = () => {
    playerRef.current.play();
  };

  return (
    <Draggable
      allowAnyClick={false}
      bounds="parent"
      // handle=".player__header-grabbable"
    >
      <div
        className={`player__container ${
          playerOn ? "" : "player__container--hidden"
        }`}
      >
        <audio
          ref={playerRef}
          src="http://localhost:8080/stream"
          type="audio/mp3"
          controls
          className="player__container--hidden"
        />
        <div className="player__header">
          <p className="player__header-title">Media Player</p>
          <div className="player__header-grabbable"></div>
          <button className="chat__close-button">
            <img src={closeIcon} onClick={() => handlePlayerIconClick()} />
          </button>
        </div>
        <button type="button" onClick={toggleMute}>
          Pause
        </button>
        <button type="button" onClick={playAudio}>
          Play
        </button>
      </div>
    </Draggable>
  );
}
