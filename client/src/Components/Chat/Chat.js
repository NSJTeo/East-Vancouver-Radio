// http://localhost:8081/chat
import React, { createRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import ChatMessage from "../ChatMessage/ChatMessage";
// import closeIcon from "../../assets/icons/close-icon.png";
import Draggable from "react-draggable";
import ChatHeader from "../ChatHeader/ChatHeader";

export default function Chat(props) {
  //
  const { chatOn, handleChatIconClick, activeWindow, setChatToActive } = props;
  //
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(null);
  const [socket, setSocket] = useState(null);
  //
  const messageEndRef = createRef();
  const formRef = createRef();
  const userRef = createRef();
  //
  const getChatMessages = () => {
    axios
      .get("http://localhost:8080/chat")
      .then((response) => {
        const messagesArray = response.data;
        const sortedMessagesArray = messagesArray.sort((message1, message2) => {
          return message1.timestamp - message2.timestamp;
        });
        setMessages(sortedMessagesArray);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const scrollToBottom = () => {
    if (!messageEndRef.current) {
      return;
    }
    messageEndRef.current.scrollIntoView();
  };
  const getUsername = () => {
    let storedUsername = localStorage.getItem("username");
    if (storedUsername === "null") {
      storedUsername = null;
    }
    if (storedUsername) {
      const { username } = JSON.parse(storedUsername);
      setUsername(username);
    } else {
      setUsername(null);
    }
  };
  const handleClick = () => {
    const form = formRef.current;
    if (!form.message.value.trim()) {
      return;
    }
    if (form.message.value.length > 300) {
      form.reset();
      return;
    }
    const newMessage = {
      name: username,
      body: form.message.value,
    };

    axios
      .post("http://localhost:8080/chat", newMessage)
      .then((response) => {
        const messagesArray = JSON.parse(response.data);
        const sortedMessagesArray = messagesArray.sort((message1, message2) => {
          return message1.timestamp - message2.timestamp;
        });
        setMessages(sortedMessagesArray);
        form.reset();
        socket.emit("send-chat-message", "hello");
        scrollToBottom();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUsername = () => {
    const username = userRef.current.username.value.trim();
    if (!username) {
      return;
    }
    localStorage.setItem("username", JSON.stringify({ username }));
    setUsername(username);
    userRef.current.reset();
  };

  const handleLogout = () => {
    localStorage.setItem("username", null);
    setUsername(null);
  };
  //
  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);
    getUsername();
    getChatMessages();
    return () => newSocket.close();
  }, []);
  // socket listener
  if (socket) {
    socket.on("get-messages", (data) => {
      getChatMessages();
    });
  }

  return (
    <Draggable
      allowAnyClick={false}
      bounds="parent"
      handle=".chat-header__grabbable"
    >
      <div
        className={`chat__container ${
          chatOn ? "" : "chat__container--hidden"
        } ${"chat" === activeWindow ? "active" : ""}`}
        onMouseDownCapture={() => setChatToActive()}
      >
        <ChatHeader
          username={username}
          handleChatIconClick={handleChatIconClick}
        />
        <section className="chat__window">
          {messages.map((message) => (
            <ChatMessage key={message.id} {...message} />
          ))}
          <div className="chat__messages-end" ref={messageEndRef}></div>
        </section>
        <div className="chat__message-container">
          {username ? (
            <>
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
              <button
                className="chat__logout-button"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <form ref={userRef} className="chat__form">
              <input
                className="chat__username-input"
                name="username"
                placeholder="Select username"
                autoComplete="off"
              />
              <input className="chat__hidden-input" />
              <button
                className="chat__username-input-button"
                type="button"
                onClick={handleUsername}
              >
                Set Username
              </button>
            </form>
          )}
        </div>
      </div>
    </Draggable>
  );
}
