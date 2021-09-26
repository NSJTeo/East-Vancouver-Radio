const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const fs = require("fs");

router.get("/", (_req, res) => {
  const chat = fs.readFileSync("./data/chat.json");
  const parsedChat = JSON.parse(chat);
  res.json(parsedChat);
});

router.post("/", (req, res) => {
  const commentDate = new Date();
  const newMessage = {
    name: req.body.name,
    id: uuidv4(),
    body: req.body.body,
    timestamp: commentDate.getTime(),
  };
  const chat = fs.readFileSync("./data/chat.json");
  const parsedChat = JSON.parse(chat);
  if (parsedChat.length > 100) {
    parsedChat.shift();
  }
  parsedChat.push(newMessage);
  fs.writeFileSync("./data/chat.json", JSON.stringify(parsedChat));
  // chatSocket.emit("send-chat-message", "hello");
  res.status(200).json(JSON.stringify(parsedChat));
});

module.exports = router;
