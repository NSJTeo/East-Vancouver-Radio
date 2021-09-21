import "./App.scss";
import Player from "./Components/Player/Player";
import { io } from "socket.io-client";

function App() {
  const socket = io("http://localhost:3001");
  socket.on("chat-message", (data) => {
    console.log(data);
  });
  return <Player />;
}

export default App;
