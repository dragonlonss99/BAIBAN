/* eslint-disable react/prop-types */
import width from "../Img/addshapes/adjust/width.svg";

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
    const newWidthOfS = parseInt(e.target.value, 10);
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("strokeWidth", newWidthOfS);
    }
    setStrokeWidthInput(e.target.value);
    canvas.renderAll();
  };

  return (
    <div>
      <div className="colorChange">
        <div>fill color: </div>
        <input
          onChange={changeFillColor}
          type="color"
          id="lineColorInput"
          value={fillColor}
        />
      </div>
      <div className="colorChange">
        <div>stroke color:</div>
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
    </div>
  );
}
