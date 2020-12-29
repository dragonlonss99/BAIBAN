import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import "./App.scss";
import firebase from "firebase/app";
import ToolBar from "./components/ToolBar";
import LeftBar from "./components/LeftBar";
import ChatRoom from "./components/ChatRoom";
import logo from "./Img/icon13.svg";
import { ReactComponent as Cancel } from "./Img/back/cancel.svg";
import "fabric-history";
import { ReactComponent as Cowork } from "./Img/profile/undraw_Online_collaboration.svg";
import { ReactComponent as Learn } from "./Img/profile/undraw_Online_learning.svg";
import rotate from "./Img/refresh.svg";

export const updateToCloud = (canvas) => {
  let canvasToUpload = JSON.stringify(canvas.toJSON());
  const dataURL = canvas.toDataURL({
    format: "png",
    top: 0,
    left: 0,
    width: canvas.width,
    height: canvas.height,
    multiplier: 0.5,
    quality: 0.1,
  });
  firebase
    .firestore()
    .collection("canvases")
    .doc(window.location.pathname.split("/")[2])
    .update({
      data: canvasToUpload,
      photoURL: dataURL,
    });
};

const App = () => {
  const [canvas, setCanvas] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [shareInput, setShareInput] = useState("");
  const [shareInputUse, setShareInputUse] = useState("");
  const [shareInputObserve, setShareInputObserve] = useState("");
  const [chatEditing, setChatEditing] = useState(false);

  const db = firebase.firestore();

  useEffect(() => {
    let canvasToSet = new fabric.Canvas("canvas", {
      // height: 500,
      // width: 600,
      width: window.innerWidth,
      height: window.innerHeight - 60,
      backgroundColor: "#ffffff",
      selection: false,
      objectChaching: false,
    });

    db.collection("canvases")
      .doc(window.location.pathname.split("/")[2])
      .get()
      .then((data) => {
        // if (data) {
        setName(data.data().name);
      });
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        setAuthor(user.email);
        // editor = user.email;
        console.log(user.email);
        // fabric.Object.prototype.toObject = (function (toObject) {
        //   return function (propertiesToInclude) {
        //     return fabric.util.object.extend(
        //       toObject.call(this, propertiesToInclude),
        //       {
        //         editor: user.email, //my custom property
        //         // _controlsVisibility: this._getControlsVisibility(), //i want to get the controllsVisibility
        //       }
        //     );
        //   };
        // })(fabric.Object.prototype.toObject);
        canvasToSet.on("object:modified", () => {
          console.log("modified");
          if (beenStoped) {
            updateModifiedData(user.email, () => {
              updateSelectToCloud(user.email);
            });
          } else {
            if (canvasToSet.getActiveObject()) {
              updateSelectToCloud(user.email);
              updateToCloud(canvasToSet);
            } else {
              updateToCloud(canvasToSet);
            }
          }
        });
        canvasToSet.on("selection:created", () => {
          // getActive();
          updateSelectToCloud(user.email);
          // console.log(e.target);
        });
        canvasToSet.on("selection:updated", () => {
          updateSelectToCloud(user.email);
          // canvasToSet.fire("object:modified");
        });
        canvasToSet.on("mouse:down", () => {
          if (!canvasToSet.getActiveObject()) {
            db.collection("selectedObj")
              .doc(window.location.pathname.split("/")[2])
              .collection("userSelect")
              .doc(user.email)
              .update({
                selected: false,
              });
          }
        });
        window.onbeforeunload = () => {
          db.collection("selectedObj")
            .doc(window.location.pathname.split("/")[2])
            .collection("userSelect")
            .doc(user.email)
            .update({
              selected: false,
            });
          const dataURL = canvasToSet.toDataURL({
            format: "png",
            top: 0,
            left: 0,
            width: canvasToSet.width,
            height: canvasToSet.height,
            multiplier: 0.5,
            quality: 0.1,
          });
          db.collection("canvases")
            .doc(window.location.pathname.split("/")[2])
            .update({
              photoURL: dataURL,
            });
        };
      }
    });

    fabric.Object.prototype.set({
      cornerColor: "white",
      conerSize: 20,
      cornerStrokeColor: "gray",
      borderColor: "gray",
      transparentCorners: false,
      cornerStyle: "circle",
      padding: 10,
    });

    fabric.Object.prototype.controls.mtr = new fabric.Control({
      x: 0,
      y: -0.5,
      offsetY: -40,
      withConnection: true,
      actionName: "rotate",
      cursorStyle: "pointer",
      // hoverCursor: "pointer",
      // mouseUpHandler: rotateObject,
      cornerSize: 20,
      actionHandler: fabric.controlsUtils.rotationWithSnapping,
    });

    function updateModifiedData(user, callback) {
      db.collection("selectedObj")
        .doc(window.location.pathname.split("/")[2])
        .collection("userSelect")
        .doc(user)
        .get()
        .then((selectData) => {
          db.collection("canvases")
            .doc(window.location.pathname.split("/")[2])
            .get()
            .then((canvasData) => {
              beenStoped = false;
              if (selectData.exists) {
                let selectedD = JSON.parse(selectData.data().ObjSelected);
                let canvasD = JSON.parse(canvasData.data().data);
                let activeD = canvasToSet.getActiveObject();
                // console.log(canvasD.objects);
                // console.log(activeD);
                // console.log(selectedD);

                canvasD.objects.forEach((obj) => {
                  if (
                    obj.type === selectedD.type &&
                    obj.left === selectedD.left &&
                    obj.top === selectedD.top &&
                    obj.width === selectedD.width &&
                    obj.height === selectedD.height &&
                    obj.fill === selectedD.fill &&
                    obj.stroke === selectedD.stroke &&
                    obj.strokeWidth === selectedD.strokeWidth &&
                    obj.angle === selectedD.angle
                    // JSON.stringify(obj) === JSON.stringify(selectedD)
                    //find the selected one
                  ) {
                    // console.log(JSON.stringify(obj));
                    canvasD.objects.splice(
                      canvasD.objects.indexOf(obj),
                      1,
                      activeD
                    );
                    db.collection("canvases")
                      .doc(window.location.pathname.split("/")[2])
                      .update({
                        data: JSON.stringify(canvasD),
                      });
                    // console.log(canvasD.length);
                  }
                });
                // console.log(JSON.stringify(activeD));
                // console.log(canvasD.objects);
                if (activeD) {
                  callback();
                }
              } else {
                updateToCloud(canvasToSet);
              }
            });
        });
    }
    canvasToSet.on("object:added", (e) => {
      console.log("added");
    });
    canvasToSet.on("object:removed", (e) => {
      console.log("removed");
      // updateToCloud();
    });

    var updateAble = true;
    var beenStoped = false;
    canvasToSet.on("mouse:up", () => {
      if (canvasToSet.isDrawingMode) {
        updateToCloud(canvasToSet);
      }

      updateAble = true;
      // console.log(updateAble);
      // console.log("up");
    });
    canvasToSet.on("mouse:down", () => {
      updateAble = false;
      // console.log(updateAble);
    });
    // let undoArr = [];
    // let opencanvasSnap = false;
    db.collection("canvases")
      .doc(window.location.pathname.split("/")[2])
      .get()
      .then((data) => {
        // opencanvasSnap = true;
        // firebase.auth().onAuthStateChanged(function (user) {
        //   setActive(user.email, () => {
        // canvasToSet.loadFromJSON(data.data().data);
        canvasToSet.clearHistory();
        // console.log(opencanvasSnap);
        // });
        // });
      });

    db.collection("canvases")
      .doc(window.location.pathname.split("/")[2])
      .onSnapshot((querySnapshot) => {
        // if (opencanvasSnap) {
        // console.log(opencanvasSnap);
        if (!updateAble && canvasToSet.getObjects()) {
          beenStoped = true;
          return;
        } else {
          // console.log("new");
          firebase.auth().onAuthStateChanged(function (user) {
            // updateSelectToCloud(user.email);
            setActive(user.email, () => {
              canvasToSet.offHistory();
              canvasToSet.loadFromJSON(querySnapshot.data().data);
              canvasToSet.onHistory();
            });
            // canvasToSet.onHistory();
          });
          // canvasToSet.clearHistory();
        }
        // }
      });

    const updateSelectToCloud = (user) => {
      let ObjSelected = JSON.stringify(canvasToSet.getActiveObject());
      // console.log(ObjSelected);
      db.collection("selectedObj")
        .doc(window.location.pathname.split("/")[2])
        .collection("userSelect")
        .doc(user)
        .set({
          ObjSelected: ObjSelected,
          selected: true,
        });
    };

    db.collection("selectedObj")
      .doc(window.location.pathname.split("/")[2])
      .collection("userSelect")
      .onSnapshot((querySnapshot) => {
        if (!updateAble && canvasToSet.getObjects()) {
          beenStoped = true;
          return;
        } else {
          firebase.auth().onAuthStateChanged(function (user) {
            querySnapshot.docChanges().forEach((change) => {
              // console.log("selectUp");
              if (change.type === "added") {
                querySnapshot.forEach((doc) => {
                  // console.log(doc.exists());
                  if (doc.id !== user.email) {
                    // console.log(doc.data().ObjSelected);
                    let json = JSON.parse(doc.data().ObjSelected);
                    // console.log(canvasToSet.getObjects());
                    canvasToSet.getObjects().forEach((obj) => {
                      if (
                        doc.data().selected === true &&
                        obj.type === json.type &&
                        obj.left === json.left &&
                        obj.height === json.height
                      ) {
                        // console.log("1");
                        obj.set({
                          opacity: 0.4,
                          // opacity: json.opacity * 0.4,
                          selectable: false,
                          evented: false,
                        });
                        canvasToSet.renderAll();
                      }
                    });
                  }
                });
              }
              if (change.type === "modified") {
                querySnapshot.forEach((doc) => {
                  if (doc.id !== user.email) {
                    // console.log(doc.data().ObjSelected);
                    let json = JSON.parse(doc.data().ObjSelected);
                    // console.log(json);
                    canvasToSet.getObjects().forEach((obj) => {
                      // console.log(doc.data());
                      // console.log("2");
                      obj.set({
                        opacity: 1,
                        // opacity: json.opacity * 2.5,
                        selectable: true,
                        evented: true,
                      });
                      // if (obj.opacity > 1) {
                      //   obj.set({
                      //     opacity: 1,
                      //   });
                      // }
                      canvasToSet.renderAll();
                      if (
                        obj.type === json.type &&
                        obj.left === json.left &&
                        obj.height === json.height
                      ) {
                        // console.log("got");
                        if (doc.data().selected) {
                          obj.set({
                            opacity: 0.4,
                            // opacity: json.opacity * 0.4,
                            selectable: false,
                            evented: false,
                          });
                        }
                        canvasToSet.renderAll();
                      }
                    });
                  }
                });
              }
            });
          });
        }
      });

    const setActive = (user, callback) => {
      db.collection("selectedObj")
        .doc(window.location.pathname.split("/")[2])
        .collection("userSelect")
        .get()
        .then((querySnapshot) => {
          db.collection("canvases")
            .doc(window.location.pathname.split("/")[2])
            .get()
            .then((data) => {
              // canvasToSet.onHistory();
              if (!data.data()) {
                return;
              }
              if (data.data().data === "") {
                return;
              }
              let canvasCloud = JSON.parse(data.data().data).objects;
              let canvasNow = canvasToSet.toJSON().objects;
              // console.log(canvasCloud);
              // console.log(canvasNow);
              for (var i = 0; i < canvasCloud.length; i++) {
                if (
                  canvasNow.length === canvasCloud.length &&
                  canvasCloud[i].type === canvasNow[i].type &&
                  canvasCloud[i].left === canvasNow[i].left &&
                  canvasCloud[i].top === canvasNow[i].top &&
                  canvasCloud[i].width === canvasNow[i].width &&
                  canvasCloud[i].height === canvasNow[i].height &&
                  canvasCloud[i].fill === canvasNow[i].fill &&
                  canvasCloud[i].stroke === canvasNow[i].stroke &&
                  canvasCloud[i].strokeWidth === canvasNow[i].strokeWidth &&
                  canvasCloud[i].angle === canvasNow[i].angle
                ) {
                  console.log("same");
                  canvasToSet.renderAll();
                } else {
                  console.log("diff");
                  callback();
                }
              }
              // canvasCloud.forEach((obj)=>{
              //   if(obj.type === selectedD.type &&
              //     obj.left === selectedD.left &&
              //     obj.top === selectedD.top &&
              //     obj.width === selectedD.width &&
              //     obj.height === selectedD.height &&
              //     obj.fill === selectedD.fill &&
              //     obj.stroke === selectedD.stroke &&
              //     obj.strokeWidth === selectedD.strokeWidth &&
              //     obj.angle === selectedD.angle){
              //       return;
              //     }else{
              //       callback();
              //     }
              // })
              // if (canvasCloud !== canvasNow) {
              // callback();
              //   // console.log("diff");
              //   // } else {
              //   //   // console.log("same");
              // }

              // console.time("123");
              querySnapshot.forEach((doc) => {
                if (doc.id !== user) {
                  // console.log("y");
                  let json = JSON.parse(doc.data().ObjSelected);
                  // console.log(json);
                  canvasToSet.getObjects().forEach((obj) => {
                    // console.log(obj);
                    if (
                      doc.data().selected &&
                      obj.type === json.type &&
                      obj.left === json.left &&
                      obj.height === json.height
                    ) {
                      // console.log("setO");
                      obj.set({
                        // opacity: json.opacity * 0.4,
                        opacity: 0.4,
                        selectable: false,
                        evented: false,
                      });
                      canvasToSet.renderAll();
                    }
                  });
                } else if (doc.id === user && doc.data()) {
                  let json = JSON.parse(doc.data().ObjSelected);
                  canvasToSet.getObjects().forEach((obj) => {
                    if (
                      doc.data().selected &&
                      obj.type === json.type &&
                      obj.left === json.left &&
                      obj.height === json.height
                    ) {
                      obj.set({
                        opacity: 1,
                        selectable: true,
                        evented: true,
                      });
                      canvasToSet.setActiveObject(obj);
                      canvasToSet.renderAll();
                    }
                  });
                }
              });
            }); // console.timeEnd("123");
        });
    };

    // canvasToSet.isDrawingMode = true;
    // addKeyControl();
    // canvasToSet.clearHistory();
    // if (shouldBlockNavigation) {
    //   window.onbeforeunload = () => true;
    // } else {
    //   window.onbeforeunload = undefined;
    // }
    setCanvas(canvasToSet);
    console.log(canvasToSet.historyUndo);
    // const history = createBrowserHistory();
    // history.listen((location) => console.log(location));
    // const history = useHistory();
    // canvasToSet.clearHistory();
    // let history = useHistory();
    // return () => {
    // history.listen((location) => {
    //   console.log(`You changed the page to: ${location.pathname}`);
    // });
    // };
  }, []);
  // const history = createBrowserHistory();

  // useEffect(() => {
  //   browserHis
  //   return history.listenBefore(() => {
  //     firebase.auth().onAuthStateChanged(function (user) {
  //       db.collection("selectedObj")
  //         .doc(window.location.pathname.split("/")[2])
  //         .collection("userSelect")
  //         .doc(user.email)
  //         .update({
  //           selected: false,
  //         });
  //       const dataURL = canvas.toDataURL({
  //         format: "png",
  //         top: 0,
  //         left: 0,
  //         width: canvas.width,
  //         height: canvas.height,
  //         multiplier: 0.5,
  //         quality: 0.1,
  //       });
  //       db.collection("canvases")
  //         .doc(window.location.pathname.split("/")[2])
  //         .update({
  //           photoURL: dataURL,
  //         });
  //     });
  //   });
  // }, [history]);
  // if (active) {
  //   canvas.setActiveObject(active);
  // }
  // useEffect(() => console.log(canvasToLoad), []);
  // canvas.loadFromJSON(canvasToLoad);
  // console.log(canvasToLoad);
  // fabric.Object.prototype.toObject = (function (toObject) {
  //   return function () {
  //     return fabric.util.object.extend(toObject.call(this), {
  //       author: author, //my custom property
  //       // _controlsVisibility: this._getControlsVisibility(), //i want to get the controllsVisibility
  //     });
  //   };
  // })(fabric.Object.prototype.toObject);

  // const handleInputName = (e) => {
  //   setName(e.target.value);
  // };

  //changeCanvasColor
  // const changeCanvasColor = (e) => {
  //   canvas.backgroundColor = e.target.value;
  //   setCanvasColor(e.target.value);
  //   canvas.renderAll();
  // };

  // let mouseX;
  // let mouseY;
  // let scrollX;
  // let scrollY;
  // let mouseDown = false;
  // onkeydown = (e) => {
  //   console.log(e.keyCode);
  //   var ctrlDown = false,
  //     ctrlKey = 17,
  //     cmdKeyL = 91,
  //     cmdKeyR = 93;
  //   if (
  //     e.keyCode === ctrlKey ||
  //     e.keyCode === cmdKeyL ||
  //     e.keyCode === cmdKeyR
  //   ) {
  //     ctrlDown = true;
  //   }
  // };
  // // onmousewheel = (e) => {
  // //   console.log(e);
  // // };
  // const mousedown = (e) => {
  //   mouseDown = true;
  //   let can = document.querySelector("#canvas");
  //   mouseX = e.pageX;
  //   mouseY = e.pageY;
  //   scrollX = can.scrollLeft;
  //   scrollY = can.scrollTop;
  //   console.log(e.pageX, e.pageY);
  //   console.log(scrollX, scrollY);
  //   console.log("r");
  // };
  // const mouseup = () => {};
  // const mouseleave = () => {};
  // const mousemove = () => {};

  // onmousedown = (e) => {
  //   mouseDown = true;
  //   let can = document.querySelector("#canvas");
  //   mouseX = e.pageX;
  //   mouseY = e.pageY;
  //   scrollX = can.scrollLeft;
  //   scrollY = can.scrollTop;
  //   // console.log(e.pageX, e.pageY);
  //   console.log(scrollX, scrollY);
  // };
  // onmousemove = (e) => {
  //   let can = document.querySelector("#canvas");
  //   if (mouseDown) {
  //     let moveX = e.pageX - mouseX;
  //     let moveY = e.pageY - mouseY;
  //     can.scrollLeft = scrollX - moveX;
  //     // console.log(moveX, moveY);
  //   }
  // };
  // onmouseup = () => {
  //   mouseDown = false;
  // };
  //記錄滑鼠狀態
  // var move_div; //要操作的div物件
  // var m_move_x, m_move_y, m_down_x, m_down_y, dx, dy, md_x, md_y, ndx, ndy;
  // //滑鼠按下
  // function down() {
  // move_div = document.getElementById("canvas");
  // isDown = true;
  // //獲取滑鼠按下時座標
  // m_down_x = event.pageX;
  // m_down_y = event.pageY;
  // //獲取div座標
  // dx = move_div.offsetLeft;
  // dy = move_div.offsetTop;
  // //獲取滑鼠與div偏移量
  // md_x = m_down_x - dx;
  // md_y = m_down_y - dy;
  // }
  // //滑鼠移動
  // function move() {
  // move_div = document.getElementById("canvas");
  // //實時更新div的座標
  // dx = move_div.offsetLeft;
  // dy = move_div.offsetTop;
  // //獲取滑鼠移動實時座標
  // m_move_x = event.pageX;
  // m_move_y = event.pageY;
  // //滑鼠按下時移動才觸發
  // if (isDown) {
  //   //獲取新div座標，滑鼠實時座標 - 滑鼠與div的偏移量
  //   ndx = m_move_x - md_x;
  //   ndy = m_move_y - md_y;
  //   //把新div座標值賦給div物件
  //   move_div.style.left = ndx + "px";
  //   move_div.style.top = ndy + "px";
  // }
  // }
  // //滑鼠釋放
  // function up() {
  //   // isDown = false;
  // }
  // //crayon
  // const crayon = () => {
  //   canvas.freeDrawingBrush = new fabric.CrayonBrush(canvas, {
  //     // width: 70,
  //     opacity: 0.6,
  //     // color: "#ff0000",
  //   });
  //   canvas.on("mouse:up", function (opt) {
  //     if (canvas.isDrawingMode) {
  //       var c = fabric.util.copyCanvasElement(canvas.upperCanvasEl);
  //       var img = new fabric.Image(c);
  //       canvas.contextTopDirty = true;
  //       canvas.add(img);
  //       canvas.isDrawingMode = false;
  //     }
  //   });
  // };

  // const Ink = () => {
  //   canvas.freeDrawingBrush = new fabric.InkBrush(canvas, {
  //     // width: 70,
  //     opacity: 0.6,
  //     // color: "#ff0000",
  //   });
  // };

  // const Marker = () => {
  //   canvas.freeDrawingBrush = new fabric.MarkerBrush(canvas, {
  //     // width: 70,
  //     opacity: 0.6,
  //     // color: "#ff0000",
  //   });
  // };

  //drawingBox

  // const $ = (id) => document.getElementById(id);
  // const strokeWidthValue = $("strokeWidthValue");
  // const drawingOptionArea = $("drawingOptionArea");
  // const clearBtn = $("clear");
  // const modeBtn = $("mode");

  // const outputJpegBtn = $("outputJpgBtn");
  // const outputPngBtn = $("outputPngBtn");
  // const brushSelector = $("brushSelect");

  // const myShadow = {
  //   color: "black",
  //   blur: 1,
  //   offsetX: 1,
  //   offsetY: 1,
  // };
  // function selectBrush() {
  //   if (brushSelector.value === "Square") {
  //     const squareBrush = new fabric.PatternBrush(canvas);
  //     // getPatternSrc  取得要重複繪製的圖形 Canvas
  //     squareBrush.getPatternSrc = function () {
  //       const squareWidth = 30;
  //       const squareDistance = 2;
  //       // 創立一個暫存 canvas 來繪製要畫的圖案
  //       const patternCanvas = fabric.document.createElement("canvas");
  //       // canvas 總大小為每一格畫筆的大小
  //       patternCanvas.width = patternCanvas.height =
  //         squareWidth + squareDistance;
  //       const ctx = patternCanvas.getContext("2d");
  //       ctx.fillStyle = lineColorInput.value;
  //       ctx.fillRect(0, 0, squareWidth, squareWidth);
  //       // 回傳繪製完畢的 canvas
  //       return patternCanvas;
  //     };

  //     canvas.freeDrawingBrush = squareBrush;
  //   } else {
  //     canvas.freeDrawingBrush = new fabric[`${brushSelector}.value ` + "Brush"](
  //       canvas
  //     );
  //   }
  //   canvas.freeDrawingBrush.color = lineColorInput.value;
  //   canvas.freeDrawingBrush.width = parseInt(lineWidthInput.value, 10) || 1;
  //   // canvas.freeDrawingBrush.setShadow(myShadow);
  // }
  // canvas.historyInit();
  //share
  // const shareCanvas = (observerEmail) => {
  //   let canvasId = window.location.pathname.split("/")[2];

  //   db.collection("canvases")
  //     .doc(canvasId)
  //     .update({
  //       observer: firebase.firestore.FieldValue.arrayUnion(observerEmail),
  //     });
  //   db.collection("users")
  //     .doc(observerEmail)
  //     .update({
  //       canvasRead: firebase.firestore.FieldValue.arrayUnion(canvasId),
  //     });
  // };

  // const handleShare = () => {
  //   shareCanvas(shareInput);
  //   setShareInput("");
  //   shareBoxNon();
  // };
  // const shareBoxNon = () => {
  //   document.querySelector("#darkBack").style.display = "none";
  //   document.querySelector("#dark").style.display = "none";
  // };

  // const showShareBox = () => {
  //   document.querySelector("#darkBack").style.display = "flex";
  //   document.querySelector("#dark").style.display = "block";
  // };
  // const sharePagePop = () => {
  //   document.querySelector("#darkBack").className = "scaleIn";
  //   document.querySelector("#darkBack").style.display = "flex";
  //   document.querySelector("#dark").style.display = "block";
  // };

  const shareCanvasUse = (observerEmail) => {
    let canvasId = window.location.pathname.split("/")[2];

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
    let canvasId = window.location.pathname.split("/")[2];

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
    <div>
      <div id="container">
        <LeftBar canvas={canvas} name={name} />
        {/* <div id="leftside">
        <div id="addShapesCon">
        <AddShapes canvas={canvas} id="addShapes" />
        </div>
        <div id="toolcontent"></div>
      </div> */}
        <div id="rightside">
          <div id="top_bar">
            <ToolBar canvas={canvas} name={name} chatEditing={chatEditing} />
            {/* <div>
            <label>背景顏色：</label>
            <input
              onChange={changeCanvasColor}
              type="color"
              id="lineColorInput"
              value={canvasColor}
            />
          </div> */}
          </div>
          {/* <button onClick={addCircle}>circle test</button>
        <button onClick={addEllipse}>ellipse test</button>
        <button onClick={copy}>copy test</button>
        <button onClick={paste}>paste test</button> */}
          <div id="canvas_area">
            {/* <h1>BIBen</h1>
      <label>What's the name of your project</label>
      <input value={name} onChange={handleInputName} /> */}

            {/* <RectAdjust canvas={canvas} /> */}

            {/* <PaintingTool canvas={canvas} /> */}
            {/* <SaveAndLoad canvas={canvas} name={name} /> */}

            {/* <button onClick={crayon}>Crayon</button>
      <button onClick={Ink}>Ink</button>
      <button onClick={Marker}>Marker</button> */}

            {/* <button>Sigma</button>
      <button>Sin</button> */}

            {/* <div>
          <select id="brushSelect" onChange={selectBrush}>
            <option value="Pencil">Pencil</option>
            <option value="Circle">Circle</option>
            <option value="Spray">Spray</option>
            <option value="Square">Square</option>
          </select>
        </div> */}

            {/* <TextAdjust canvas={canvas} /> */}

            <canvas
              id="canvas"
              // onMouseDown={mousedown}
              // onMouseMove={mousemove}
              // onMouseUp={mouseup}
              // onMouseLeave={mouseleave}
            />
            <ChatRoom author={author} setChatEditing={setChatEditing} />
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
    </div>
  );
};

export default App;
