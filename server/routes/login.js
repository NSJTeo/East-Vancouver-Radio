const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jsonSecretKey = "eastvancouver";

router.post("/", (req, res) => {
  const { username, password } = req.body;
  if (username === "user" && password === "user") {
    res
      .status(200)
      .json({ token: jwt.sign({ name: username }, jsonSecretKey) });
  } else {
    res.status(401).send();
  }
});

module.exports = router;
