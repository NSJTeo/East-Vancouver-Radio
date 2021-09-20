import React, { useState, createRef } from "react";

export default function Player() {
  const [muted, setMuted] = useState(false);
  const [play, setPlay] = useState(true);
  const playerRef = createRef();

  const toggleMute = () => {
    setMuted(!muted);
    // playerRef.current.play();
  };

  const playAudio = () => {
    playerRef.current.play();
    setPlay(false);
  };

  return (
    <>
      {muted ? <p>Muted</p> : null}
      <audio
        ref={playerRef}
        src="http://localhost:8080/stream"
        type="audio/mp3"
        muted={muted}
        controls
        onPlay={() => console.log("play")}
        onEnded={() => console.log("ended")}
        onWaiting={() => setPlay(true)}
        onPlaying={() => console.log("playing")}
      />
      <button type="button" onClick={toggleMute}>
        Mute
      </button>
      {play ? (
        <button type="button" onClick={playAudio}>
          Start Listening
        </button>
      ) : null}
    </>
  );
}
