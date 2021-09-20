import React from "react";

export default function Player() {
  return (
    <>
      <audio
        className="player"
        src="http://localhost:8080/stream"
        controls
        autoplay
      />
    </>
  );
}
