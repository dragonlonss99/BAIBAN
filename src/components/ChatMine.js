import React from "react";

export default function ChatMine(props) {
  let editor = props.editor;
  let text = props.text;
  let time = props.time;
  let author = props.author;
  const chatMine = (
    <div>
      {author}+{text}
    </div>
  );
  const chatOther = (
    <div>
      {editor}+{text}
    </div>
  );
  return <li>{editor === author ? chatMine : chatOther}</li>;
}
