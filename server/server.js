// module imports
const express = require("express");
const path = require("path");
const {
  Station,
  SHUFFLE_METHODS,
  PUBLIC_EVENTS,
} = require("@fridgefm/radio-core");
const schedule = require("node-schedule");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// express setup
const firstServer = express();
const secondServer = express();

// constants
// express ports
const port = 8080; //radio station
const secondPort = 8081; //chat REST
// socket port
const thirdPort = 3001; //chat alert socket
const fourthPort = 3002; //song update socket
const musicPath = "./music";

// chat socket
const io = require("socket.io")(thirdPort, {
  cors: {
    origin: "*",
  },
});
// song information socket
const songInfoSocket = require("socket.io")(fourthPort, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", message);
  });
});

// middleware
secondServer.use(express.json());
secondServer.use(cors({ origin: "*" }));
secondServer.use(express.static("public"));

// chat endpoints
secondServer
  .get("/chat", (_req, res) => {
    const chat = fs.readFileSync("./data/chat.json");
    const parsedChat = JSON.parse(chat);
    res.json(parsedChat);
  })
  .post("/chat", (req, res) => {
    const commentDate = new Date();
    const newMessage = {
      name: req.body.name,
      id: uuidv4(),
      body: req.body.body,
      timestamp: commentDate.getTime(),
    };
    const chat = fs.readFileSync("./data/chat.json");
    const parsedChat = JSON.parse(chat);
    parsedChat.push(newMessage);
    fs.writeFileSync("./data/chat.json", JSON.stringify(parsedChat));
    res.status(200).json({ Success: true });
  });

secondServer.get("/current-show", (_req, res) => {
  const currentSong = fs.readFileSync("./data/currentSong.json");
  res.status(200).send(currentSong);
});

const station = new Station({
  verbose: true,
});

// add folder to station
station.addFolder(musicPath);

// update currently playing track info
// could use a socket here to send information to client
// let currentTrack;
station.on(PUBLIC_EVENTS.NEXT_TRACK, async (track) => {
  const result = await track.getMetaAsync();
  const currentTrackInformation = {
    title: result.title || "Mystery Show",
    artist: result.artist || "Mystery Host",
  };
  fs.writeFileSync(
    "./data/currentSong.json",
    JSON.stringify(currentTrackInformation)
  );
  songInfoSocket.emit("song-information", currentTrackInformation);
});

// station.on(PUBLIC_EVENTS.RESTART, () => {
//   station.reorderPlaylist(SHUFFLE_METHODS.randomShuffle());
// });

// add this handler - otherwise any error will exit the process as unhandled
station.on(PUBLIC_EVENTS.ERROR, console.error);

// main stream route
firstServer.get("/stream", (req, res) => {
  station.connectListener(req, res);
});

// just get the entire playlist
// server.get("/controls/getPlaylist", (req, res) => {
//   const plist = station.getPlaylist();
//   res.json(plist);
// });

const hourlyChange = new schedule.RecurrenceRule();
hourlyChange.minute = 0;
schedule.scheduleJob(hourlyChange, () => {
  deleteOldMessages();
  station.next();
  console.log("scheduled change");
});

const deleteOldMessages = () => {
  const currentTime = new Date();
  const currentTimestamp = currentTime.getTime();
  const millisecondsPerHour = 3600000;
  const chat = fs.readFileSync("./data/chat.json");
  const parsedChat = JSON.parse(chat);
  const filteredChat = parsedChat.filter(
    (message) => currentTimestamp - message.timestamp < 12 * millisecondsPerHour
  );
  fs.writeFileSync("./data/chat.json", JSON.stringify(filteredChat));
  console.log("old messages deleted");
};

firstServer.listen(port, () => {
  console.log(`RADIO APP IS AVAILABLE ON http://localhost:${port}`);
  station.start();
});

secondServer.listen(secondPort, () => {
  console.log("second server is listening");
});
