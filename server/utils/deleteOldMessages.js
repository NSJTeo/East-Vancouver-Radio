const fs = require("fs");

const deleteOldMessages = () => {
  try {
    const currentTime = new Date();
    const currentTimestamp = currentTime.getTime();
    const millisecondsPerHour = 3600000;
    const chat = fs.readFileSync("./data/chat.json");
    const parsedChat = JSON.parse(chat);
    const filteredChat = parsedChat.filter(
      (message) =>
        currentTimestamp - message.timestamp < 1 * millisecondsPerHour
    );
    fs.writeFileSync("./data/chat.json", JSON.stringify(filteredChat));
    console.log("old messages deleted");
  } catch {
    console.log("couldn't delete old messages");
  }
};

module.exports = deleteOldMessages;
