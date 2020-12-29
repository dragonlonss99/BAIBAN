/* eslint-disable react/prop-types */
import React, { useState } from "react";
import fillColorImg from "../Img/addshapes/adjust/fillcolor.svg";
import strokeColorImg from "../Img/addshapes/adjust/strokeColor.svg";
import width from "../Img/addshapes/adjust/width.svg";
import { ReactComponent as StrokeColorImg } from "../Img/addshapes/adjust/strokeColor.svg";

// import { fabric } from "fabric";
export default function RectAdjust(props) {
  const canvas = props.canvas;
  const strokeColor = props.strokeColor;
  const fillColor = props.fillColor;
  const strokeWidthInput = props.strokeWidthInput;
  const opacityInput = props.opacityInput;
  const setStrokeColor = (v) => {
    canvas.fire("object:modified");
    props.setStrokeColor(v);
  };
  const setFillColor = (v) => {
    props.setFillColor(v);
    canvas.fire("object:modified");
  };
  const setStrokeWidthInput = (v) => {
    props.setStrokeWidthInput(v);
    canvas.fire("object:modified");
  };
  const setOpacityInput = (v) => {
    props.setOpacityInput(v);
    canvas.fire("object:modified");
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
    // let strokeWidthValue = document.querySelector("#strokeWidthValue");
    const newWidthOfS = parseInt(e.target.value, 10);
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("strokeWidth", newWidthOfS);
    }
    // strokeWidthValue.innerHTML = newWidthOfS;
    setStrokeWidthInput(e.target.value);
    canvas.renderAll();
  };
  // //changeOpacityInput
  // const changeOpacityInput = (e) => {
  //   const newWidthOfS = parseInt(e.target.value, 10) / 100;
  //   if (canvas.getActiveObject()) {
  //     canvas.getActiveObject().set("opacity", newWidthOfS);
  //   }
  //   // strokeWidthValue.innerHTML = newWidthOfS;
  //   setOpacityInput(e.target.value);
  //   canvas.renderAll();
  // };
  return (
    <div>
      <div className="colorChange">
        <div>fill color: </div>
        {/* <img src={fillColorImg} style={{ width: 30 }} /> */}
        <input
          onChange={changeFillColor}
          type="color"
          id="lineColorInput"
          value={fillColor}
        />
      </div>
      <div className="colorChange">
        <div>
          stroke color:
          {/* <img src={strokeColorImg} style={{ width: 30 }} /> */}
          {/* <StrokeColorImg style={{ width: 30, fill: "#0E79B2" }} /> */}
        </div>
        <input
          onChange={changeStrokeColor}
          type="color"
          id="lineColorInput"
          value={strokeColor}
        />
      </div>
      <div className="widthChange">
        <label>stroke width: </label>
        <img src={width} />
        <input
          onChange={changeStrokeWidth}
          type="range"
          min="0"
          max="20"
          id="lineWidthInput"
          value={strokeWidthInput}
        />
      </div>
      {/* <div className="widthChange">
        <label>object opacity: </label>
        <img src={width} />
        <input
          onChange={changeOpacityInput}
          type="range"
          min="0"
          max="100"
          id="lineWidthInput"
          value={opacityInput}
        />
      </div> */}
    </div>
  );
}
