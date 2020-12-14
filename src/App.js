import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import "./App.scss";
import firebase from "firebase";
import firebaseConfig from "./firebaseConfig";
// import {} from "./components/fabric-brush";
// import AddShapes from "./components/AddShapes";
import TextAdjust from "./components/TextAdjust";
import RectAdjust from "./components/RectAdjust";
import ToolBar from "./components/ToolBar";
import PaintingTool from "./components/PaintingTool";
import SaveAndLoad from "./components/SaveAndLoad";
import LeftBar from "./components/LeftBar";
import { v4 as uuidv4 } from "uuid";
import ChatRoom from "./components/ChatRoom";
import logo from "./Img/icon13.svg";

// import { ReactComponent as Eraser } from "./Img/toolbar/eraser.svg";
// import { ReactComponent as Copy } from "./Img/toolbar/file.svg";
// import { ReactComponent as Paste } from "./Img/toolbar/paste.svg";
// import { ReactComponent as Cut } from "./Img/toolbar/scissors.svg";
// import { ReactComponent as Undo } from "./Img/toolbar/undo-button.svg";
// import { ReactComponent as Redo } from "./Img/toolbar/redo-button.svg";
// import { ReactComponent as SelectAll } from "./Img/toolbar/select-all.svg";
// import { ReactComponent as DeleteAll } from "./Img/toolbar/trash.svg";
// import LayerUp from "./Img/toolbar/LogoMakr-5M1FMp.png";
// import LayerDown from "./Img/toolbar/LogoMakr-9OkAXQ.png";
// import Group from "./Img/toolbar/LogoMakr-5r1jer.png";
// import Ungroup from "./Img/toolbar/LogoMakr-49eVq5.png";
const App = () => {
  const [canvas, setCanvas] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [active, setActive] = useState("");
  // const [canvasToLoad, setCanvasToLoad] = useState({});
  let canvasToLoad;
  // const [canvasColor, setCanvasColor] = useState("#ffffff");

  // let canvasToUpload;

  // var db = firebase.firestore();
  // db.collection("canvases")
  //   .doc(window.location.pathname.split("/")[2])
  //   .onSnapshot((querySnapshot) => {
  //     canvas.loadFromJSON(querySnapshot.data().data);
  //   });

  useEffect(() => {
    let activeObj = "";
    let editor = "";
    let color = "";
    // console.log(window.location.pathname.split("/")[2]);
    let canvasToSet = new fabric.Canvas("canvas", {
      // height: 500,
      // width: 600,
      width: window.innerWidth,
      height: window.innerHeight - 60,
      backgroundColor: "#ffffff",
    });
    var db = firebase.firestore();
    db.collection("canvases")
      .doc(window.location.pathname.split("/")[2])
      .get()
      .then((data) => {
        // if (data) {
        setName(data.data().name);
        // setCanvasToLoad(data.data().data);
        // canvasToLoad = data.data().data;
        // console.log(canvasToLoad);
        // }
      });
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        setAuthor(user.email);
        editor = user.email;
        console.log(user.email);
        fabric.Object.prototype.toObject = (function (toObject) {
          return function (propertiesToInclude) {
            return fabric.util.object.extend(
              toObject.call(this, propertiesToInclude),
              {
                editor: user.email, //my custom property
                // _controlsVisibility: this._getControlsVisibility(), //i want to get the controllsVisibility
              }
            );
          };
        })(fabric.Object.prototype.toObject);
      }
    });
    console.log(editor);

    fabric.Object.prototype.set({
      cornerColor: "white",
      conerSize: 20,
      cornerStrokeColor: "gray",
      borderColor: "gray",
      transparentCorners: false,
      cornerStyle: "circle",
      padding: 10,
    });

    function output(formatType) {
      const dataURL = canvas.toDataURL({
        format: "image/png",
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        multiplier: 1,
        quality: 0.1,
      });
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = `output.${formatType}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    // };
    // if (editor === "aaa@gmail.com") {
    //   color = "red";
    // } else if (editor === "bbb@gmail.com") {
    //   color = "blue";
    // } else {
    //   color = "gray";
    // }

    // fabric.Object.prototype.set({
    //   cornerColor: "white",
    //   conerSize: 20,
    //   cornerStrokeColor: color,
    //   borderColor: color,
    //   transparentCorners: false,
    //   cornerStyle: "circle",
    //   padding: 10,
    // });
    canvasToSet.preserveObjectStacking = true;
    //override prototype.toObject and add your custom properties here
    // fabric.Object.prototype.toObject = (function (toObject) {
    //   return function () {
    //     return fabric.util.object.extend(toObject.call(this), {
    //       author: author, //my custom property
    //       // _controlsVisibility: this._getControlsVisibility(), //i want to get the controllsVisibility
    //     });
    //   };
    // })(fabric.Object.prototype.toObject);
    // fabric.Object.prototype.toObject = (function (toObject) {
    //   return function (propertiesToInclude) {
    //     return fabric.util.object.extend(
    //       toObject.call(this, propertiesToInclude),
    //       {
    //         editor: author, //my custom property
    //         // _controlsVisibility: this._getControlsVisibility(), //i want to get the controllsVisibility
    //       }
    //     );
    //   };
    // })(fabric.Object.prototype.toObject);
    // canvasToSet.historyInit();
    canvasToSet.on("object:modified", (e) => {
      // console.log("modified");
      updateToCloud();
      getActive();
      // setColor();
      // console.log(editor);
      // console.log(author);
    });
    // canvasToSet.on("object:added", (e) => {
    //   console.log("added");
    //   // updateToCloud();
    // });
    canvasToSet.on("object:removed", (e) => {
      console.log("removed");
      updateToCloud();
      // getActive();
    });
    canvasToSet.on("selection:updated", (e) => {
      // console.log(e.target);
      // updateToCloud();
      getActive();
    });

    canvasToSet.on("selection:created", (e) => {
      // console.log(e.target);
      // updateToCloud();
      getActive();
    });
    canvasToSet.on("mouse:up", () => {
      if (canvasToSet.isDrawingMode) {
        canvasToSet.fire("object:modified");
      }
      // console.log("up");
      // updateToCloud();
    });
    canvasToSet.on("selection:cleared", (e) => {
      db.collection("canvases")
        .doc(window.location.pathname.split("/")[2])
        .onSnapshot((querySnapshot) => {
          getActive();
          canvasToLoad = querySnapshot.data().data;
          if (
            canvasToSet.getActiveObject() === undefined ||
            canvasToSet.getActiveObject() === null
          ) {
            canvasToSet.loadFromJSON(querySnapshot.data().data);
          }
        });
    });

    const updateToCloud = () => {
      let canvasToUpload = JSON.stringify(canvasToSet.toJSON());
      var db = firebase.firestore();
      db.collection("canvases")
        .doc(window.location.pathname.split("/")[2])
        .update({
          data: canvasToUpload,
        });
    };
    const getActive = () => {
      if (canvasToSet.getActiveObject()) {
        // console.log(canvasToSet.getActiveObject());
        setActive(canvasToSet.getActiveObject());
        activeObj = canvasToSet.getActiveObject();
        // console.log(activeObj);
        // console.log(author);
      }
    };
    db.collection("canvases")
      .doc(window.location.pathname.split("/")[2])
      .onSnapshot((querySnapshot) => {
        getActive();
        canvasToLoad = querySnapshot.data().data;
        // canvasToSet.loadFromJSON(querySnapshot.data().data);
        // console.log(querySnapshot.data().data);
        if (
          canvasToSet.getActiveObject() === undefined ||
          canvasToSet.getActiveObject() === null
        ) {
          canvasToSet.loadFromJSON(querySnapshot.data().data);
          canvasToSet.clearHistory();

          // console.log("up");
        }
        // console.log(querySnapshot.data().data);
        // console.log(active);
        // if (activeObj !== "") {
        //   // canvasToSet.setActiveObject(active);
        //   canvasToSet.setActiveObject(activeObj);
        // }
        //   // console.log(canvasToSet.getActiveObject());
        //   console.log(activeObj);
      });
    // .then(() => {
    //   canvasToSet.loadFromJSON(canvasToLoad);
    // });

    // canvasToSet.isDrawingMode = true;
    // addKeyControl();
    // canvasToSet.clearHistory();

    setCanvas(canvasToSet);
    console.log(canvasToSet.historyUndo);
    canvasToSet.clearHistory();

    // canvas.loadFromJSON(canvasToLoad);
  }, []);
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

  return (
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
          <ToolBar canvas={canvas} name={name} />
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
          <ChatRoom author={author} />
        </div>
      </div>
    </div>
  );
};

export default App;
