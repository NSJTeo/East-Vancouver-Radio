const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (_req, res) => {
  const currentSong = fs.readFileSync("./data/currentSong.json");
  res.status(200).send(currentSong);
});

module.exports = router;
