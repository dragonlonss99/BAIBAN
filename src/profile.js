import React, { useState, useEffect } from "react";
import { ReactComponent as Logo } from "./Img/toolbar/open.svg";
import { ReactComponent as Add } from "./Img/add.svg";
import { ReactComponent as Cancel } from "./Img/addshapes/cancel.svg";
import AddedBoard from "./components/AddedBoard.js";
import { signOut } from "./firebase";
import firebase from "firebase";
import firebaseConfig from "./firebaseConfig";
import { useHistory } from "react-router-dom";
import "./profile.scss";

export default function ProfilePage() {
  const [canvasOwn, setCanvasOwn] = useState([]);
  const [canvasRead, setCanvasRead] = useState([]);
  const [nameInput, setNameInput] = useState("new board");
  const [userEmailfromF, setUserEmailfromF] = useState("");

  useEffect(() => {
    var db = firebase.firestore();
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        // document.querySelector("#status").innerHTML = "已登入";
        db.collection("users")
          .doc(user.email)
          .get()
          .then((data) => {
            setCanvasOwn(data.data().canvasOwn);
            setCanvasRead(data.data().canvasRead);
            setUserEmailfromF(user.email);
            // console.log(canvasOwn);
            // document.querySelector("#boards").appendChild(
            // data.data().canvasOwn.map((obj) => {
            //   console.log(obj);
            //   <AddedBoard id={obj} key={obj} />;
            // })
            // React.createElement(AddedBoard)
            // );
          });
        // .then(() => {
        //   console.log(canvasOwn);
        //   // canvasOwn.map((obj) =>
        //   //   document
        //   //     .querySelector("#boards")
        //   //     .appendChild(<AddedBoard id={obj} key={obj} />)
        //   // );
        // });
        // console.log(user.email);
      }
    });
  }, []);
  let history = useHistory();

  // const app = firebase.apps.length
  //   ? firebase.app()
  //   : firebase.initializeApp(firebaseConfig);
  // firebase.auth().onAuthStateChanged(function (user) {
  //   if (user) {
  //     // User is signed in.
  //     document.querySelector("#status").innerHTML = "已登入";
  //     console.log(user.email);
  //   } else {
  //     // No user is signed in.
  //     document.querySelector("#status").innerHTML = "未登入，請點以下登入方式";
  //   }
  // });
  // firebase.auth().onAuthStateChanged(function (user) {
  //   if (user) {
  //     // User is signed in.
  //     // document.querySelector("#status").innerHTML = "已登入";
  //     console.log(user.email);
  //   } else {
  //     // No user is signed in.
  //     // document.querySelector("#status").innerHTML = "未登入，請點以下登入方式";
  //   }
  // });
  // const firebaseSnap = () => {
  //   const app = firebase.apps.length
  //     ? firebase.app()
  //     : firebase.initializeApp(firebaseConfig);
  //   var db = firebase.firestore();
  //   db.collection("canvases")
  //     .doc("Test")
  //     .onSnapshot((querySnapshot) => {
  //       console.log(querySnapshot.data().data);
  //     });
  // };
  const signingOut = () => {
    signOut();
    history.push("/");
  };
  // const totheBoard = () => {
  //   history.push("/board");
  // };

  const changeReadStatus = (e) => {
    let a = document.getElementsByClassName("profileTag");
    for (var i = 0; i < a.length; i++) {
      a[i].classList = "profileTag";
    }
    e.target.classList = "profileTag selected";
    if (e.target.innerHTML === "Your Board") {
      document.querySelector("#boardsRead").style.display = "none";
      document.querySelector("#boardsContain").style.display = "flex";
    } else if (e.target.innerHTML === "You can check") {
      document.querySelector("#boardsRead").style.display = "flex";
      document.querySelector("#boardsContain").style.display = "none";
    }
  };
  document.onclick = function () {
    let list = document.getElementsByClassName("AddBoardList");
    for (var i = 0; i < list.length; i++) {
      list[i].classList = "AddBoardList hide";
    }
  };
  const addCanvas = () => {
    var userEmail = firebase.auth().currentUser.email;
    // console.log(userEmail);
    var db = firebase.firestore();
    db.collection("canvases")
      .add({
        data: "",
        name: nameInput,
        owner: userEmail,
        user: userEmail,
        createdTime: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        db.collection("users")
          .doc(userEmail)
          .update({
            canvasOwn: firebase.firestore.FieldValue.arrayUnion(docRef.id),
          });
        history.push("/board/" + docRef.id);
      });
    // showInputDefault();
  };

  const handleNameInput = (e) => {
    setNameInput(e.target.value);
  };

  const showNameInput = () => {
    document.querySelector(".addIconBox").style.display = "none";
    document.querySelector(".InputNameBox").style.display = "block";
  };
  const showInputDefault = () => {
    document.querySelector(".addIconBox").style.display = "block";
    document.querySelector(".InputNameBox").style.display = "none";
  };

  return (
    <div id="profilePage">
      <div className="topNav">
        <div className="mainLogo">
          <Logo className="logo" />
          <div>BIBEN</div>
        </div>
        <div className="logInWay">
          <div onClick={signingOut}>signOut</div>
        </div>
      </div>
      <div id="profileP">
        <div id="profilePic"></div>
        <div id="profileEmail">email: {userEmailfromF}</div>
      </div>
      <div id="profileBoards">
        <div id="tagBox">
          <div className="profileTag selected" onClick={changeReadStatus}>
            Your Board
          </div>
          <div className="profileTag" onClick={changeReadStatus}>
            You can check
          </div>
        </div>
        {/* <div className="profileTag">Your Board</div>
        <div className="profileTag">You can check</div> */}

        <div id="boards">
          <div id="boardsContain">
            <div className="boardCreate">
              <div className="addIconBox" onClick={showNameInput}>
                <Add className="addIcon" />
                <div>Create new canvas</div>
              </div>
              <div className="InputNameBox">
                <div className="inputTop">
                  <Cancel className="cancelIcon" onClick={showInputDefault} />
                  {/* <div>
                    <div>X</div>
                  </div> */}
                  <div className="inputName">Name your board?</div>
                  <input value={nameInput} onChange={handleNameInput} />
                </div>
                <div className="inputBottom" onClick={addCanvas}>
                  add a new board
                </div>
              </div>
            </div>
            {canvasOwn.map((obj) => (
              <AddedBoard id={obj} key={obj} />
            ))}
          </div>
          <div id="boardsRead">
            {canvasRead.map((obj) => (
              <AddedBoard id={obj} key={obj} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
