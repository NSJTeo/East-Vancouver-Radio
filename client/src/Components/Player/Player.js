import React, { useState, createRef } from "react";

export default function Player(props) {
  const [muted, setMuted] = useState(false);
  const [play, setPlay] = useState(true);
  const playerRef = createRef();
  const { playerOn } = props;
  console.log(playerOn);

  const toggleMute = () => {
    setMuted(!muted);
    // playerRef.current.play();
  };

  const playAudio = () => {
    playerRef.current.play();
    setPlay(false);
  };

  return (
    <div
      className={`player__container ${
        playerOn ? "" : "player__container--hidden"
      }`}
    >
      {muted ? <p>Muted</p> : null}
      <audio
        ref={playerRef}
        src="http://localhost:8080/stream"
        type="audio/mp3"
        muted={muted}
        controls
        onWaiting={() => setPlay(true)}
      />
      <button type="button" onClick={toggleMute}>
        Mute
      </button>
      {play ? (
        <button type="button" onClick={playAudio}>
          Start Listening
        </button>
      ) : null}
    </div>
  );
}
