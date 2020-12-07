import React, { useState } from "react";
import { fabric } from "fabric";

export default function ToolBar(props) {
  const [lineWidthInput, setLineWidthInput] = useState("1");
  const [lineColor, setLineColor] = useState("#000000");

  //   const lineColorInput = $("lineColorInput");
  const canvas = props.canvas;
  function changeLineWidth(e) {
    // console.log(e.target.value);
    const newWidth = parseInt(e.target.value, 10) || 1;
    canvas.freeDrawingBrush.width = newWidth;
    document.querySelector("#lineWidthValue").innerHTML = newWidth;
    setLineWidthInput(e.target.value);
  }

  function changeLineColor(e) {
    canvas.freeDrawingBrush.color = e.target.value;
    setLineColor(e.target.value);
  }

  // spray
  const Spray = () => {
    canvas.freeDrawingBrush = new fabric.SprayBrush(canvas, {
      // width: 70,
      opacity: 0.6,
      // color: "#ff0000",
    });
  };
  //Pencil
  const Pencil = () => {
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  };
  //stopDrawing
  const stopDwawing = (canvas) => {
    canvas.isDrawingMode = false;
    props.closeContent();
    if (canvas.getActiveObject()) {
      console.log(canvas.getActiveObject().type);
    }
    // console.log(canvi.getActiveObject().fontStyle);
  };
  return (
    <div>
      <div>
        <label>畫筆粗度：</label>
        <input
          onChange={changeLineWidth}
          type="range"
          min="1"
          max="50"
          id="lineWidthInput"
          value={lineWidthInput}
        />
        <span id="lineWidthValue">1</span>
      </div>
      <div>
        <label>畫筆顏色：</label>
        <input
          onChange={changeLineColor}
          type="color"
          id="lineColorInput"
          value={lineColor}
        />
      </div>
      <button onClick={Spray}>Spray</button>
      <button onClick={Pencil}>Pencil</button>
      <button onClick={() => stopDwawing(canvas)}>Done drawing</button>
    </div>
  );
}
