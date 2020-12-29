/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import pagePic from "../Img/boardPic.png";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import * as firebaseApp from "../utils/firebaseUtils";

export default function AddedBoard(props) {
  //   let id = props.id;
  const [name, setName] = useState("");
  const [boardPic, setBoardPic] = useState("");
  const [newName, setNewName] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [owner, setOwner] = useState("");
  const db = firebase.firestore();
  const sharePagePop = props.sharePagePop;
  const deletePagePop = props.deletePagePop;
  const reNamePagePop = props.reNamePagePop;
  // useEffect(() => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var db = firebase.firestore();
      db.collection("canvases")
        .doc(props.id)
        .get()
        .then((data) => {
          // if (data) {
          setName(data.data().name);
          setOwner(data.data().owner);
          data.data().photoURL
            ? setBoardPic(`url( ${data.data().photoURL}  )`)
            : setBoardPic("");

          // }
        });
    }
  });
  // }, []);
  const history = useHistory();
  const boardPicHandle = () => {};
  const showList = (e) => {
    const list = document.getElementsByClassName("AddBoardList");
    // for (var i = 0; i < list.length; i++) {
    //   list[i].classList = "AddBoardList hide";
    // }
    // document.querySelector(".AddBoardList").classList = "AddBoardList hide";
    if (e.target.nextSibling.classList.length === 1) {
      //   e.target.nextSibling.classList = "AddBoardList hide";
      for (var i = 0; i < list.length; i++) {
        list[i].classList = "AddBoardList hide";
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        list[i].classList = "AddBoardList hide";
      }
      e.target.nextSibling.classList = "AddBoardList";
    }
    e.stopPropagation();
  };
  const changeName = () => {};
  const goToTheCanvas = () => {
    history.push("/board/" + props.id);
  };

  const renameBoard = () => {
    db.collection("canvases").doc(props.id).update({
      name: newName,
    });
  };
  const deleteBoard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    db.collection("canvases")
      .doc(props.id)
      .get()
      .then((data) => {
        if (data.data().user.length !== 0) {
          data.data().user.forEach((email) => {
            db.collection("users")
              .doc(email)
              .update({
                canvasUse: firebase.firestore.FieldValue.arrayRemove(props.id),
              });
          });
        }
        if (data.data().observer.length !== 0) {
          data.data().observer.forEach((email) => {
            db.collection("users")
              .doc(email)
              .update({
                canvasObserve: firebase.firestore.FieldValue.arrayRemove(
                  props.id
                ),
              });
          });
        }
        db.collection("users")
          .doc(owner)
          .update({
            canvasOwn: firebase.firestore.FieldValue.arrayRemove(props.id),
          });
      })
      .then(() => {
        db.collection("canvases").doc(props.id).delete();
      });
  };
  // const shareBoardUSer = () => {
  //   db.collection("canvases")
  //     .doc(props.id)
  //     .update({
  //       user: firebase.firestore.FieldValue.arrayUnion(props.id),
  //     });
  //   db.collection("users")
  //     .doc(shareEmail)
  //     .update({
  //       canvasUse: firebase.firestore.FieldValue.arrayUnion(props.id),
  //     });
  // };

  // const shareBoardObserver = () => {
  //   db.collection("canvases")
  //     .doc(props.id)
  //     .update({
  //       observer: firebase.firestore.FieldValue.arrayUnion(props.id),
  //     });
  //   db.collection("users")
  //     .doc(shareEmail)
  //     .update({
  //       canvasObserve: firebase.firestore.FieldValue.arrayUnion(props.id),
  //     });
  // };

  const shareBtnHandle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    sharePagePop(props.id);
  };

  const deleteBtnHandle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deletePagePop(props.id);
  };

  const reNameBtnHandle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    reNamePagePop(props.id);
  };
  return (
    <div className="AddBoardBox " onClick={goToTheCanvas} id={props.id}>
      <div className="AddBoardPic" style={{ backgroundImage: boardPic }}>
        <div className="AddBoardLIconBox" onClick={showList}></div>
        <div className="AddBoardList hide">
          <ul>
            <li onClick={reNameBtnHandle}>Rename</li>
            <li onClick={shareBtnHandle}>Share</li>
            <li onClick={deleteBtnHandle}>Delete</li>
          </ul>
        </div>
      </div>
      <div className="AddBoardName" onClick={changeName}>
        <div>{name}</div>
        {/* <input value={name} /> */}
      </div>
    </div>
  );
}
