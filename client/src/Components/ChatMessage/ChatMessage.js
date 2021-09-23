import React from "react";

export default function ChatMessage(props) {
  const { body, name, timestamp } = props;
  return (
    <div>
      {/* render timestamp in a readable manner */}({timestamp}) {name}: {body}
    </div>
  );
}
