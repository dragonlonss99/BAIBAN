/* eslint-disable react/prop-types */
import { useState } from "react";
import AddShapes from "./AddShapes";
import TextAdjust from "./TextAdjust";
import PaintingTool from "./PaintingTool";
import SaveAndLoad from "./SaveAndLoad";
import textBox from "../Img/addshapes/LogoMakr-26YKdq.png";
import shapes from "../Img/addshapes/LogoMakr-0Owo5C.png";
import draw from "../Img/addshapes/LogoMakr-5qV0c5.png";
import saveALoad from "../Img/addshapes/LogoMakr-0iXbe0.png";
import note from "../Img/addshapes/LogoMakr-65RyOq.png";
import { BrowserRouter as Router, Link, useHistory } from "react-router-dom";
import { ReactComponent as ChatRoom } from "../Img/chat-bubbles.svg";
import home from "../Img/addshapes/LogoMakr-6u56yP.png";
import "./AddShapes.scss";
import { ReactComponent as Cancel } from "../Img/back/cancel.svg";
export default function LeftBar(props) {
  const canvas = props.canvas;
  const showChatRoom = props.showChatRoom;
  const name = props.name;
  const [show, setShow] = useState("");
  const [boxType, setBoxType] = useState(0);
  const [toolcontentShow, setToolcontentShow] = useState(false);
  const history = useHistory();

  const closeContent = () => {
    setToolcontentShow(false);
    canvas.isDrawingMode = false;
  };

  const showAddShapes = () => {
    canvas.isDrawingMode = false;
    if (boxType === 1 && toolcontentShow) {
      setToolcontentShow(false);
    } else {
      setToolcontentShow(true);
    }
    setShow(<AddShapes canvas={canvas} />);
    setBoxType(1);
    canvas.clearHistory();
  };

  const showDraw = () => {
    if (boxType === 2 && toolcontentShow) {
      canvas.isDrawingMode = false;
      setToolcontentShow(false);
    } else {
      setToolcontentShow(true);
      freeDwawing(canvas);
    }
    setShow(<PaintingTool canvas={canvas} closeContent={closeContent} />);
    setBoxType(2);
  };

  const showTextbox = () => {
    canvas.isDrawingMode = false;

    if (boxType === 3 && toolcontentShow) {
      setToolcontentShow(false);
    } else {
      setToolcontentShow(true);
    }

    setShow(<TextAdjust canvas={canvas} />);
    setBoxType(3);
  };

  const showSave = () => {
    canvas.isDrawingMode = false;

    if (boxType === 4 && toolcontentShow) {
      setToolcontentShow(false);
    } else {
      setToolcontentShow(true);
    }
    setShow(<SaveAndLoad canvas={canvas} name={name} />);

    setBoxType(4);
  };
  //freeDrawing
  const freeDwawing = (canvas) => {
    canvas.isDrawingMode = true;
  };

  return (
    <div id="leftside">
      <div id="shapeBar" style={{ backgroundColor: "#555555" }}>
        <img
          src={home}
          className="toolIcon"
          onClick={() => {
            history.push("/");
          }}
        />
        <img src={shapes} className="toolIcon" onClick={showAddShapes} />
        <img src={draw} className="toolIcon" onClick={showDraw} />
        <img src={textBox} className="toolIcon" onClick={showTextbox} />
        <ChatRoom
          style={{ fill: "white" }}
          className="toolIcon"
          onClick={showChatRoom}
        />
      </div>
      <div
        id="toolcontent"
        style={{
          paddingLeft: -240,
          marginLeft: toolcontentShow ? "0px" : "-240px",
        }}
      >
        <div id="cancelBox">
          <Cancel onClick={closeContent} id="cancel" className="bigger" />
        </div>
        {show}
      </div>
    </div>
  );
}
