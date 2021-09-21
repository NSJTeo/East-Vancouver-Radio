import React from "react";
import { io } from "socket.io-client";

export default function Chat() {
  const socket = io("http://localhost:3001");
  socket.on("chat-message", (data) => {
    console.log(data);
  });
  return <div>Chat</div>;
}
