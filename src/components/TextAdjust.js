/* eslint-disable react/prop-types */
import { useState } from "react";
import { fabric } from "fabric";
import width from "../Img/addshapes/adjust/width.svg";
import boldStyle from "../Img/addshapes/adjust/handmade/bold-02.svg";
import italicStyle from "../Img/addshapes/adjust/handmade/italic-03.svg";
import underLineStyle from "../Img/addshapes/adjust/handmade/underLine-04.svg";
import deleteLineStyle from "../Img/addshapes/adjust/handmade/deleteLine-05.svg";
import superStyle from "../Img/addshapes/adjust/handmade/super-06.svg";
import subStyle from "../Img/addshapes/adjust/handmade/sub-07.svg";
import normalStyle from "../Img/addshapes/adjust/handmade/normal-08.svg";
import alignLeftStyle from "../Img/addshapes/adjust/align-left.svg";
import alignCenterStyle from "../Img/addshapes/adjust/align-center.svg";
import alignRightStyle from "../Img/addshapes/adjust/align-right.svg";
import { updateToCloud } from "../App.js";
import * as firebaseApp from "../utils/firebaseUtils";

export default function TextAdjust(props) {
  const canvas = props.canvas;
  const [fontSizeInput, setFontSizeInput] = useState("16");
  const [textColor, setTextColor] = useState("#000000");
  const [textBackColor, setTextBackColor] = useState("#ffffff");
  const addTextbox = () => {
    const Textbox = new fabric.Textbox("please fill in", {
      top: 50,
      left: 50,
      // strokeWidth: parseFloat(strokeWidthInput),
      // stroke: strokeColor,
      // fill: fillColor,
      width: 200,
      fontSize: 25,
      // fontWeight: 200,
      editingBorderColor: "blue",
    });
    canvas.add(Textbox);
    canvas.renderAll();
    updateToCloud(canvas);
  };
  const changeFontSize = (e) => {
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type === "textbox") {
      canvas.getActiveObject().set("fontSize", e.target.value);
    }
    setFontSizeInput(e.target.value);
    canvas.renderAll();

    canvas.fire("object:modified");
  };
  const changeTextColor = (e) => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      canvas.getActiveObject().set("fill", e.target.value);
      setTextColor(e.target.value);
      canvas.renderAll();
      canvas.fire("object:modified");
    }
  };
  const changeTextBackColor = (e) => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      canvas.getActiveObject().set("textBackgroundColor", e.target.value);
      setTextBackColor(e.target.value);
      canvas.renderAll();
      canvas.fire("object:modified");
    }
  };
  const [rowHeightInput, setRowHeightInput] = useState("1");
  const changeRowHeight = (e) => {
    const newRowHeight = parseInt(e.target.value, 10) / 10;
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      canvas.getActiveObject().set("lineHeight", newRowHeight);
    }
    setRowHeightInput(e.target.value);
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const [letterSpacingInput, setLetterSpacingInput] = useState("1");
  const changeLetterSpacing = (e) => {
    const newletterSpacing = parseInt(e.target.value, 10) * 10;
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      canvas.getActiveObject().set("charSpacing", newletterSpacing);
    }
    setLetterSpacingInput(e.target.value);
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const underLine = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      if (canvas.getActiveObject().underline) {
        canvas.getActiveObject().set("underline", false);
      } else {
        canvas.getActiveObject().set("underline", true);
      }
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const deleteLine = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      if (canvas.getActiveObject().linethrough) {
        canvas.getActiveObject().set("linethrough", false);
      } else {
        canvas.getActiveObject().set("linethrough", true);
      }
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const italic = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      if (canvas.getActiveObject().fontStyle !== "italic") {
        canvas.getActiveObject().set("fontStyle", "italic");
      } else {
        canvas.getActiveObject().set("fontStyle", "normal");
      }
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const toLeft = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      if (canvas.getActiveObject().textAlign !== "left") {
        canvas.getActiveObject().set("textAlign", "left");
      }
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const toMiddle = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      if (canvas.getActiveObject().textAlign !== "center") {
        canvas.getActiveObject().set("textAlign", "center");
      }
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const toRight = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      if (canvas.getActiveObject().textAlign !== "right") {
        canvas.getActiveObject().set("textAlign", "right");
      }
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const setSuper = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      canvas.getActiveObject().setSuperscript();
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const setSub = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      canvas.getActiveObject().setSubscript();
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const removeScript = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      canvas.getActiveObject().setSelectionStyles({
        fontSize: undefined,
        deltaY: undefined,
      });
      canvas.renderAll();
      canvas.fire("object:modified");
    }
  };
  const setBold = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      if (canvas.getActiveObject().fontWeight !== "bold") {
        canvas.getActiveObject().set("fontWeight", "bold");
      } else {
        canvas.getActiveObject().set("fontWeight", "normal");
      }
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  return (
    <div id="textAdjustBox">
      <div onClick={addTextbox} className="addTextbox">
        <span> addTextbox</span>
      </div>
      <div className="widthChange">
        <label>font size: </label>
        <img src={width} />
        <input
          onChange={changeFontSize}
          type="range"
          min="1"
          max="150"
          id="fontSizeInput"
          value={fontSizeInput}
        />
      </div>
      <div className="colorChange">
        <div>font color:</div>
        <input
          onChange={changeTextColor}
          type="color"
          id="TextColorInput"
          value={textColor}
        />
      </div>
      <div className="colorChange">
        <div>background color:</div>
        <input
          onChange={changeTextBackColor}
          type="color"
          id="TextBackColorInput"
          value={textBackColor}
        />
      </div>
      <div className="widthChange">
        <label>row height: </label>
        <img src={width} />
        <input
          onChange={changeRowHeight}
          type="range"
          min="10"
          max="50"
          id="rowHeightInput"
          value={rowHeightInput}
        />
      </div>
      <div className="widthChange">
        <label>font spacing: </label>
        <img src={width} />
        <input
          onChange={changeLetterSpacing}
          type="range"
          min="1"
          max="50"
          id="letterSpacingInput"
          value={letterSpacingInput}
        />
      </div>
      <div className="btnBox">
        <div className="no">style:</div>
        <div>
          <img src={boldStyle} onClick={setBold} id="bold" />
        </div>
        <div>
          <img src={italicStyle} onClick={italic} id="italic" />
        </div>
        <div>
          <img src={underLineStyle} onClick={underLine} />
        </div>
        <div>
          <img src={deleteLineStyle} onClick={deleteLine} />
        </div>
      </div>
      <div className="btnBox">
        <div className="no">align:</div>
        <div>
          <img src={alignLeftStyle} onClick={toLeft} />
        </div>
        <div>
          <img src={alignCenterStyle} onClick={toMiddle} />
        </div>
        <div>
          <img src={alignRightStyle} onClick={toRight} />
        </div>
      </div>
      <div className="btnBox">
        <div className="no">mark:</div>
        <div>
          <img src={superStyle} onClick={setSuper} />
        </div>
        <div>
          <img src={subStyle} onClick={setSub} />
        </div>
        <div>
          <img src={normalStyle} onClick={removeScript} />
        </div>
      </div>
    </div>
  );
}
