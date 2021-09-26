const fs = require("fs");
const musicPath = "./music";

const getShows = () => {
  let mp3Array = [];
  fs.readdirSync(musicPath).forEach((file) => {
    mp3Array.push(file);
  });
  return mp3Array;
};

module.exports = getShows;
