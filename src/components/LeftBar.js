/* eslint-disable react/prop-types */
import React, { useState } from "react";
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
  const name = props.name;
  const [show, setShow] = useState("");
  const [boxType, setBoxType] = useState(0);
  const history = useHistory();
  const closeContent = () => {
    document.querySelector("#toolcontent").style.marginLeft = "-240px";
    canvas.isDrawingMode = false;
  };

  const showAddShapes = () => {
    canvas.isDrawingMode = false;
    if (
      boxType === 1 &&
      document.querySelector("#toolcontent").style.marginLeft === "0px"
    ) {
      document.querySelector("#toolcontent").style.marginLeft = "-240px";
    } else {
      document.querySelector("#toolcontent").style.marginLeft = "0px";
    }
    setShow(<AddShapes canvas={canvas} />);
    setBoxType(1);
    canvas.clearHistory();
  };

  const showDraw = () => {
    if (
      boxType === 2 &&
      document.querySelector("#toolcontent").style.marginLeft === "0px"
    ) {
      canvas.isDrawingMode = false;
      document.querySelector("#toolcontent").style.marginLeft = "-240px";
    } else {
      document.querySelector("#toolcontent").style.marginLeft = "0px";
      freeDwawing(canvas);
    }
    setShow(<PaintingTool canvas={canvas} closeContent={closeContent} />);
    setBoxType(2);
  };

  const showTextbox = () => {
    canvas.isDrawingMode = false;

    if (
      boxType === 3 &&
      document.querySelector("#toolcontent").style.marginLeft === "0px"
    ) {
      document.querySelector("#toolcontent").style.marginLeft = "-240px";
    } else {
      document.querySelector("#toolcontent").style.marginLeft = "0px";
    }

    setShow(<TextAdjust canvas={canvas} />);
    setBoxType(3);
  };

  const showSave = () => {
    canvas.isDrawingMode = false;

    if (
      boxType === 4 &&
      document.querySelector("#toolcontent").style.marginLeft === "0px"
    ) {
      document.querySelector("#toolcontent").style.marginLeft = "-240px";
    } else {
      document.querySelector("#toolcontent").style.marginLeft = "0px";
    }
    setShow(<SaveAndLoad canvas={canvas} name={name} />);

    setBoxType(4);
  };
  //freeDrawing
  const freeDwawing = (canvas) => {
    canvas.isDrawingMode = true;
  };

  //showChatRoom
  const showChatRoom = () => {
    document.querySelector("#mainChat").scrollTop = document.querySelector(
      "#mainChat"
    ).scrollHeight;
    if (document.querySelector(".chatRoom").style.marginRight === "0px") {
      document.querySelector(".chatRoom").style.marginRight = "-402px";
    } else {
      document.querySelector(".chatRoom").style.marginRight = "0px";
    }
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
        {/* <img src={note} className="toolIcon" /> */}
        {/* <img src={saveALoad} className="toolIcon" onClick={showSave} /> */}
        <ChatRoom
          style={{ fill: "white" }}
          className="toolIcon"
          onClick={showChatRoom}
        />
      </div>
      <div id="toolcontent" style={{ paddingLeft: -240 }}>
        <div id="cancelBox">
          <Cancel onClick={closeContent} id="cancel" className="bigger" />
        </div>
        {show}
      </div>
    </div>
  );
}
