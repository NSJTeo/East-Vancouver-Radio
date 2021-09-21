const express = require("express");
const router = express.Router();
const fs = require("fs");

const getChat = () => {
  const chat = fs.readFileSync("./data/chat.json");
  return "hello!!!";
};

router.get("/chat", (_req, res) => {
  console.log("GET!");
  const chat = getChat();
  console.log(chat);
  res.status(200).json("hello world");
});

module.exports = router;
