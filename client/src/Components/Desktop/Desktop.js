import React from "react";
import playerIcon from "../../assets/icons/wm-5.png";
import chatIcon from "../../assets/icons/chat-icon2.png";
import setupIcon from "../../assets/icons/setupIcon.png";

export default function Desktop(props) {
  //
  const { handlePlayerIconClick, handleChatIconClick, handleSetupIconClick } =
    props;
  //
  return (
    <div>
      <button className="desktop__shortcut" onClick={handlePlayerIconClick}>
        <img
          className="desktop__icon"
          src={playerIcon}
          alt="Push play arrows"
        />
        <p>Radio</p>
      </button>
      <button className="desktop__shortcut" onClick={handleChatIconClick}>
        <img
          className="desktop__icon"
          src={chatIcon}
          alt="Computers connecting across the globe"
        />
        <p>Chat</p>
      </button>
      <button className="desktop__shortcut" onClick={handleSetupIconClick}>
        <img
          className="desktop__icon"
          src={setupIcon}
          alt="Globe on a folder"
        />
        <p>Setup</p>
      </button>
    </div>
  );
}
