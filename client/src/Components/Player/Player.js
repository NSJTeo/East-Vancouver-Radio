import React, { useState, createRef, useEffect } from "react";
import Draggable from "react-draggable";
import axios from "axios";
import { io } from "socket.io-client";
import PlayerHeader from "../PlayerHeader/PlayerHeader";

export default function Player(props) {
  //
  const { playerOn, handlePlayerIconClick, activeWindow, setPlayerToActive } =
    props;
  //
  const [muted, setMuted] = useState(false);
  const [currentShow, setCurrentShow] = useState("");
  const [socket, setSocket] = useState(null);
  //
  const playerRef = createRef();
  //
  const toggleMute = () => {
    setMuted(true);
  };
  const getCurrentShow = () => {
    axios.get("http://localhost:8081/current-show").then((response) => {
      setCurrentShow(response.data);
    });
  };
  const playAudio = () => {
    setMuted(false);
    playerRef.current.play();
  };
  //
  useEffect(() => {
    const newSocket = io("http://localhost:3002");
    setSocket(newSocket);
    getCurrentShow();
    playerRef.current.play();
  }, []);

  if (socket) {
    socket.on("song-information", (data) => {
      setCurrentShow(data);
    });
  }

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
          <p className="player__now-playing-text">
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
