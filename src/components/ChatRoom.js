/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import firebase from "firebase/app";
import "./ChatRoom.scss";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import userImage from "../Img/user.png";
import { ReactComponent as Send } from "../Img/send.svg";
import { ReactComponent as Cancel } from "../Img/back/cancel.svg";

const auth = firebase.auth();
function ChatRoom(props) {
  const firestore = firebase.firestore();
  const dummy = useRef();
  const messagesRef = firestore
    .collection("chatRooms")
    .doc(window.location.pathname.split("/")[2])
    .collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");
  // const [chatRoomShow, setChatRoomShow] = useState(false);
  const setChatEditing = props.setChatEditing;
  const showChatRoom = props.showChatRoom;
  const chatRoomShow = props.chatRoomShow;
  const sendMessage = async (e) => {
    e.preventDefault();
    // eslint-disable-next-line prefer-const
    let { uid, photoURL } = auth.currentUser;

    photoURL = photoURL || userImage;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="chatRoom"
      style={{ marginRight: chatRoomShow ? "0px" : "-402px" }}
    >
      <div className="chatRoomTop">
        <div>Chat Room</div>
        <Cancel
          style={{ fill: "white", width: 30 }}
          onClick={showChatRoom}
          className="chatRoomCancel bigger"
        />
      </div>
      <main id="mainChat">
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>
      <div className="chatRoomBox">
        <form onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="message here"
            onFocus={() => {
              setChatEditing(true);
            }}
            onBlur={() => {
              setChatEditing(false);
            }}
          />

          <button type="submit" disabled={!formValue}>
            <Send style={{ fill: "white" }} />
          </button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} />
        <p>{text}</p>
      </div>
    </>
  );
}

export default ChatRoom;
