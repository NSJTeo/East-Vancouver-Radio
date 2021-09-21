import React, { createRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

export default function Chat() {
  const [messages, setMessages] = useState([]);

  const getChatMessages = () => {
    axios.get("http://localhost:8081/chat").then((response) => {
      console.log("response data", response.data);
      setMessages(response.data);
    });
  };

  useEffect(() => {
    getChatMessages();
  }, []);

  const socket = io("http://localhost:3001");
  socket.on("chat-message", (data) => {
    console.log("chat.js chat-message", data);
    getChatMessages();
  });

  const formRef = createRef();

  const handleClick = () => {
    const form = formRef.current;
    socket.emit("send-chat-message", form.message.value);
    const newMessage = {
      body: form.message.value,
    };

    axios.post("http://localhost:8081/chat", newMessage).then((response) => {
      console.log(response.data);
      getChatMessages();
      form.reset();
    });
  };

  return (
    <>
      {messages.map((message) => (
        <p key={message.id}>{message.body}</p>
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
