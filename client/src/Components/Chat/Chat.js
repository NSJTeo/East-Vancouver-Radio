import React, { createRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

export default function Chat() {
  const socket = io("http://localhost:3001");
  socket.on("chat-message", (data) => {
    console.log("chat.js chat-message", data);
  });

  const formRef = createRef();

  const handleClick = () => {
    const form = formRef.current;
    // socket.emit("send-chat-message", form.message.value);
    form.reset();
    axios.get("http://localhost:8081/chat").then((response) => {
      console.log(response.data);
    });
  };

  return (
    <>
      {/* {messages.map((message) => (
        <p>message</p>
      ))} */}
      <form ref={formRef}>
        <input name="message" />
        <button type="button" onClick={handleClick}>
          Submit
        </button>
      </form>
    </>
  );
}
