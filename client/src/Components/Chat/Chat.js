import React, { createRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import ChatMessage from "../ChatMessage/ChatMessage";
import closeIcon from "../../assets/icons/close-icon.png";
import Draggable from "react-draggable";

export default function Chat(props) {
  const [messages, setMessages] = useState([]);
  // set username to session storage, get from session storage during useEffect
  const [username, setUsername] = useState(null);

  const { chatOn, handleChatIconClick, activeWindow, setChatToActive } = props;

  const getChatMessages = () => {
    axios.get("http://localhost:8081/chat").then((response) => {
      // sort messages by timestamp
      const messagesArray = response.data;
      setMessages(messagesArray);
    });
  };
  const messageEndRef = createRef();

  const scrollToBottom = () => {
    console.log("scrolling to bottom");
    if (!messageEndRef.current) {
      return;
    }
    messageEndRef.current.scrollIntoView();
  };

  useEffect(() => {
    console.log("use effect");
    getChatMessages();
  }, []);

  // useEffect(() => {
  //   console.log("2nd scroll effect");
  //   scrollToBottom();
  // }, [messageEndRef]);

  const socket = io("http://localhost:3001");
  socket.on("chat-message", (data) => {
    getChatMessages();
  });

  const formRef = createRef();
  const userRef = createRef();

  const handleClick = () => {
    const form = formRef.current;
    if (!form.message.value.trim()) {
      return;
    }
    socket.emit("send-chat-message", form.message.value);
    const newMessage = {
      name: username,
      body: form.message.value,
    };

    axios.post("http://localhost:8081/chat", newMessage).then((response) => {
      getChatMessages();
      form.reset();
      scrollToBottom();
    });
  };

  const handleUsername = () => {
    const username = userRef.current.username.value.trim();
    if (!username) {
      return;
    }
    setUsername(username);
    userRef.current.reset();
  };

  return (
    <Draggable
      allowAnyClick={false}
      bounds="parent"
      handle=".chat__header-grabbable"
    >
      <div
        className={`chat__container ${
          chatOn ? "" : "chat__container--hidden"
        } ${"chat" === activeWindow ? "active" : ""}`}
        // onClick={() => setChatToActive()}
        onMouseDownCapture={() => setChatToActive()}
      >
        <div className="chat__header">
          {username ? (
            <p className="chat__header-title">{username}</p>
          ) : (
            <p className="chat__header-title">Instant Message</p>
          )}
          {/* <div className="chat__header-title">Instant Message</div> */}
          <div className="chat__header-grabbable"></div>
          <button className="chat__close-button">
            <img src={closeIcon} onClick={() => handleChatIconClick()} />
          </button>
        </div>
        <section className="chat__window">
          {messages.map((message) => (
            <ChatMessage key={message.id} {...message} />
          ))}
          <div className="chat__messages-end" ref={messageEndRef}></div>
        </section>
        <div className="chat__message-container">
          {username ? (
            <form ref={formRef} className="chat__form">
              <textarea className="chat__message-input" name="message" />
              <button
                className="chat__message-input-button"
                type="button"
                onClick={handleClick}
              >
                <p>Send</p>
              </button>
            </form>
          ) : (
            <form ref={userRef} className="chat__form">
              <input
                className="chat__username-input"
                name="username"
                placeholder="Select username"
                autoComplete="off"
              />
              <button
                className="chat__username-input-button"
                type="button"
                onClick={handleUsername}
              >
                Set Username
              </button>
            </form>
          )}
          {/* {username ? (
            <p>Logged in as: {username}</p>
          ) : (
            <p>Please select username</p>
          )} */}
        </div>
      </div>
    </Draggable>
  );
}
