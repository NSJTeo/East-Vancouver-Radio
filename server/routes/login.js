const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jsonSecretKey = "eastvancouver";

router.post("/", (req, res) => {
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

module.exports = router;
