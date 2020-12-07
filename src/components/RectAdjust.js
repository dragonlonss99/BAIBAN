import React, { useState } from "react";
// import { fabric } from "fabric";
export default function RectAdjust(props) {
  const canvas = props.canvas;
  const strokeColor = props.strokeColor;
  const fillColor = props.fillColor;
  const strokeWidthInput = props.strokeWidthInput;
  const setStrokeColor = (v) => {
    canvas.trigger("object:modified");
    props.setStrokeColor(v);
  };
  const setFillColor = (v) => {
    props.setFillColor(v);
  };
  const setStrokeWidthInput = (v) => {
    props.setStrokeWidthInput(v);
  };

  //changeStrokeColor
  const changeStrokeColor = (e) => {
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("stroke", e.target.value);
    }
    setStrokeColor(e.target.value);
    canvas.renderAll();
  };

  //changeFillColor
  const changeFillColor = (e) => {
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("fill", e.target.value);
    }
    setFillColor(e.target.value);
    canvas.renderAll();
  };

  //changeStrokeWidth

  const changeStrokeWidth = (e) => {
    // console.log(e.target.value);
    let strokeWidthValue = document.querySelector("#strokeWidthValue");
    const newWidthOfS = parseInt(e.target.value, 10) || 1;
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("strokeWidth", newWidthOfS);
    }
    strokeWidthValue.innerHTML = newWidthOfS;
    setStrokeWidthInput(e.target.value);
    canvas.renderAll();
  };
  return (
    <div>
      <div>
        <label>邊框粗度：</label>
        <input
          onChange={changeStrokeWidth}
          type="range"
          min="1"
          max="20"
          id="lineWidthInput"
          value={strokeWidthInput}
        />
        <span id="strokeWidthValue">2</span>
      </div>
      <div>
        <label>邊框顏色：</label>
        <input
          onChange={changeStrokeColor}
          type="color"
          id="lineColorInput"
          value={strokeColor}
        />
      </div>
      <div>
        <label>填滿顏色：</label>
        <input
          onChange={changeFillColor}
          type="color"
          id="lineColorInput"
          value={fillColor}
        />
      </div>
    </div>
  );
}
