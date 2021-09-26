import React from "react";

export default function ChatMessage(props) {
  //
  const { body, name, timestamp } = props;
  //
  const commentTime = new Date(timestamp);
  let hour = commentTime.getHours().toString();
  if (hour.length === 1) {
    hour = "0" + hour;
  }
  let minutes = commentTime.getMinutes().toString();
  if (minutes.length === 1) {
    minutes = "0" + minutes;
  }
  return (
    <div>
      <p>
        ({hour}:{minutes}) {name} says:
      </p>
      <p>{body}</p>
    </div>
  );
}
