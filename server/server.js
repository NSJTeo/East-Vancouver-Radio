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
const jwt = require("jsonwebtoken");
const jsonSecretKey = "eastvancouver";
const fileUpload = require("express-fileupload");

// express setup
const musicStream = express(); //musicStream
const API = express(); //general API: chat log & music information

// constants
// express ports
const radioPort = 8080; //radio station
const apiPort = 8081; //chat REST
// socket port
const chatPort = 3001; //chat alert socket
const schedulePort = 3002; //song update socket
const musicPath = "./music";

// chat socket
const chatSocket = require("socket.io")(chatPort, {
  cors: {
    origin: "*",
  },
});
// schedule update socket
const scheduleSocket = require("socket.io")(schedulePort, {
  cors: {
    origin: "*",
  },
});

chatSocket.on("connection", (socket) => {
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", message);
  });
});

// middleware
API.use(express.json());
API.use(cors({ origin: "*" }));
API.use(express.static("public"));
API.use(fileUpload());
const getToken = (req) => {
  return req.headers.authorization.split(" ")[1];
};
API.use((req, res, next) => {
  const publicURLs = ["/schedule", "/login", "/chat", "/current-show"];
  if (publicURLs.includes(req.url)) next();
  else {
    // Format of request is BEARER <token>. Splitting on ' ' will create an
    // array where the token is at index 1
    const token = getToken(req);
    if (token) {
      if (jwt.verify(token, jsonSecretKey)) {
        // Decode the token to pass along to end-points that may need
        // access to data stored in the token.
        req.decode = jwt.decode(token);
        next();
      } else {
        res.status(403).json({ error: "Not Authorized." });
      }
    } else {
      res.status(403).json({ error: "No token. Unauthorized." });
    }
  }
});

// chat endpoints
API.get("/chat", (_req, res) => {
  const chat = fs.readFileSync("./data/chat.json");
  const parsedChat = JSON.parse(chat);
  res.json(parsedChat);
}).post("/chat", (req, res) => {
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

API.get("/current-show", (_req, res) => {
  const currentSong = fs.readFileSync("./data/currentSong.json");
  res.status(200).send(currentSong);
});

const getShows = () => {
  let mp3Array = [];
  fs.readdirSync(musicPath).forEach((file) => {
    mp3Array.push(file);
  });
  return mp3Array;
};

API.get("/schedule", (_req, res) => {
  const shows = JSON.stringify(getShows());
  res.status(200).json(shows);
});

API.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "nicholas" && password === "nicholas") {
    res.json({ token: jwt.sign({ name: username }, jsonSecretKey) });
  } else {
    res.json({
      token: "",
      error: "Nice try!",
    });
  }
});

API.get("/system-information", (_req, res) => {
  const shows = JSON.stringify(getShows());
  res.status(200).json(shows);
});

API.delete("/system-information/:fileName", (req, res) => {
  fs.readdirSync(musicPath).forEach((file) => {
    if (file === req.params.fileName) {
      fs.unlinkSync(`./music/${file}`);
      console.log(`deleted ${file}`);
    }
  });
  const shows = JSON.stringify(getShows());
  station.start();
  res.status(200).json(shows);
});

API.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  const file = req.files.file;
  file.mv(`./music/${file.name}`, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    const shows = JSON.stringify(getShows());
    station.start();
    res.status(200).json(shows);
  });
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
  scheduleSocket.emit("song-information", currentTrackInformation);
});

// station.on(PUBLIC_EVENTS.RESTART, () => {
//   station.reorderPlaylist(SHUFFLE_METHODS.randomShuffle());
// });

// add this handler - otherwise any error will exit the process as unhandled
station.on(PUBLIC_EVENTS.ERROR, console.error);

// main stream route
musicStream.get("/stream", (req, res) => {
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

musicStream.listen(radioPort, () => {
  console.log(`RADIO APP IS AVAILABLE ON http://localhost:${radioPort}`);
  station.start();
});

API.listen(apiPort, () => {
  console.log("second server is listening");
});
