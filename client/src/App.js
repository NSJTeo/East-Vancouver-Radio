import "./App.scss";
import Chat from "./Components/Chat/Chat";
import Player from "./Components/Player/Player";
import { useState } from "react";
import playerIcon from "./assets/icons/wm-5.png";
import chatIcon from "./assets/icons/chat-icon2.png";
import Taskbar from "./Components/Taskbar/Taskbar";

function App() {
  const [playerOn, setPlayerOn] = useState(false);
  const [chatOn, setChatOn] = useState(false);
  // state tracks which window is active, last clicked
  // window is activated when taskbar & desktop icons clicked, or windows themselves
  // 6 onClicks to handle!
  // this will add/remove class, class just sets z-index
  const [activeWindow, setActiveWindow] = useState("");

  const setPlayerToActive = () => {
    setActiveWindow("player");
  };

  const setChatToActive = () => {
    setActiveWindow("chat");
  };

  const handlePlayerIconClick = () => {
    setPlayerToActive();
    setPlayerOn(!playerOn);
  };
  const handleChatIconClick = () => {
    setChatToActive();
    setChatOn(!chatOn);
  };
  return (
    <div className="app-container">
      <button onClick={handlePlayerIconClick}>
        <img src={playerIcon} />
        <p>Radio</p>
      </button>
      <button onClick={handleChatIconClick}>
        <img src={chatIcon} />
        <p>Chat</p>
      </button>
      <Player
        playerOn={playerOn}
        handlePlayerIconClick={handlePlayerIconClick}
        setPlayerToActive={setPlayerToActive}
        activeWindow={activeWindow}
      />
      <Chat
        chatOn={chatOn}
        handleChatIconClick={handleChatIconClick}
        setChatToActive={setChatToActive}
        activeWindow={activeWindow}
      />
      <Taskbar
        handlePlayerIconClick={handlePlayerIconClick}
        handleChatIconClick={handleChatIconClick}
        playerOn={playerOn}
        chatOn={chatOn}
      />
    </div>
  );
}

export default App;
