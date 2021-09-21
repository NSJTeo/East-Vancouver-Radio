import React from "react";

export default function ChatMessage(props) {
  const { body, name, timestamp } = props;
  console.log(props);
  return (
    <li>
      ({timestamp}) {name}: {body}
    </li>
  );
}
