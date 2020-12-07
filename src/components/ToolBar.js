import React, { useState } from "react";
import { fabric } from "fabric";
import "fabric-history";
import { ReactComponent as Eraser } from "../Img/toolbar/eraser.svg";
import { ReactComponent as Copy } from "../Img/toolbar/file.svg";
import { ReactComponent as Paste } from "../Img/toolbar/paste.svg";
import { ReactComponent as Cut } from "../Img/toolbar/scissors.svg";
import { ReactComponent as Undo } from "../Img/toolbar/undo-button.svg";
import { ReactComponent as Redo } from "../Img/toolbar/redo-button.svg";
import { ReactComponent as SelectAll } from "../Img/toolbar/select-all.svg";
import { ReactComponent as DeleteAll } from "../Img/toolbar/trash.svg";
// import LayerUp from "../Img/toolbar/LogoMakr-1IGO03.png";
// import LayerDown from "../Img/toolbar/LogoMakr-6RIrpF.png";
// import Group from "../Img/toolbar/LogoMakr-6c3rAZ.png";
// import Ungroup from "../Img/toolbar/LogoMakr-6lQnhn.png";
import { ReactComponent as Group } from "../Img/toolbar/close.svg";
import { ReactComponent as Ungroup } from "../Img/toolbar/open.svg";
import { ReactComponent as LayerUp } from "../Img/toolbar/gotop.svg";
import { ReactComponent as LayerDown } from "../Img/toolbar/goBottom.svg";
import "./Toolbar.css";
export default function ToolBar(props) {
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
  const group = (canvi) => {
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type !== "activeSelection") {
      return;
    }
    canvi.getActiveObject().toGroup();
    canvi.renderAll();
  };
  //ungroup
  const ungroup = (canvi) => {
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type !== "group") {
      return;
    }
    canvi.getActiveObject().toActiveSelection();
    canvi.renderAll();
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
    });
  };
  //undo
  function doUndo() {
    canvas.undo();
  }
  //redo
  function doRedo() {
    canvas.redo();
  }
  const bringForward = (canvas) => {
    canvas.getActiveObject().bringForward();
  };

  const sendBackwards = (canvas) => {
    canvas.getActiveObject().sendBackwards();
  };

  //canvascolor
  const changeCanvasColor = (e) => {
    canvas.backgroundColor = e.target.value;
    setCanvasColor(e.target.value);
    canvas.renderAll();
  };
  return (
    <div id="toolBarBox">
      <div>{name}</div>
      <Undo onClick={() => doUndo()} className="toolBarIcon" />
      <Redo onClick={() => doRedo()} className="toolBarIcon" />
      <Cut onClick={() => cut(canvas)} className="toolBarIcon" />
      <Copy onClick={copy} className="toolBarIcon" />
      <Paste onClick={() => paste(canvas)} className="toolBarIcon" />
      <Eraser onClick={() => deleteChosen(canvas)} className="toolBarIcon" />
      <LayerUp onClick={() => bringForward(canvas)} className="toolBarIcon" />
      <LayerDown
        onClick={() => sendBackwards(canvas)}
        className="toolBarIcon"
      />
      <Group onClick={() => group(canvas)} className="toolBarIcon" />
      <Ungroup onClick={() => ungroup(canvas)} className="toolBarIcon" />
      <SelectAll onClick={() => selectAll(canvas)} className="toolBarIcon" />
      {/* <div> */}
      <label>背景顏色：</label>
      <input
        onChange={changeCanvasColor}
        type="color"
        id="lineColorInput"
        value={canvasColor}
      />
      {/* </div> */}
      {/* <DeleteAll onClick={() => deleteAll(canvas)}/> */}

      {/* 
      <button onClick={() => group(canvas)}>Group</button>
      <button onClick={() => ungroup(canvas)}>Ungroup</button>
      <button onClick={() => deleteChosen(canvas)}>Delete Chosen</button>
      <button onClick={() => deleteAll(canvas)}>Delete All</button>
      <button onClick={() => cut(canvas)}>Cut</button>
      <button onClick={() => copy(canvas)}>Copy</button>
      <button onClick={() => paste(canvas)}>Paste</button>
      <button onClick={() => selectAll(canvas)}>SelectAll</button>
      <button onClick={() => doUndo()}>Undo</button>
      <button onClick={() => doRedo()}>Redo</button>
      <button onClick={() => bringForward(canvas)}>上移一層</button>
      <button onClick={() => sendBackwards(canvas)}>下移一層</button> */}
    </div>
  );
}
