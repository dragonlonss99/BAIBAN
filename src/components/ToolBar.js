/* eslint-disable react/prop-types */
import { useState } from "react";
import "fabric-history";
import { ReactComponent as Eraser } from "../Img/toolbar/eraser.svg";
import { ReactComponent as Copy } from "../Img/toolbar/file.svg";
import { ReactComponent as Paste } from "../Img/toolbar/paste.svg";
import { ReactComponent as Cut } from "../Img/toolbar/scissors.svg";
import { ReactComponent as Undo } from "../Img/toolbar/undo-button.svg";
import { ReactComponent as Redo } from "../Img/toolbar/redo-button.svg";
import { ReactComponent as LayerUp } from "../Img/toolbar/gotop.svg";
import { ReactComponent as LayerDown } from "../Img/toolbar/goBottom.svg";
import "./Toolbar.scss";
import { updateToCloud } from "../App.js";
import * as firebaseApp from "../utils/firebaseUtils";

export default function ToolBar(props) {
  const name = props.name;
  const setName = props.setName;
  const canvas = props.canvas;
  const chatEditing = props.chatEditing;
  const setSharePage = props.setSharePage;
  const [nameEditing, setNameEditing] = useState(false);
  const [canvasColor, setCanvasColor] = useState("#ffffff");

  var ctrlDown = false,
    ctrlKey = 17,
    cmdKeyL = 91,
    cmdKeyR = 93,
    delKey = 8,
    vKey = 86,
    xKey = 88,
    cKey = 67,
    zKey = 90;
  onkeydown = (e) => {
    if (
      e.keyCode === ctrlKey ||
      e.keyCode === cmdKeyL ||
      e.keyCode === cmdKeyR
    ) {
      ctrlDown = true;
    }
    if (ctrlDown && e.keyCode === zKey) {
      e.preventDefault();
      doUndo(canvas);
    }

    if (
      canvas.getActiveObject() &&
      !canvas.getActiveObject().isEditing &&
      !chatEditing &&
      !nameEditing
    ) {
      if (e.keyCode === delKey) {
        deleteChosen(canvas);
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
  //deleteChosen
  const deleteChosen = () => {
    var activeObject = canvas.getActiveObject();
    if (activeObject !== null) {
      canvas.remove(activeObject);
    }
    canvas.discardActiveObject();
    canvas.renderAll();
    updateToCloud(canvas);
  };

  var clipboard = null;
  //cut
  const cut = () => {
    if (canvas.getActiveObject() === null) {
      return;
    }
    canvas.getActiveObject().clone(function (cloned) {
      clipboard = cloned;
      canvas.remove(canvas.getActiveObject());
      updateToCloud(canvas);
      canvas.renderAll();
    });
  };
  //copy
  const copy = () => {
    if (canvas.getActiveObject() === null) {
      return;
    }
    canvas.getActiveObject().clone(function (cloned) {
      clipboard = cloned;
    });
  };
  //paste
  const paste = () => {
    if (!clipboard) {
      return;
    }
    clipboard.clone(function (clonedObj) {
      canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });
      if (clonedObj.type === "activeSelection") {
        clonedObj.canvas = canvas;
        clonedObj.forEachObject(function (obj) {
          canvas.add(obj);
        });
        clonedObj.setCoords();
      } else {
        canvas.add(clonedObj);
      }
      clipboard.top += 10;
      clipboard.left += 10;
      canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();
      updateToCloud(canvas);
    });
  };
  //undo
  function doUndo() {
    canvas.undo();
    updateToCloud(canvas);
  }
  //redo
  function doRedo() {
    canvas.redo();
    updateToCloud(canvas);
  }
  const bringForward = () => {
    if (!canvas.getActiveObject()) {
      return;
    } else {
      canvas.getActiveObject().bringForward();
      canvas.fire("object:modified");
    }
  };

  const sendBackwards = () => {
    if (!canvas.getActiveObject()) {
      return;
    } else {
      canvas.getActiveObject().sendBackwards();
      canvas.fire("object:modified");
    }
  };

  //canvascolor
  const changeCanvasColor = (e) => {
    canvas.backgroundColor = e.target.value;
    setCanvasColor(e.target.value);
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  const renameBoard = () => {
    setNameEditing(false);
    const canvasId = window.location.pathname.split("/")[2];
    firebaseApp.canvasesUpdate(canvasId, {
      name: name,
    });
  };
  return (
    <>
      <div id="toolBarBox">
        <div id="toolBarName">
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onBlur={renameBoard}
            onFocus={() => setNameEditing(true)}
          />
        </div>
        <div>
          <div className="toolBarIconBox blue">
            <Undo onClick={doUndo} className="toolBarIcon" />
          </div>
          <div className="toolBarIconBox blue">
            <Redo onClick={doRedo} className="toolBarIcon" />
          </div>
        </div>
        <div>
          <div className="toolBarIconBox orange">
            <Cut onClick={cut} className="toolBarIcon" />
          </div>
          <div className="toolBarIconBox orange">
            <Copy onClick={copy} className="toolBarIcon" />
          </div>
          <div className="toolBarIconBox orange">
            <Paste onClick={paste} className="toolBarIcon" />
          </div>
        </div>
        <div className="toolBarIconBox red">
          <Eraser onClick={deleteChosen} className="toolBarIcon" />
        </div>
        <div>
          <div className="toolBarIconBox green">
            <LayerUp onClick={bringForward} className="toolBarIcon" />
          </div>
          <div className="toolBarIconBox green">
            <LayerDown onClick={sendBackwards} className="toolBarIcon" />
          </div>
        </div>
        <div
          id="shareBox"
          onClick={() => {
            setSharePage(true);
          }}
        >
          share
        </div>
      </div>
      <div id="boardColor">
        <label>board&#39;s color：</label>
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
