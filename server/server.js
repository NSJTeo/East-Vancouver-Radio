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
const app = require("express")();
const server = require("http").createServer(app);

// constants
const musicPath = "./music";
// express ports
const PORT = process.env.PORT || 8080; //radio station

// chat socket
const socket = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const station = new Station({
  verbose: true,
});

socket.on("connection", (socket) => {
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("get-messages", message);
  });
});

// middleware
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.static("public"));
app.use(fileUpload());
app.use("/chat", chatRouter);
app.use("/current-show", currentShowRouter);
app.use("/login", loginRouter);
// JWT authentication
const jsonSecretKey = "eastvancouver";
const getToken = (req) => {
  return req.headers.authorization.split(" ")[1];
};
app.use((req, res, next) => {
  const publicURLs = [
    "/",
    "/stream",
    "/schedule",
    "/login",
    "/chat",
    "/current-show",
  ];
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

app.get("/chat", (_req, res) => {
  try {
    const chat = fs.readFileSync("./data/chat.json");
    const parsedChat = JSON.parse(chat);
    res.status(200).json(parsedChat);
  } catch {
    res.status(404).send();
  }
});

app.get("/system-information", (_req, res) => {
  const shows = JSON.stringify(getShows());
  res.status(200).json(shows);
});

app.delete("/system-information/:fileName", (req, res) => {
  try {
    const library = fs.readdirSync(musicPath);
    // prevents user from deleting the last song in the library
    if (library.length < 2) {
      return;
    }
    library.forEach((file) => {
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

app.post("/upload", (req, res) => {
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
    title: result.title || "DJ Mix",
    artist: result.artist || "Mystery DJ",
  };
  fs.writeFileSync(
    "./data/currentSong.json",
    JSON.stringify(currentTrackInformation)
  );
  socket.emit("song-information", currentTrackInformation);
});

station.on(PUBLIC_EVENTS.ERROR, console.error);

app.get("/stream", (req, res) => {
  station.connectListener(req, res);
});

// This will play the next track every hour.
const hourlyChange = new schedule.RecurrenceRule();
hourlyChange.minute = 0;
schedule.scheduleJob(hourlyChange, () => {
  deleteOldMessages();
  station.next();
  console.log("scheduled change");
  socket.emit("get-messages", "delete old messages");
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
  station.start();
});
