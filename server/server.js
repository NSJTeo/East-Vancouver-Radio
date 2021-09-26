// module imports
const express = require("express");
const { Station, PUBLIC_EVENTS } = require("@fridgefm/radio-core");
const schedule = require("node-schedule");
const cors = require("cors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");
// routers
const chatRouter = require("./routes/chat.js");
const currentShowRouter = require("./routes/currentShow");
const loginRouter = require("./routes/login");
const deleteOldMessages = require("./utils/deleteOldMessages");
const getShows = require("./utils/getShows");

// express setup
const musicStream = express(); //musicStream
const API = express(); //general API: chat log & music information

// constants
const musicPath = "./music";
// express ports
const radioPort = 8080; //radio station
const apiPort = 8081; //API
// socket port
const chatPort = 3001; //chat alert socket
const schedulePort = 3002; //song update socket

// chat socket
const chatSocket = require("socket.io")(chatPort, {
  cors: {
    origin: "http://localhost:3000",
  },
});
// schedule update socket
const scheduleSocket = require("socket.io")(schedulePort, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const station = new Station({
  verbose: true,
});

chatSocket.on("connection", (socket) => {
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("get-messages", message);
  });
});

// middleware
API.use(express.json());
API.use(cors({ origin: "*" }));
API.use(express.static("public"));
API.use(fileUpload());
API.use("/chat", chatRouter);
API.use("/current-show", currentShowRouter);
API.use("/login", loginRouter);
// JWT authentication
const jsonSecretKey = "eastvancouver";
const getToken = (req) => {
  return req.headers.authorization.split(" ")[1];
};
API.use((req, res, next) => {
  const publicURLs = ["/schedule", "/login", "/chat", "/current-show"];
  if (publicURLs.includes(req.url)) next();
  else {
    const token = getToken(req);
    if (token) {
      if (jwt.verify(token, jsonSecretKey)) {
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

API.get("/system-information", (_req, res) => {
  const shows = JSON.stringify(getShows());
  res.status(200).json(shows);
});

API.delete("/system-information/:fileName", (req, res) => {
  try {
    fs.readdirSync(musicPath).forEach((file) => {
      if (file === req.params.fileName) {
        fs.unlinkSync(`./music/${file}`);
        console.log(`deleted ${file}`);
      }
    });
  } catch {
    console.log("Couldn't delete mp3");
  } finally {
    const shows = JSON.stringify(getShows());
    station.start();
    res.status(200).json(shows);
  }
});

API.post("/upload", (req, res) => {
  try {
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
  } catch {
    res.status(404).send();
  }
});

// add folder to station
station.addFolder(musicPath);

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

station.on(PUBLIC_EVENTS.ERROR, console.error);

musicStream.get("/stream", (req, res) => {
  station.connectListener(req, res);
});

const hourlyChange = new schedule.RecurrenceRule();
hourlyChange.minute = 0;
schedule.scheduleJob(hourlyChange, () => {
  deleteOldMessages();
  station.next();
  console.log("scheduled change");
});

musicStream.listen(radioPort, () => {
  console.log(`RADIO APP IS AVAILABLE ON http://localhost:${radioPort}`);
  station.start();
});

API.listen(apiPort, () => {
  console.log("second server is listening");
});
