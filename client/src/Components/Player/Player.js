import React, { useState, createRef, useEffect } from "react";
import Draggable from "react-draggable";
import axios from "axios";
import { io } from "socket.io-client";
import PlayerHeader from "../PlayerHeader/PlayerHeader";

export default function Player(props) {
  const [muted, setMuted] = useState(false);
  const [currentShow, setCurrentShow] = useState("");
  const playerRef = createRef();
  const { playerOn, handlePlayerIconClick, activeWindow, setPlayerToActive } =
    props;

  const toggleMute = () => {
    setMuted(true);
  };

  const socket = io("http://localhost:3002");
  socket.on("song-information", (data) => {
    setCurrentShow(data);
  });

  const getCurrentShow = () => {
    axios.get("http://localhost:8081/current-show").then((response) => {
      setCurrentShow(response.data);
    });
  };

  useEffect(() => {
    getCurrentShow();
    playerRef.current.play();
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
        onMouseDownCapture={() => setPlayerToActive()}
      >
        <audio
          id="audio-player"
          ref={playerRef}
          src="http://localhost:8080/stream"
          type="audio/mp3"
          muted={muted}
          controls
          className="player__container--hidden"
        />
        <PlayerHeader handlePlayerIconClick={handlePlayerIconClick} />
        {currentShow ? (
          <p>
            Now Playing: {currentShow.title} by {currentShow.artist}
          </p>
        ) : (
          <p>Off-Air</p>
        )}
        <div className="player__buttons">
          <button className="player__button" type="button" onClick={toggleMute}>
            Pause
          </button>
          <button className="player__button" type="button" onClick={playAudio}>
            Play
          </button>
        </div>
      </div>
    </Draggable>
  );
}
