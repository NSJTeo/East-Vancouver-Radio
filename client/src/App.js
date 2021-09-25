import "./App.scss";
import Chat from "./Components/Chat/Chat";
import Player from "./Components/Player/Player";
import { useState } from "react";
import Taskbar from "./Components/Taskbar/Taskbar";
import Desktop from "./Components/Desktop/Desktop";
import Setup from "./Components/Setup/Setup";

function App() {
  const [playerOn, setPlayerOn] = useState(false);
  const [chatOn, setChatOn] = useState(false);
  const [setupOn, setSetupOn] = useState(false);
  const [activeWindow, setActiveWindow] = useState("");

  const setPlayerToActive = () => {
    setActiveWindow("player");
  };

  const setChatToActive = () => {
    setActiveWindow("chat");
  };

  const setSetupToActive = () => {
    setActiveWindow("setup");
  };

  const handlePlayerIconClick = () => {
    setPlayerToActive();
    setPlayerOn(!playerOn);
  };
  const handleChatIconClick = () => {
    setChatToActive();
    setChatOn(!chatOn);
  };
  const handleSetupIconClick = () => {
    setSetupToActive();
    setSetupOn(!setupOn);
  };
  return (
    <div className="app-container">
      <Desktop
        handlePlayerIconClick={handlePlayerIconClick}
        handleChatIconClick={handleChatIconClick}
        handleSetupIconClick={handleSetupIconClick}
      />
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
      <Setup
        setupOn={setupOn}
        handleSetupIconClick={handleSetupIconClick}
        setSetupToActive={setSetupToActive}
        activeWindow={activeWindow}
      />
      <Taskbar
        handlePlayerIconClick={handlePlayerIconClick}
        handleChatIconClick={handleChatIconClick}
        handleSetupIconClick={handleSetupIconClick}
        playerOn={playerOn}
        chatOn={chatOn}
        setupOn={setupOn}
      />
    </div>
  );
}

export default App;
