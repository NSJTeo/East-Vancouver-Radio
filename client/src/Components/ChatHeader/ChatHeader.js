import React from "react";
import closeIcon from "../../assets/icons/close-icon.png";

export default function ChatHeader(props) {
  const { username, handleChatIconClick } = props;
  return (
    <div className="chat-header__container">
      <div className="chat-header__grabbable">
        {username ? <p>{username}</p> : <p>Instant Message</p>}
      </div>
      <button className="chat-header__close-button">
        <img
          src={closeIcon}
          onClick={() => handleChatIconClick()}
          alt="Click X to close"
        />
      </button>
    </div>
  );
}
