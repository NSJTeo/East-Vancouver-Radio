const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const fs = require("fs");

router.get("/", (_req, res) => {
  try {
    const chat = fs.readFileSync("./data/chat.json");
    const parsedChat = JSON.parse(chat);
    res.status(200).json(parsedChat);
  } catch {
    res.status(404).send();
  }
});

router.post("/", (req, res) => {
  try {
    if (!req.body.name.trim()) {
      return res.status(400).send();
    }
    if (!req.body.body.trim()) {
      return res.status(400).send();
    }
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
    res.status(201).json(JSON.stringify(parsedChat));
  } catch (error) {
    console.log("Couldn't post comment.");
    res.status(500).send();
  }
});

module.exports = router;
