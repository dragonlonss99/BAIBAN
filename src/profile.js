import { useState, useEffect } from "react";
import { ReactComponent as Add } from "./Img/add.svg";
import { ReactComponent as Cancel } from "./Img/back/cancel.svg";
import { ReactComponent as DrawCircle } from "./Img/drawCircle5.svg";
import AddedBoard from "./components/profile/AddedBoard.js";
import { signOut } from "./utils/firebaseUtils.js";
import firebase from "firebase/app";
import logo from "./Img/icon13.svg";
import userImg from "./Img/user.png";
import { useHistory } from "react-router-dom";
import * as firebaseApp from "./utils/firebaseUtils.js";
import "./profile.scss";
import SharePage from "./components/SharePage.js";
import Loading from "./components/Loading.js";

export default function ProfilePage() {
  const [loadingFinish, setLoadingFinish] = useState(false);
  const [canvasOwn, setCanvasOwn] = useState([]);
  const [canvasObserve, setCanvasObserve] = useState([]);
  const [canvasRead, setCanvasRead] = useState([]);
  const [nameInput, setNameInput] = useState("new board");
  const [photo, setPhoto] = useState("");
  const [userName, setUserName] = useState("");
  const [boardChosen, setBoardChosen] = useState("");
  const [newName, setNewName] = useState("");
  const [boardsType, setBoardsType] = useState(1);
  const [sharePage, setSharePage] = useState(false);
  const [addNameCheck, setAddNameCheck] = useState(false);
  const [addBox, setAddBox] = useState(true);
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteScale, setDeleteScale] = useState(true);
  const [newNameScale, setNewNameScale] = useState(true);
  const [newNameShow, setNewNameShow] = useState(false);
  const [backShow, setBackShow] = useState(false);
  const [newNameCheck, setNewNameCheck] = useState(false);

  useEffect(() => {
    function setUserData(boardData, user) {
      setCanvasOwn(boardData.canvasOwn.reverse());
      setCanvasRead(boardData.canvasUse.reverse());
      setCanvasObserve(boardData.canvasObserve.reverse());
      if (user.providerData[0].providerId === "facebook.com") {
        setPhoto(user.photoURL + "?type=large");
        setUserName(user.displayName);
      } else if (user.providerData[0].providerId === "google.com") {
        setPhoto(user.photoURL);
        setUserName(user.displayName);
      } else {
        setPhoto(userImg);
        setUserName(boardData.userName);
      }
      setLoadingFinish(true);
    }
    firebaseApp.onAuthState(function (user) {
      user &&
        firebaseApp.userSnapShot(user, (data) => {
          const boardData = data.data();
          boardData && setUserData(boardData, user);
        });
    });
  }, []);

  const history = useHistory();
  const signingOut = () => {
    signOut();
    history.push("/");
  };
  const changeReadStatus = (e) => {
    const selectedType = document.getElementsByClassName("profileTag");
    for (var i = 0; i < selectedType.length; i++) {
      selectedType[i].classList = "profileTag";
    }
    e.target.classList = "profileTag selected";
    const selectedCircle = document.getElementsByClassName("drawCompo");
    for (var i = 0; i < selectedCircle.length; i++) {
      selectedCircle[i].classList = "drawCompo";
    }
    if (window.innerWidth > 425) {
      e.target.previousSibling.classList = "drawCompo drawn";
    }
    const tag = document.querySelector(".selected");
    if (tag?.innerHTML === "Boards you own") {
      setBoardsType(1);
    } else if (tag?.innerHTML === "Shared with you") {
      setBoardsType(2);
    } else if (tag?.innerHTML === "Read-only boards") {
      setBoardsType(3);
    }
  };

  onclick = hideLists;
  function hideLists() {
    const list = document.getElementsByClassName("AddBoardList");
    for (var i = 0; i < list.length; i++) {
      list[i].classList = "AddBoardList hide";
    }
  }
  const addCanvas = () => {
    if (nameInput.length === 0) {
      setAddNameCheck(true);
    } else {
      var userEmail = firebase.auth().currentUser?.email;
      firebaseApp.canvasesAdd(
        {
          data: "",
          name: nameInput,
          owner: userEmail,
          user: [],
          observer: [],
          createdTime: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: "",
        },
        (docRef) => {
          firebaseApp.userUpdate(userEmail, {
            canvasOwn: firebaseApp.arrayUnion(docRef.id),
          });
          history.push("/board/" + docRef.id);
        }
      );
    }
  };

  const handleNameInput = (e) => {
    setNameInput(e.target.value);
    setAddNameCheck(false);
  };

  const showNameInput = () => {
    setAddBox(false);
  };
  const showInputDefault = () => {
    setAddBox(true);
    setAddNameCheck(false);
  };

  const sharePagePop = (id) => {
    setBoardChosen(id);
    setSharePage(true);
  };

  const deletePagePop = (id) => {
    setBoardChosen(id);
    setDeleteShow(true);
    setBackShow(true);
    setDeleteScale(true);
  };

  const reNamePagePop = (id) => {
    setBoardChosen(id);
    setNewNameShow(true);
    setBackShow(true);
    setNewNameScale(true);
  };

  const handleDeleteUse = () => {
    deleteBoard();
    deleteBoxNon();
  };

  const handleReNameUse = () => {
    if (newName.length === 0) {
      setNewNameCheck(true);
    } else {
      renameBoard();
      setNewName("");
      reNameBoxNon();
    }
  };

  const deleteBoxNon = () => {
    setDeleteScale(false);
    setTimeout(() => {
      setDeleteShow(false);
      setBackShow(false);
    }, 300);
  };

  const reNameBoxNon = () => {
    setNewNameScale(false);
    setTimeout(() => {
      setNewNameShow(false);
      setNewNameCheck(false);
      setBackShow(false);
    }, 300);
  };

  const renameBoard = () => {
    const canvasId = boardChosen;
    firebaseApp.canvasesUpdate(canvasId, {
      name: newName,
    });
  };

  const deleteBoard = () => {
    const canvasId = boardChosen;
    firebaseApp
      .canvasesGet(canvasId, (data) => {
        const userData = data.data();
        if (userData.user.length !== 0) {
          userData.user.forEach((email) => {
            firebaseApp.userUpdate(email, {
              canvasUse: firebaseApp.arrayRemove(canvasId),
            });
          });
        }
        if (userData.observer.length !== 0) {
          userData.user.forEach((email) => {
            firebaseApp.userUpdate(email, {
              canvasObserve: firebaseApp.arrayRemove(canvasId),
            });
          });
        }
        firebaseApp.userUpdate(userData.owner, {
          canvasOwn: firebaseApp.arrayRemove(canvasId),
        });
      })
      .then(() => {
        firebaseApp.docDelete("canvases", canvasId);
        firebaseApp.docDelete("chatRooms", canvasId);
        firebaseApp.docDelete("selectedObj", canvasId);
      });
  };

  return (
    <>
      {loadingFinish || <Loading />}
      <div id="profilePage">
        <div className="topNavBox">
          <div className="topNav">
            <div className="mainLogo">
              <img src={logo} className="logo" />
              <div>BAIBAN</div>
            </div>
            <div className="logInWay" id="flexEnd">
              <div
                onClick={signingOut}
                style={{ backgroundColor: "red" }}
                className="topNavBtn bigger"
              >
                Log Out
              </div>
            </div>
          </div>
          <div className="mobileOption">
            <span className="profileTag selected" onClick={changeReadStatus}>
              Boards you own
            </span>
            <span className="profileTag " onClick={changeReadStatus}>
              Shared with you
            </span>
            <span className="profileTag " onClick={changeReadStatus}>
              Read-only boards
            </span>
          </div>
        </div>
        <div id="profileLeft">
          <div id="profileP">
            <img id="profilePic" src={photo} />
            <div id="profileEmail">Hello, {userName}</div>
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
                <div className="profileTag " onClick={changeReadStatus}>
                  Read-only boards
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="profileRight">
          <div id="profileBoards">
            <div id="boards">
              {boardsType === 1 && (
                <div id="boardsContain">
                  <div className="boardCreate">
                    {addBox ? (
                      <div className="addIconBox" onClick={showNameInput}>
                        <Add className="addIcon" />
                        <div id="beforeAdd">Create a new board</div>
                      </div>
                    ) : (
                      <div className="InputNameBox">
                        <div className="inputTop">
                          <Cancel
                            className="cancelIcon bigger"
                            onClick={showInputDefault}
                          />
                          <div className="inputName">Name your board?</div>
                          <input
                            value={nameInput}
                            onChange={handleNameInput}
                            onClick={() => {
                              setAddNameCheck(false);
                            }}
                          />
                          <div
                            className="newNameCheck"
                            id="newNameCheckUp"
                            style={{ display: addNameCheck ? "block" : "none" }}
                          >
                            <small>Name could not be empty!</small>
                          </div>
                        </div>
                        <div className="inputBottom " onClick={addCanvas}>
                          <div className="bigger">add a new board</div>
                        </div>
                      </div>
                    )}
                  </div>
                  {canvasOwn.map((obj) => (
                    <AddedBoard
                      id={obj}
                      key={obj}
                      sharePagePop={sharePagePop}
                      deletePagePop={deletePagePop}
                      reNamePagePop={reNamePagePop}
                      hideLists={hideLists}
                    />
                  ))}
                  <div className="profileFa" />
                  <div className="profileFa" />
                  <div className="profileFa" />
                  <div className="profileFa" />
                  <div className="profileFa" />
                  <div className="profileFa" />
                </div>
              )}

              {boardsType === 2 &&
                (canvasRead.length === 0 ? (
                  <div id="boardsRead">Nothing here yet!</div>
                ) : (
                  <div id="boardsRead">
                    {canvasRead.map((obj) => (
                      <AddedBoard
                        id={obj}
                        key={obj}
                        sharePagePop={sharePagePop}
                      />
                    ))}
                    <div className="profileFa" />
                    <div className="profileFa" />
                    <div className="profileFa" />
                    <div className="profileFa" />
                    <div className="profileFa" />
                    <div className="profileFa" />
                  </div>
                ))}
              {boardsType === 3 &&
                (canvasObserve.length === 0 ? (
                  <div id="boardsObserved">Nothing here yet!</div>
                ) : (
                  <div id="boardsObserved">
                    {canvasObserve.map((obj) => (
                      <AddedBoard
                        id={obj}
                        key={obj}
                        sharePagePop={sharePagePop}
                      />
                    ))}
                    <div className="profileFa" />
                    <div className="profileFa" />
                    <div className="profileFa" />
                    <div className="profileFa" />
                    <div className="profileFa" />
                    <div className="profileFa" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div id="dark" style={{ display: backShow ? "block" : "none" }} />
      <div
        id="deleteConfirm"
        style={{ display: deleteShow ? "flex" : "none" }}
        className={deleteScale ? "scaleIn" : "scaleOut"}
      >
        <div id="shareBoxOuter">
          <div id="profileDeleteBox">
            <div id="profileCancelBox">
              <Cancel
                id="cancelOutShare"
                onClick={deleteBoxNon}
                className="bigger"
              />
            </div>
            <div className="deleteH1">
              Do you really want to delete the board?
            </div>
            <div className="deleteChosen">
              <div className="bigger" onClick={handleDeleteUse}>
                Yes
              </div>
              <div className="bigger" onClick={deleteBoxNon}>
                No
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="NewNameConfirm"
        style={{ display: newNameShow ? "flex" : "none" }}
        className={newNameScale ? "scaleIn" : "scaleOut"}
      >
        <div id="shareBoxOuter">
          <div id="profileNewnameBox">
            <div id="profileCancelBox">
              <Cancel
                id="cancelOutShare"
                onClick={reNameBoxNon}
                className="bigger"
              />
            </div>
            <div className="deleteH1">Give the board a new name!</div>
            <input
              placeholder="a new Name"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setNewNameCheck(false);
              }}
              onClick={() => {
                setNewNameCheck(false);
              }}
            />
            <div
              className="newNameCheck"
              id="newNameCheckDown"
              style={{ display: newNameCheck ? "block" : "none" }}
            >
              <small>New name could not be empty!</small>
            </div>
            <div className="deleteChosen">
              <div className="bigger" onClick={handleReNameUse}>
                Confirm
              </div>
              <div className="bigger" onClick={reNameBoxNon}>
                Cancel
              </div>
            </div>
          </div>
        </div>
      </div>
      <SharePage
        canvasId={boardChosen}
        sharePage={sharePage}
        setSharePage={setSharePage}
      />
    </>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
