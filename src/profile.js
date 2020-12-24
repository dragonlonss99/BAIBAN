import React, { useState, useEffect } from "react";
import { ReactComponent as Logo } from "./Img/toolbar/open.svg";
import { ReactComponent as Add } from "./Img/add.svg";
import { ReactComponent as Cancel } from "./Img/back/cancel.svg";
import { ReactComponent as DrawCircle } from "./Img/drawCircle3.svg";
import AddedBoard from "./components/AddedBoard.js";
import { signOut } from "./firebase";
import firebase from "firebase";
import logo from "./Img/icon13.svg";
import userImg from "./Img/user.png";
import firebaseConfig from "./firebaseConfig";
import { useHistory } from "react-router-dom";
import { ReactComponent as Cowork } from "./Img/profile/undraw_Online_collaboration.svg";
import { ReactComponent as Learn } from "./Img/profile/undraw_Online_learning.svg";

import "./profile.scss";
import Proverb from "./components/Proverb.js";

export default function ProfilePage() {
  const [canvasOwn, setCanvasOwn] = useState([]);
  const [canvasObserve, setCanvasObserve] = useState([]);
  const [canvasRead, setCanvasRead] = useState([]);
  const [nameInput, setNameInput] = useState("new board");
  const [userEmailfromF, setUserEmailfromF] = useState("");
  const [photo, setPhoto] = useState("");
  const [userName, setUserName] = useState("");
  const [boardChosen, setBoardChosen] = useState("");
  const [shareInputUse, setShareInputUse] = useState("");
  const [shareInputObserve, setShareInputObserve] = useState("");
  const db = firebase.firestore();
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        // document.querySelector("#status").innerHTML = "已登入";
        db.collection("users")
          .doc(user.email)
          // .get()
          // .then((data) => {
          .onSnapshot((data) => {
            if (data.data()) {
              setCanvasOwn(data.data().canvasOwn.reverse());
              setCanvasRead(data.data().canvasUse.reverse());
              setCanvasObserve(data.data().canvasObserve.reverse());
              setUserEmailfromF(user.email);
              // setUserName(user.userName);
              if (user.providerData[0].providerId === "facebook.com") {
                setPhoto(user.photoURL + "?type=large");
                setUserName(user.displayName);
              } else if (user.providerData[0].providerId === "google.com") {
                setPhoto(user.photoURL);
                setUserName(user.displayName);
              } else {
                setPhoto(userImg);
                setUserName(data.data().userName);
              }

              // console.log(user);
              // console.log(canvasOwn);
              // document.querySelector("#boards").appendChild(
              // data.data().canvasOwn.map((obj) => {
              //   console.log(obj);
              //   <AddedBoard id={obj} key={obj} />;
              // })
              // React.createElement(AddedBoard)
              // );
            }
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

  const changeReadStatus = (e) => {
    let a = document.getElementsByClassName("profileTag");
    for (var i = 0; i < a.length; i++) {
      a[i].classList = "profileTag";
    }
    e.target.classList = "profileTag selected";
    let b = document.getElementsByClassName("drawCompo");
    for (var i = 0; i < b.length; i++) {
      b[i].classList = "drawCompo";
    }
    e.target.previousSibling.classList = "drawCompo drawn";
    if (e.target.innerHTML === "Boards you own") {
      document.querySelector("#boardsObserved").style.display = "none";
      document.querySelector("#boardsRead").style.display = "none";
      document.querySelector("#boardsContain").style.display = "flex";
    } else if (e.target.innerHTML === "Shared with you") {
      document.querySelector("#boardsRead").style.display = "flex";
      document.querySelector("#boardsContain").style.display = "none";
      document.querySelector("#boardsObserved").style.display = "none";
    } else if (e.target.innerHTML === "Boards read only") {
      document.querySelector("#boardsObserved").style.display = "flex";
      document.querySelector("#boardsContain").style.display = "none";
      document.querySelector("#boardsRead").style.display = "none";
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
        user: [],
        observer: [],
        createdTime: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: "",
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

  const deleteBoard = () => {
    if (!boardChosen) {
      return;
    }
    // db.collection("users")
    // .doc(userEmailfromF)
    // .get()
    // .then((data) => {})
    db.collection("canvases")
      .doc(boardChosen)
      .get()
      .then((data) => {
        console.log(data.data().user);
      });
  };
  const onfocusBoard = (boardId) => {
    console.log(boardId);
    setBoardChosen(boardId);
  };
  const sharePagePop = (id) => {
    setBoardChosen(id);
    console.log(id);
    document.querySelector("#darkBack").className = "scaleIn";
    document.querySelector("#darkBack").style.display = "flex";
    document.querySelector("#dark").style.display = "block";
  };
  const showCanvasRead = () => {
    if (canvasRead.length === 0) {
      return "Nothing here yet!";
    } else {
      return canvasRead.map((obj) => (
        <AddedBoard id={obj} key={obj} sharePagePop={sharePagePop} />
      ));
    }
  };
  const showCanvasObserve = () => {
    if (canvasObserve.length === 0) {
      return "Nothing here yet!";
    } else {
      return canvasObserve.map((obj) => (
        <AddedBoard id={obj} key={obj} sharePagePop={sharePagePop} />
      ));
    }
  };

  const shareCanvasUse = (observerEmail) => {
    let canvasId = boardChosen;

    db.collection("canvases")
      .doc(canvasId)
      .update({
        user: firebase.firestore.FieldValue.arrayUnion(observerEmail),
      });
    db.collection("users")
      .doc(observerEmail)
      .update({
        canvasUse: firebase.firestore.FieldValue.arrayUnion(canvasId),
      });
  };

  const handleShareUse = () => {
    shareCanvasUse(shareInputUse);
    setShareInputUse("");
    setShareInputObserve("");
    shareBoxNon();
  };
  const shareCanvasObserve = (observerEmail) => {
    let canvasId = boardChosen;

    db.collection("canvases")
      .doc(canvasId)
      .update({
        observer: firebase.firestore.FieldValue.arrayUnion(observerEmail),
      });
    db.collection("users")
      .doc(observerEmail)
      .update({
        canvasObserve: firebase.firestore.FieldValue.arrayUnion(canvasId),
      });
  };

  const handleShareObserve = () => {
    shareCanvasObserve(shareInputObserve);
    setShareInputUse("");
    setShareInputObserve("");
    shareBoxNon();
  };
  const shareBoxNon = () => {
    document.querySelector("#darkBack").className = "scaleOut";
    setTimeout(() => {
      document.querySelector("#darkBack").style.display = "none";
      document.querySelector("#dark").style.display = "none";
    }, 300);
  };

  return (
    <>
      <div id="profilePage">
        <div className="topNavBox">
          <div className="topNav">
            <div className="mainLogo">
              <img src={logo} className="logo" />
              <div>BAIBEN</div>
            </div>
            <div className="logInWay" id="flexEnd">
              {/* <div style={{ backgroundColor: "#ffffff" } } id="fake"></div> */}
              <div
                onClick={signingOut}
                style={{ backgroundColor: "red" }}
                className="topNavBtn bigger"
              >
                Log Out
              </div>
            </div>
          </div>
        </div>
        <div id="profileLeft">
          <div id="profileP">
            <img id="profilePic" src={photo} />
            <div id="profileEmail">Hello, {userName}</div>
            {/* <div id="profileMessage">What would you like to do today? </div> */}
          </div>
          <div id="ProfileBtnBox">
            <div id="tagBox">
              <div className="drawBox ">
                <DrawCircle className="drawCompo drawn" />
                <div className="profileTag selected" onClick={changeReadStatus}>
                  Boards you own
                </div>
              </div>
              <div className="drawBox">
                <DrawCircle className="drawCompo" />
                <div className="profileTag " onClick={changeReadStatus}>
                  Shared with you
                </div>
              </div>
              <div className="drawBox ">
                <DrawCircle className="drawCompo " />
                <div className="profileTag selected" onClick={changeReadStatus}>
                  Boards read only
                </div>
              </div>
            </div>
            {/* <div className="profileTag" onClick={changeReadStatus}>
            You can check
          </div> */}
          </div>

          {/* <div id="profileFuncBox">
          <div className="profileTag" onClick={changeReadStatus}>
            Rename
          </div>
          <div className="profileTag" onClick={deleteBoard}>
            Delete
          </div>
          <div className="profileTag" onClick={changeReadStatus}>
            Share
          </div>
        </div> */}
        </div>
        <div id="profileRight">
          <div id="profileMessage">What would you like to do today? </div>

          {/* <Proverb /> */}
          <div id="profileBoards">
            {/* <div className="profileTag">Your Board</div>
        <div className="profileTag">You can check</div> */}

            <div id="boards">
              <div id="boardsContain">
                {/* <Proverb /> */}
                {/* <div className="profileFa" /> */}
                <div className="boardCreate">
                  <div className="addIconBox" onClick={showNameInput}>
                    <Add className="addIcon" />
                    <div id="beforeAdd">Create a new board</div>
                  </div>
                  <div className="InputNameBox">
                    <div className="inputTop">
                      <Cancel
                        className="cancelIcon bigger"
                        onClick={showInputDefault}
                      />
                      <div className="inputName">Name your board?</div>
                      <input value={nameInput} onChange={handleNameInput} />
                    </div>
                    <div className="inputBottom " onClick={addCanvas}>
                      <div className="bigger">add a new board</div>
                    </div>
                  </div>
                </div>
                {canvasOwn.map((obj) => (
                  <AddedBoard id={obj} key={obj} sharePagePop={sharePagePop} />
                ))}
                <div className="profileFa" />
                <div className="profileFa" />
                <div className="profileFa" />
                <div className="profileFa" />
                <div className="profileFa" />
                <div className="profileFa" />
              </div>
              <div id="boardsRead">
                {showCanvasRead()}
                <div className="profileFa" />
                <div className="profileFa" />
                <div className="profileFa" />
                <div className="profileFa" />
                <div className="profileFa" />
                <div className="profileFa" />
              </div>
              <div id="boardsObserved">
                {showCanvasObserve()}
                <div className="profileFa" />
                <div className="profileFa" />
                <div className="profileFa" />
                <div className="profileFa" />
                <div className="profileFa" />
                <div className="profileFa" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="dark" />
      <div id="darkBack" style={{ display: "none" }} className="scaleIn">
        <div id="shareBoxOuter">
          <div id="profileShareBox">
            <div id="profileCancelBox">
              <Cancel
                id="cancelOutShare"
                onClick={shareBoxNon}
                className="bigger"
              />
            </div>
            <div id="shareInputBox">
              <div className="shareWayBox">
                <div className="h1">Share to co-worker</div>
                <div>invite others to co-work </div>
                <div> (the one you invited can edit the board)</div>
                <Cowork className="shareImg" />
                <div className="shareBtnBox">
                  <input
                    className="shareInput"
                    value={shareInputUse}
                    placeholder="Please enter an Email"
                    onChange={(e) => {
                      setShareInputUse(e.target.value);
                    }}
                  />
                  <div onClick={handleShareUse} className="shareBtn">
                    share
                  </div>
                </div>
              </div>
              <div className="shareWayBox">
                <div className="h1">Share to student</div>
                <div>invite others to read </div>
                <div>(the one you invited can read only)</div>
                <Learn className="shareImg" />
                <div className="shareBtnBox">
                  <input
                    className="shareInput"
                    value={shareInputObserve}
                    placeholder="Please enter an Email"
                    onChange={(e) => {
                      setShareInputObserve(e.target.value);
                    }}
                  />
                  <div onClick={handleShareObserve} className="shareBtn">
                    share
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
