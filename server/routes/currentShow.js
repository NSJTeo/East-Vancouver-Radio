const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (_req, res) => {
  try {
    const currentSong = fs.readFileSync("./data/currentSong.json");
    res.status(200).send(currentSong);
  } catch {
    res.status(404).send();
  }
});

module.exports = router;
