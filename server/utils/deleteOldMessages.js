const fs = require("fs");

const deleteOldMessages = () => {
  const currentTime = new Date();
  const currentTimestamp = currentTime.getTime();
  const millisecondsPerHour = 3600000;
  const chat = fs.readFileSync("./data/chat.json");
  const parsedChat = JSON.parse(chat);
  const filteredChat = parsedChat.filter(
    (message) => currentTimestamp - message.timestamp < 1 * millisecondsPerHour
  );
  fs.writeFileSync("./data/chat.json", JSON.stringify(filteredChat));
  chatSocket.emit("send-chat-message", "delete old comments");
  console.log("old messages deleted");
};

module.exports = deleteOldMessages;
