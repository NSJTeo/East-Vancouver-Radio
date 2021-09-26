const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jsonSecretKey = "eastvancouver";

router.post("/", (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === "admin" && password === "evilways!420") {
      res
        .status(200)
        .json({ token: jwt.sign({ name: username }, jsonSecretKey) });
    } else {
      res.status(401).send();
    }
  } catch {
    res.status(401).send();
  }
});

module.exports = router;
