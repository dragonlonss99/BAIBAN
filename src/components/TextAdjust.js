import React, { useState } from "react";
import { fabric } from "fabric";

export default function TextAdjust(props) {
  const canvas = props.canvas;
  const [fontSizeInput, setFontSizeInput] = useState("16");
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
  };
  const changeFontSize = (e) => {
    if (!canvas.getActiveObject()) {
      return;
    }
    const newFontSize = parseInt(e.target.value, 10) || 1;
    if (canvas.getActiveObject().type === "textbox") {
      canvas.getActiveObject().set("fontSize", e.target.value);
    }
    setFontSizeInput(e.target.value);
    document.querySelector("#fontSizeValue").innerHTML = newFontSize;
    canvas.renderAll();
  };
  const changeTextColor = (e) => {
    if (canvas.getActiveObject().type === "textbox") {
      canvas.getActiveObject().set("fill", e.target.value);
      canvas.renderAll();
    }
  };
  const changeTextBackColor = (e) => {
    if (canvas.getActiveObject().type === "textbox") {
      canvas.getActiveObject().set("textBackgroundColor", e.target.value);
      canvas.renderAll();
    }
  };
  const [rowHeightInput, setRowHeightInput] = useState("1");
  const changeRowHeight = (e) => {
    // const newRowHeight = parseInt(e.target.value, 10) || 1;
    if (canvas.getActiveObject().type === "textbox") {
      canvas.getActiveObject().set("lineHeight", e.target.value);
    }
    setRowHeightInput(e.target.value);
    document.querySelector("#rowHeightValue").innerHTML = e.target.value;
    canvas.renderAll();
  };
  const [letterSpacingInput, setLetterSpacingInput] = useState("1");
  const changeLetterSpacing = (e) => {
    const newletterSpacing = parseInt(e.target.value, 10) || 1;
    if (canvas.getActiveObject().type === "textbox") {
      canvas.getActiveObject().set("charSpacing", e.target.value);
    }
    setLetterSpacingInput(e.target.value);
    document.querySelector("#letterSpacingValue").innerHTML = newletterSpacing;
    canvas.renderAll();
  };
  const underLine = () => {
    if (canvas.getActiveObject().type === "textbox") {
      if (canvas.getActiveObject().underline) {
        canvas.getActiveObject().set("underline", false);
      } else {
        canvas.getActiveObject().set("underline", true);
      }
    }
    canvas.renderAll();
  };
  const deleteLine = () => {
    if (canvas.getActiveObject().type === "textbox") {
      if (canvas.getActiveObject().linethrough) {
        canvas.getActiveObject().set("linethrough", false);
      } else {
        canvas.getActiveObject().set("linethrough", true);
      }
    }
    canvas.renderAll();
  };
  const italic = () => {
    if (canvas.getActiveObject().type === "textbox") {
      if (canvas.getActiveObject().fontStyle !== "italic") {
        canvas.getActiveObject().set("fontStyle", "italic");
      } else {
        canvas.getActiveObject().set("fontStyle", "normal");
      }
    }
    canvas.renderAll();
  };
  const toLeft = () => {
    if (canvas.getActiveObject().type === "textbox") {
      if (canvas.getActiveObject().textAlign !== "left") {
        canvas.getActiveObject().set("textAlign", "left");
      }
    }
    canvas.renderAll();
  };
  const toMiddle = () => {
    if (canvas.getActiveObject().type === "textbox") {
      if (canvas.getActiveObject().textAlign !== "center") {
        canvas.getActiveObject().set("textAlign", "center");
      }
    }
    canvas.renderAll();
  };
  const toRight = () => {
    if (canvas.getActiveObject().type === "textbox") {
      if (canvas.getActiveObject().textAlign !== "right") {
        canvas.getActiveObject().set("textAlign", "right");
      }
    }
    canvas.renderAll();
  };
  const setSuper = () => {
    if (canvas.getActiveObject().type === "textbox") {
      canvas.getActiveObject().setSuperscript();
    }
    canvas.renderAll();
  };
  const setSub = () => {
    if (canvas.getActiveObject().type === "textbox") {
      canvas.getActiveObject().setSubscript();
    }
    canvas.renderAll();
  };
  const removeScript = () => {
    if (canvas.getActiveObject().type === "textbox") {
      canvas.getActiveObject().setSelectionStyles({
        fontSize: undefined,
        deltaY: undefined,
      });
      canvas.renderAll();
    }
  };
  const setBold = () => {
    if (canvas.getActiveObject().type === "textbox") {
      if (canvas.getActiveObject().fontWeight !== "bold") {
        canvas.getActiveObject().set("fontWeight", "bold");
      } else {
        canvas.getActiveObject().set("fontWeight", "normal");
      }
    }
    canvas.renderAll();
  };

  return (
    <div>
      <button onClick={addTextbox}>addTextbox</button>
      <div>
        <label>文字大小：</label>
        <input
          onChange={changeFontSize}
          type="range"
          min="1"
          max="150"
          id="fontSizeInput"
          value={fontSizeInput}
        />
        <span id="fontSizeValue">16</span>
      </div>
      <div>
        <label>字型：</label>
        <select>
          <option></option>
        </select>
      </div>

      <div>
        <label>文字顏色：</label>
        <input onChange={changeTextColor} type="color" id="TextColorInput" />
      </div>
      <div>
        <label>文字框背景顏色：</label>
        <input
          onChange={changeTextBackColor}
          type="color"
          id="TextBackColorInput"
        />
      </div>
      <div>
        <label>行高：</label>
        <input
          onChange={changeRowHeight}
          type="range"
          min="0.5"
          max="5"
          id="rowHeightInput"
          value={rowHeightInput}
        />
        <span id="rowHeightValue">1</span>
      </div>
      <div>
        <label>文字間距：</label>
        <input
          onChange={changeLetterSpacing}
          type="range"
          min="1"
          max="10"
          id="letterSpacingInput"
          value={letterSpacingInput}
        />
        <span id="letterSpacingValue">1</span>
      </div>
      <div>
        <button onClick={setBold}>粗體</button>
        <button onClick={underLine}>底線</button>
        <button onClick={deleteLine}>刪除線</button>
        <button onClick={italic}>斜體</button>
        <button onClick={toLeft}>靠左對齊</button>
        <button onClick={toMiddle}>置中對齊</button>
        <button onClick={toRight}>靠右對齊</button>
        <button onClick={setSuper}>上標</button>
        <button onClick={setSub}>下標</button>
        <button onClick={removeScript}>取消上下標</button>
      </div>
    </div>
  );
}
