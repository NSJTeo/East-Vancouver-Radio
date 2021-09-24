import React from "react";
import playerIcon from "../../assets/icons/wm-5.png";
import chatIcon from "../../assets/icons/chat-icon2.png";
import scheduleIcon from "../../assets/icons/calendar-1.png";

export default function Desktop(props) {
  const { handlePlayerIconClick, handleChatIconClick, handleSetupIconClick } =
    props;
  return (
    <div>
      <button className="desktop__shortcut" onClick={handlePlayerIconClick}>
        <img className="desktop__icon" src={playerIcon} />
        <p>Radio</p>
      </button>
      <button className="desktop__shortcut" onClick={handleChatIconClick}>
        <img className="desktop__icon" src={chatIcon} />
        <p>Chat</p>
      </button>
      <button className="desktop__shortcut" onClick={handleSetupIconClick}>
        <img className="desktop__icon" src={chatIcon} />
        <p>Setup</p>
      </button>
    </div>
  );
}
