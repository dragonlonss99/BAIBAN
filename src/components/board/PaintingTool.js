/* eslint-disable react/prop-types */
import { useState } from "react";
import { fabric } from "fabric";
import width from "../../Img/addshapes/adjust/width.svg";
import pencil from "../../Img/addshapes/adjust/pencil.svg";
import pen from "../../Img/addshapes/adjust/pen.svg";
import highlighter from "../../Img/addshapes/adjust/highlighter.svg";
export default function ToolBar(props) {
  const [lineWidthInput, setLineWidthInput] = useState("1");
  const [lineColor, setLineColor] = useState("#000000");

  const canvas = props.canvas;
  function changeLineWidth(e) {
    const newWidth = parseInt(e.target.value, 10) || 1;
    canvas.freeDrawingBrush.width = newWidth;
    setLineWidthInput(e.target.value);
  }

  function changeLineColor(e) {
    canvas.freeDrawingBrush.color = e.target.value;
    setLineColor(e.target.value);
  }

  //Pencil
  const Pencil = () => {
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = lineColor;
  };
  //Pen
  const Pen = () => {
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = lineColor;
    canvas.freeDrawingBrush.width = 6;
  };
  //Highlighter
  const Highlighter = () => {
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = lineColor;
    canvas.freeDrawingBrush.width = 30;
  };
  return (
    <div>
      <div className="paintWayBox">
        <div onClick={Pencil}>
          <img src={pencil} style={{ width: 30 }} />
        </div>
        <div onClick={Pen}>
          <img src={pen} style={{ width: 30 }} />
        </div>
        <div onClick={Highlighter}>
          <img src={highlighter} style={{ width: 30 }} />
        </div>
      </div>
      <div className="widthChange">
        <label>pen width: </label>
        <img src={width} />
        <input
          onChange={changeLineWidth}
          type="range"
          min="1"
          max="50"
          id="lineWidthInput"
          value={lineWidthInput}
        />
      </div>
      <div className="colorChange">
        <div>pen color:</div>
        <input
          onChange={changeLineColor}
          type="color"
          id="lineColorInput"
          value={lineColor}
        />
      </div>
    </div>
  );
}
