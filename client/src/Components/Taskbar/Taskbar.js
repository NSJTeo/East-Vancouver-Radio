import React from "react";
import playerIcon from "../../assets/icons/wm-5.png";
import chatIcon from "../../assets/icons/chat-icon2.png";
import startIcon from "../../assets/icons/start-button.png";
import setupIcon from "../../assets/icons/setupIcon.png";

export default function Taskbar(props) {
  const {
    handlePlayerIconClick,
    handleChatIconClick,
    handleSetupIconClick,
    playerOn,
    chatOn,
    setupOn,
  } = props;
  return (
    <div className="taskbar">
      <div className="taskbar__start">
        <img
          src={startIcon}
          alt="Microsoft Windows Logo and text that says Start"
        />
      </div>
      <button
        className={
          playerOn
            ? "taskbar__button taskbar__button--active"
            : "taskbar__button taskbar__button--inactive"
        }
        onClick={() => handlePlayerIconClick()}
      >
        <p className="taskbar__button-name">Radio</p>
        <img
          className="taskbar__button-icon"
          src={playerIcon}
          alt="Play/Start arrows"
        />
      </button>
      <button
        className={
          chatOn
            ? "taskbar__button taskbar__button--active"
            : "taskbar__button taskbar__button--inactive"
        }
        onClick={() => handleChatIconClick()}
      >
        <p className="taskbar__button-name">Chat</p>
        <img
          className="taskbar__button-icon"
          src={chatIcon}
          alt="Computers connecting across the globe"
        />
      </button>
      <button
        className={
          setupOn
            ? "taskbar__button taskbar__button--active"
            : "taskbar__button taskbar__button--inactive"
        }
        onClick={() => handleSetupIconClick()}
      >
        <p className="taskbar__button-name">Setup</p>
        <img
          className="taskbar__button-icon"
          src={setupIcon}
          alt="Globe on a folder"
        />
      </button>
    </div>
  );
}
