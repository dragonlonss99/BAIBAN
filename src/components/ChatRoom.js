import React, { useState, useRef, useEffect } from "react";
import firebase from "firebase";
import "./ChatRoom.scss";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import userImage from "../Img/user.png";
import { ReactComponent as Send } from "../Img/send.svg";
import { ReactComponent as Cancel } from "../Img/back/cancel.svg";

firebase.initializeApp({
  apiKey: "AIzaSyDh6uamYJP8Wp2UG3qJihL0uOOnLZYf8dc",
  authDomain: "biben-1193b.firebaseapp.com",
  databaseURL: "https://biben-1193b.firebaseio.com",
  projectId: "biben-1193b",
  storageBucket: "biben-1193b.appspot.com",
  messagingSenderId: "532211232221",
  appId: "1:532211232221:web:672f0108ab14f418499a34",
  measurementId: "G-X35JWETTVG",
});

const auth = firebase.auth();
function ChatRoom() {
  // useEffect(() => {
  //   document.querySelector("#mainChat").scrollTop = document.querySelector(
  //     "#mainChat"
  //   ).scrollHeight;
  //   console.log(document.querySelector("#mainChat").scrollHeight);
  // }, []);

  const firestore = firebase.firestore();
  const dummy = useRef();
  const messagesRef = firestore
    .collection("chatRooms")
    .doc(window.location.pathname.split("/")[2])
    .collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    let { uid, photoURL } = auth.currentUser;
    if (photoURL === null) {
      photoURL = userImage;
    }
    // const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };
  const showChatRoom = () => {
    if (document.querySelector(".chatRoom").style.marginRight === "0px") {
      document.querySelector(".chatRoom").style.marginRight = "-402px";
    } else {
      document.querySelector(".chatRoom").style.marginRight = "0px";
    }
  };

  return (
    <div className="chatRoom">
      <div className="chatRoomTop">
        <div>Chat Room</div>
        <Cancel style={{ fill: "white", width: 30 }} onClick={showChatRoom} />
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
