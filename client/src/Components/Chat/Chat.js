import React, { createRef, useState } from "react";
import { io } from "socket.io-client";

export default function Chat() {
  const [messages, setMessages] = useState(["hello"]);

  const socket = io("http://localhost:3001");
  socket.on("chat-message", (data) => {
    console.log("chat.js chat-message", data);
    const updatedMessages = [...messages];
    updatedMessages.push(data);
    console.log(updatedMessages);
    setMessages(updatedMessages);
  });

  const formRef = createRef();

  const handleClick = () => {
    const form = formRef.current;
    socket.emit("send-chat-message", form.message.value);
    form.reset();
  };

  return (
    <>
      {messages.map((message) => (
        <p>message</p>
      ))}
      <form ref={formRef}>
        <input name="message" />
        <button type="button" onClick={handleClick}>
          Submit
        </button>
      </form>
    </>
  );
}
