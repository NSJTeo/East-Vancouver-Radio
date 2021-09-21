import React, { createRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import ChatMessage from "../ChatMessage/ChatMessage";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(null);

  const getChatMessages = () => {
    axios.get("http://localhost:8081/chat").then((response) => {
      console.log("response data", response.data);
      setMessages(response.data);
    });
  };

  useEffect(() => {
    getChatMessages();
    // get username from session storage
  }, []);

  const socket = io("http://localhost:3001");
  socket.on("chat-message", (data) => {
    console.log("chat.js chat-message", data);
    getChatMessages();
  });

  const formRef = createRef();
  const userRef = createRef();

  const handleClick = () => {
    const form = formRef.current;
    socket.emit("send-chat-message", form.message.value);
    const newMessage = {
      name: username,
      body: form.message.value,
    };

    axios.post("http://localhost:8081/chat", newMessage).then((response) => {
      console.log(response.data);
      getChatMessages();
      form.reset();
    });
  };

  const handleUsername = () => {
    const username = userRef.current.username.value;
    setUsername(username);
    userRef.current.reset();
  };

  return (
    <>
      <ol>
        {messages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
      </ol>
      {username ? (
        <form ref={formRef}>
          <input name="message" />
          <button type="button" onClick={handleClick}>
            Submit
          </button>
        </form>
      ) : (
        <form ref={userRef}>
          <input name="username" />
          <button type="button" onClick={handleUsername}>
            Set Username
          </button>
        </form>
      )}
      {username && <p>Logged in as: {username}</p>}
    </>
  );
}
