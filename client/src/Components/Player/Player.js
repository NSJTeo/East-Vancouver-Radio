import React, { useState, createRef, useEffect } from "react";
import Draggable from "react-draggable";
import closeIcon from "../../assets/icons/close-icon.png";
import axios from "axios";

export default function Player(props) {
  const [muted, setMuted] = useState(false);
  const [currentShow, setCurrentShow] = useState("");
  const playerRef = createRef();
  const { playerOn, handlePlayerIconClick, activeWindow, setPlayerToActive } =
    props;

  const toggleMute = () => {
    setMuted(true);
  };

  useEffect(() => {
    // refactor into a different function that is set as a node schedule job for the top of the hour and 2 minutes after the hour
    axios.get("http://localhost:8081/current-show").then((response) => {
      setCurrentShow(response.data);
    });
  }, []);

  const playAudio = () => {
    setMuted(false);
    playerRef.current.play();
  };

  return (
    <Draggable
      allowAnyClick={false}
      bounds="parent"
      handle=".player__header-grabbable"
    >
      <div
        className={`player__container ${
          playerOn ? "" : "player__container--hidden"
        } ${"player" === activeWindow ? "active" : ""}`}
        // onClick={() => setPlayerToActive()}
        onMouseDownCapture={() => setPlayerToActive()}
      >
        <audio
          ref={playerRef}
          src="http://localhost:8080/stream"
          type="audio/mp3"
          muted={muted}
          controls
          className="player__container--hidden"
        />
        <div className="player__header">
          <p className="player__header-title">Media Player</p>
          <div className="player__header-grabbable"></div>
          <button className="player__close-button">
            <img src={closeIcon} onClick={() => handlePlayerIconClick()} />
          </button>
        </div>
        {currentShow ? (
          <p>
            Now Playing: {currentShow.title} by {currentShow.artist}
          </p>
        ) : (
          <p>Off-Air</p>
        )}
        {/* Need some icons and styles for these... please! */}
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
