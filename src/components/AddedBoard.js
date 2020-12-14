import React, { useState, useEffect } from "react";
import pagePic from "../Img/boardPic.png";
import { useHistory } from "react-router-dom";
import firebase from "firebase";

// import { ReactComponent as List } from "../Img/list.svg";
export default function AddedBoard(props) {
  //   let id = props.id;
  const [name, setName] = useState("");
  useEffect(() => {
    var db = firebase.firestore();
    db.collection("canvases")
      .doc(props.id)
      .get()
      .then((data) => {
        // if (data) {
        setName(data.data().name);
        // console.log(data.data());
        // }
      });
  }, []);
  let history = useHistory();

  const showList = (e) => {
    // console.log(e.target.nextSibling.classList);
    let list = document.getElementsByClassName("AddBoardList");
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
  const changeName = () => {
    console.log("GGG");
  };
  const goToTheCanvas = () => {
    history.push("/board/" + props.id);
    // console.log(props.id);
    // props.onfocusBoard(props.id);
  };

  return (
    <div className="AddBoardBox" onClick={goToTheCanvas}>
      <div className="AddBoardPic" style={{ backgroundImage: pagePic }}>
        <div className="AddBoardLIconBox" onClick={showList}></div>
        <div className="AddBoardList hide">
          <ul>
            <li>Rename</li>
            <li>Share</li>
            <li>Delete</li>
          </ul>
        </div>
      </div>
      <div className="AddBoardName" onClick={changeName}>
        {name}
      </div>
    </div>
  );
}
