import React from "react";
import playerIcon from "../../assets/icons/wm-5.png";
import chatIcon from "../../assets/icons/chat-icon2.png";
import startIcon from "../../assets/icons/start-button.png";

export default function Taskbar(props) {
  const { handlePlayerIconClick, handleChatIconClick, playerOn, chatOn } =
    props;
  return (
    <div className="taskbar">
      <div className="taskbar__start">
        <img src={startIcon} />
      </div>
      <button
        className={
          playerOn
            ? "taskbar__button taskbar__button--active"
            : "taskbar__button taskbar__button--inactive"
        }
        onClick={() => handlePlayerIconClick()}
      >
        <p>Radio</p>
        <img className="taskbar__button-icon" src={playerIcon} />
      </button>
      <button
        className={
          chatOn
            ? "taskbar__button taskbar__button--active"
            : "taskbar__button taskbar__button--inactive"
        }
        onClick={() => handleChatIconClick()}
      >
        <p>Chat</p>
        <img className="taskbar__button-icon" src={chatIcon} />
      </button>
      <div className="taskbar__utility-container">
        {/* Add mute button functionality */}
        <button>Mute Icon</button>
        <p>2:45</p>
      </div>
    </div>
  );
}
