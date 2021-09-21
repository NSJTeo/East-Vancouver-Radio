const express = require("express");
const path = require("path");
const {
  Station,
  SHUFFLE_METHODS,
  PUBLIC_EVENTS,
} = require("@fridgefm/radio-core");
const port = 8080;
const server = express();
const musicPath = "./music";
const schedule = require("node-schedule");
const cors = require("cors");
const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // socket.emit("chat-message", "Hello World");
  socket.on("send-chat-message", (message) => {
    console.log(message);
    socket.broadcast.emit("chat-message", message);
  });
});

server.use(express.json());
server.use(cors({ origin: "*" }));
server.use(express.static("public"));

const station = new Station({
  verbose: true, // for verbose logging to console
  // responseHeaders: {
  //   "icy-genre": "jazz",
  // },
});
// add folder to station
station.addFolder(musicPath);

// update currently playing track info
let currentTrack;
station.on(PUBLIC_EVENTS.NEXT_TRACK, async (track) => {
  const result = await track.getMetaAsync();
  currentTrack = result;
});

// station.on(PUBLIC_EVENTS.START, () => {
// double the playlist on start
//   station.reorderPlaylist((a) => a.concat(a));
// });

// station.on(PUBLIC_EVENTS.RESTART, () => {
//   station.reorderPlaylist(SHUFFLE_METHODS.randomShuffle());
// });

// add this handler - otherwise any error will exit the process as unhandled
station.on(PUBLIC_EVENTS.ERROR, console.error);

// main stream route
server.get("/stream", (req, res) => {
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
server.get("/controls/getPlaylist", (req, res) => {
  const plist = station.getPlaylist();
  res.json(plist);
});

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

server.listen(port, () => {
  console.log(`RADIO APP IS AVAILABLE ON http://localhost:${port}`);
  station.start();
});
