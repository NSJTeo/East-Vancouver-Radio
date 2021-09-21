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

// express setup
const firstServer = express();
const secondServer = express();

// constants
const port = 8080;
const secondPort = 8081;
const musicPath = "./music";

// socket setup
const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
  },
});
const fs = require("fs");

io.on("connection", (socket) => {
  socket.on("send-chat-message", (message) => {
    console.log(message);
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
    console.log("get");
    const chat = fs.readFileSync("./data/chat.json");
    const parsedChat = JSON.parse(chat);
    console.log(parsedChat);
    res.json(parsedChat);
  })
  .post("/chat", (req, res) => {
    console.log("req.body", req.body.body);
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

const station = new Station({
  verbose: true,
});
// add folder to station
station.addFolder(musicPath);

// update currently playing track info
// could use a socket here to send information to client
let currentTrack;
station.on(PUBLIC_EVENTS.NEXT_TRACK, async (track) => {
  const result = await track.getMetaAsync();
  currentTrack = result;
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

// get id3 tags of the track
// server.get("/info", (req, res) => {
//   res.json(currentTrack);
// });

// switch to the next track immediately
// server.get("/controls/next", (req, res) => {
//   station.next();
//   res.json("Switched to next track");
// });

// shuffle playlist
// server.get("/controls/shufflePlaylist", (req, res) => {
//   station.reorderPlaylist(SHUFFLE_METHODS.randomShuffle());
//   res.json("Playlist shuffled");
// });

// rearrange tracks in a playlist
// server.get("/controls/rearrangePlaylist", (req, res) => {
//   const { newIndex, oldIndex } = req.query;
//   station.reorderPlaylist(
//     SHUFFLE_METHODS.rearrange({ from: oldIndex, to: newIndex })
//   );
//   res.json(`Succesfully moved element from "${oldIndex}" to "${newIndex}"`);
// });

// just get the entire playlist
// server.get("/controls/getPlaylist", (req, res) => {
//   const plist = station.getPlaylist();
//   res.json(plist);
// });

// route for serving static
// server.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "./example.html"));
// });

const hourlyChange = new schedule.RecurrenceRule();
hourlyChange.minute = 0;
schedule.scheduleJob(hourlyChange, () => {
  station.next();
  console.log("scheduled change");
});

// schedule files changes
// schedule comment delete
// utils schedule folder?

firstServer.listen(port, () => {
  console.log(`RADIO APP IS AVAILABLE ON http://localhost:${port}`);
  station.start();
});

secondServer.listen(secondPort, () => {
  console.log("second server is listening");
});
