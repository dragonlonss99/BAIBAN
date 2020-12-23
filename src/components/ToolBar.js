import React, { useState } from "react";
import { fabric } from "fabric";
import "fabric-history";
import firebase from "firebase";
import { ReactComponent as Eraser } from "../Img/toolbar/eraser.svg";
import { ReactComponent as Copy } from "../Img/toolbar/file.svg";
import { ReactComponent as Paste } from "../Img/toolbar/paste.svg";
import { ReactComponent as Cut } from "../Img/toolbar/scissors.svg";
import { ReactComponent as Undo } from "../Img/toolbar/undo-button.svg";
import { ReactComponent as Redo } from "../Img/toolbar/redo-button.svg";
import { ReactComponent as SelectAll } from "../Img/toolbar/select-all.svg";
import { ReactComponent as DeleteAll } from "../Img/toolbar/trash.svg";
import { ReactComponent as Group } from "../Img/toolbar/close.svg";
import { ReactComponent as Ungroup } from "../Img/toolbar/open.svg";
import { ReactComponent as LayerUp } from "../Img/toolbar/gotop.svg";
import { ReactComponent as LayerDown } from "../Img/toolbar/goBottom.svg";
import "./Toolbar.scss";
import { updateToCloud } from "../App.js";
export default function ToolBar(props) {
  const db = firebase.firestore();
  const name = props.name;
  const canvas = props.canvas;
  const [canvasColor, setCanvasColor] = useState("#ffffff");
  var ctrlDown = false,
    ctrlKey = 17,
    cmdKeyL = 91,
    cmdKeyR = 93,
    delKey = 8,
    vKey = 86,
    xKey = 88,
    cKey = 67,
    aKey = 65;
  onkeydown = (e) => {
    // console.log(e.keyCode);

    if (
      e.keyCode === ctrlKey ||
      e.keyCode === cmdKeyL ||
      e.keyCode === cmdKeyR
    ) {
      ctrlDown = true;
    }

    if (ctrlDown && e.keyCode === cKey) {
      copy(canvas);
    }
    if (ctrlDown && e.keyCode === xKey) {
      cut(canvas);
    }
    if (ctrlDown && e.keyCode === vKey) {
      paste(canvas);
    }
    if (ctrlDown && e.keyCode === aKey) {
      e.preventDefault();
      selectAll(canvas);
    }
    if (e.keyCode === delKey) {
      if (canvas.getActiveObject() && !canvas.getActiveObject().isEditing) {
        deleteChosen(canvas);
      }
    }
  };
  onkeyup = (e) => {
    if (
      e.keyCode === ctrlKey ||
      e.keyCode === cmdKeyL ||
      e.keyCode === cmdKeyR
    ) {
      ctrlDown = false;
    }
  };
  //group
  const group = () => {
    canvas.offHistory();
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type !== "activeSelection") {
      return;
    }
    canvas.getActiveObject().toGroup();

    canvas.fire("object:modified");
    canvas.renderAll();
    // updateToCloud(canvas);

    // canvas.onHistory();
  };
  //ungroup
  const ungroup = (canvi) => {
    canvas.offHistory();
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type !== "group") {
      return;
    }
    canvi.getActiveObject().toActiveSelection();
    canvi.renderAll();
    // updateToCloud(canvas);
    canvas.fire("object:modified");
    // canvas.onHistory();
  };
  //deleteChosen
  const deleteChosen = (canvi) => {
    // canvi.remove(canvi.getActiveObject());
    var doomedObj = canvi.getActiveObject();
    if (doomedObj.type === "activeSelection") {
      // active selection needs a reference to the canvi.
      doomedObj.canvi = canvi;
      doomedObj.forEachObject(function (obj) {
        canvi.remove(obj);
      });
    } //endif multiple objects
    else {
      //If single object, then delete it
      var activeObject = canvi.getActiveObject();
      //How to delete multiple objects?
      //if(activeObject !== null && activeObject.type === 'rectangle') {
      if (activeObject !== null) {
        canvi.remove(activeObject);
      }
    } //
    canvi.discardActiveObject();
    canvi.renderAll();
    updateToCloud(canvas);
    // canvas.fire("object:modified");
  };
  //deleteAll
  const deleteAll = (canvi) => {
    canvi.remove(...canvi.getObjects());
    canvi.discardActiveObject();
    canvi.renderAll();
  };

  //selectAll
  const selectAll = (canvas) => {
    canvas.discardActiveObject();
    var sel = new fabric.ActiveSelection(canvas.getObjects(), {
      canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
  };
  var clipboard = null;
  //cut
  const cut = (canvas) => {
    if (canvas.getActiveObject() === null) {
      return;
    }
    canvas.getActiveObject().clone(function (cloned) {
      clipboard = cloned;
      //remove after cloned to clipboard
      canvas.remove(canvas.getActiveObject());
      updateToCloud(canvas);
      // canvas.fire("object:modified");
    });
    // console.log(clipboard);
  };
  //copy
  const copy = () => {
    canvas.getActiveObject().clone(function (cloned) {
      clipboard = cloned;
    });
  };
  //paste
  const paste = (canvas) => {
    // canvas.offHistory();
    clipboard.clone(function (clonedObj) {
      canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });
      if (clonedObj.type === "activeSelection") {
        // active selection needs a reference to the canvas.
        clonedObj.canvas = canvas;
        clonedObj.forEachObject(function (obj) {
          canvas.add(obj);
        });
        // this should solve the unselectability
        clonedObj.setCoords();
      } else {
        canvas.add(clonedObj);
      }
      clipboard.top += 10;
      clipboard.left += 10;
      canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();
      updateToCloud(canvas);
      // canvas.fire("object:modified");
    });
  };
  //undo
  function doUndo() {
    // canvas.undo();
    canvas.undo();
    updateToCloud(canvas);

    // canvas.fire("object:modified");
    // let undoArr = [];
    // let redoArr = [];
    // db.collection("undoRedo")
    //   .doc(window.location.pathname.split("/")[2])
    //   .get()
    //   .then((data) => {
    //     if (data.data().undo.length !== 0) {
    //       undoArr = data.data().undo;
    //       redoArr = data.data().redo;
    //       let newCan = undoArr.pop();
    //       redoArr.push(newCan);
    //       if (redoArr.length > 5) {
    //         redoArr.shift();
    //       }
    //       db.collection("undoRedo")
    //         .doc(window.location.pathname.split("/")[2])
    //         .update({
    //           undo: undoArr,
    //           redo: redoArr,
    //         });
    //       db.collection("canvases")
    //         .doc(window.location.pathname.split("/")[2])
    //         .update({
    //           data: newCan,
    //         });
    //     }
    //   });
  }
  //redo
  function doRedo() {
    // canvas.redo();
    canvas.redo();
    updateToCloud(canvas);
    // canvas.fire("object:modified");
  }
  const bringForward = (canvas) => {
    // canvas.offHistory();

    canvas.getActiveObject().bringForward();
    // updateToCloud(canvas);
    canvas.fire("object:modified");
  };

  const sendBackwards = (canvas) => {
    // canvas.offHistory();

    canvas.getActiveObject().sendBackwards();
    // updateToCloud(canvas);
    canvas.fire("object:modified");
  };

  //canvascolor
  const changeCanvasColor = (e) => {
    canvas.backgroundColor = e.target.value;
    setCanvasColor(e.target.value);
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  // //share
  // const shareCanvas = (observerEmail) => {
  //   let canvasId = window.location.pathname.split("/")[2];
  //   var db = firebase.firestore();
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

  // const showShare = () => {
  //   document.querySelector("#shareInputBox").style.display === "block"
  //     ? (document.querySelector("#shareInputBox").style.display = "none")
  //     : (document.querySelector("#shareInputBox").style.display = "block");
  // };

  // const handleShare = () => {
  //   shareCanvas(shareInput);
  //   setShareInput("");
  // };
  const sharePagePop = () => {
    document.querySelector("#darkBack").className = "scaleIn";
    document.querySelector("#darkBack").style.display = "flex";
    document.querySelector("#dark").style.display = "block";
  };
  // const showShareBox = () => {
  //   document.querySelector("#darkBack").style.display = "flex";
  //   document.querySelector("#dark").style.display = "block";
  // };
  return (
    <>
      <div id="toolBarBox">
        <div id="toolBarName">
          <div style={{ display: "block" }}>{name}</div>
        </div>
        <div>
          <div className="toolBarIconBox blue">
            <Undo onClick={() => doUndo()} className="toolBarIcon" />
          </div>
          <div className="toolBarIconBox blue">
            <Redo onClick={() => doRedo()} className="toolBarIcon" />
          </div>
        </div>
        <div>
          <div className="toolBarIconBox orange">
            <Cut onClick={() => cut(canvas)} className="toolBarIcon" />
          </div>
          <div className="toolBarIconBox orange">
            <Copy onClick={copy} className="toolBarIcon" />
          </div>
          <div className="toolBarIconBox orange">
            <Paste onClick={() => paste(canvas)} className="toolBarIcon" />
          </div>
        </div>
        <div className="toolBarIconBox red">
          <Eraser
            onClick={() => deleteChosen(canvas)}
            className="toolBarIcon"
          />
        </div>
        <div>
          <div className="toolBarIconBox green">
            <LayerUp
              onClick={() => bringForward(canvas)}
              className="toolBarIcon"
            />
          </div>
          <div className="toolBarIconBox green">
            <LayerDown
              onClick={() => sendBackwards(canvas)}
              className="toolBarIcon"
            />
          </div>
          {/* <div className="toolBarIconBox green">
            <Group onClick={group} className="toolBarIcon" />
          </div>
          <div className="toolBarIconBox green">
            <Ungroup onClick={() => ungroup(canvas)} className="toolBarIcon" />
          </div> */}
        </div>
        <div className="toolBarIconBox ">
          <SelectAll
            onClick={() => selectAll(canvas)}
            className="toolBarIcon selectAll"
          />
        </div>

        <div id="shareBox" onClick={sharePagePop}>
          share
        </div>
        {/* <div id="shareInputBox" style={{ display: "none" }}> */}
        {/* <input
            value={shareInput}
            onChange={(e) => {
              setShareInput(e.target.value);
            }}
          />
          <button onClick={handleShare}>share</button> */}
        {/* </div> */}

        {/* <DeleteAll onClick={() => deleteAll(canvas)}/> */}
      </div>
      <div id="boardColor">
        <label>board's color：</label>
        <input
          onChange={changeCanvasColor}
          type="color"
          id="lineColorInput"
          value={canvasColor}
        />
      </div>
    </>
  );
}
