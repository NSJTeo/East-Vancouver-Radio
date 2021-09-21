import React from "react";

export default function ChatMessage(props) {
  const { body, name, timestamp } = props;
  console.log(props);
  return (
    <div>
      ({timestamp}) {name}: {body}
    </div>
  );
}
