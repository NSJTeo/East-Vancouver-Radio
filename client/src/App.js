import "./App.scss";
import Chat from "./Components/Chat/Chat";
import Player from "./Components/Player/Player";
import { useState } from "react";
import playerIcon from "./assets/icons/wm-5.png";
import chatIcon from "./assets/icons/users-2.png";

function App() {
  const [playerOn, setPlayerOn] = useState(false);
  const [chatOn, setChatOn] = useState(false);

  const handlePlayerIconClick = () => {
    setPlayerOn(!playerOn);
  };
  const handleChatIconClick = () => {
    setChatOn(!chatOn);
  };
  return (
    <>
      <button onClick={handlePlayerIconClick}>
        <img src={playerIcon} />
        <p>Radio</p>
      </button>
      <button onClick={handleChatIconClick}>
        <img src={chatIcon} />
        <p>Chat</p>
      </button>
      <Player playerOn={playerOn} />
      <Chat chatOn={chatOn} />
    </>
  );
}

export default App;
