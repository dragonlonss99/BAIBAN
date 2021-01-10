/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

export default function AddPattern(props) {
  const canvas = props.canvas;
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#ffffff");
  const [strokeWidthInput, setStrokeWidthInput] = useState("2");
  const [opacityInput, setOpacityInput] = useState("100");

  const addRect = () => {
    const rect = new fabric.Rect({
      height: 100,
      width: 100,
      strokeWidth: parseFloat(parseFloat(strokeWidthInput)),
      stroke: strokeColor,
      fill: fillColor,
      owner: "owner",
    });
    canvas.add(rect);
    updateToCloud(canvas);
    canvas.renderAll();
  };
  //Circle
  const addCircle = () => {
    const circle = new fabric.Circle({
      radius: 50,
      top: 50,
      left: 50,
      strokeWidth: parseFloat(strokeWidthInput),
      stroke: strokeColor,
      fill: fillColor,
    });
    canvas.add(circle);
    updateToCloud(canvas);
    canvas.renderAll();
    console.log(circle);
  };
  //Triangle
  const addTriangle = () => {
    const Triangle = new fabric.Triangle({
      top: 50,
      left: 50,
      strokeWidth: parseFloat(strokeWidthInput),
      stroke: strokeColor,
      fill: fillColor,
      width: 100,
      height: 100,
    });
    canvas.add(Triangle);
    canvas.renderAll();
    updateToCloud(canvas);
  };
  //Line
  const addLine = () => {
    const Line = new fabric.Line([50, 100, 200, 200], {
      top: 50,
      left: 50,
      strokeWidth: parseFloat(strokeWidthInput),
      stroke: strokeColor,
    });
    canvas.add(Line);
    canvas.renderAll();
    updateToCloud(canvas);
  };
  //Ellipse
  const addEllipse = () => {
    const Ellipse = new fabric.Ellipse({
      top: 60,
      left: 60,
      strokeWidth: parseFloat(strokeWidthInput),
      stroke: strokeColor,
      fill: fillColor,
      radius: 30,
      rx: 60,
      ry: 40,
    });
    canvas.add(Ellipse);
    canvas.renderAll();
    updateToCloud(canvas);
  };
  //RightTriangle
  const addRightTriangle = () => {
    const RightTriangle = new fabric.Polygon(
      [
        { x: 50, y: 0 },
        { x: 50, y: 100 },
        { x: 100, y: 100 },
      ],
      {
        top: 100,
        left: 100,
        strokeWidth: parseFloat(strokeWidthInput),
        stroke: strokeColor,
        fill: fillColor,
      }
    );
    canvas.add(RightTriangle);
    canvas.renderAll();
    updateToCloud(canvas);
  };
  //IsoscelesTriangle
  const addIsoscelesTriangle = () => {
    const IsoscelesTriangle = new fabric.Polygon(
      [
        { x: 100, y: 0 },
        { x: 200, y: 100 },
        { x: 0, y: 100 },
      ],
      {
        top: 100,
        left: 100,
        strokeWidth: parseFloat(strokeWidthInput),
        stroke: strokeColor,
        fill: fillColor,
      }
    );
    canvas.add(IsoscelesTriangle);
    canvas.renderAll();
    updateToCloud(canvas);
  };
  //Parallelogram
  const addParallelogram = () => {
    const Parallelogram = new fabric.Polygon(
      [
        { x: 50, y: 0 },
        { x: 80, y: 100 },
        { x: 150, y: 100 },
        { x: 120, y: 0 },
      ],
      {
        top: 100,
        left: 100,
        strokeWidth: parseFloat(strokeWidthInput),
        stroke: strokeColor,
        fill: fillColor,
      }
    );
    canvas.add(Parallelogram);
    canvas.renderAll();
    updateToCloud(canvas);
  };

  const addTextbox = () => {
    const Textbox = new fabric.Textbox("please fill in", {
      top: 50,
      left: 50,
      width: 200,
      fontSize: 25,
      editingBorderColor: "blue",
    });
    canvas.add(Textbox);
    canvas.renderAll();
    updateToCloud(canvas);
  };

  return (
    <div>
      <div onClick={addRect} className="bigger">
        <div id="rect_mobile" style={{ backgroundColor: fillColor }} />
      </div>
      <div onClick={addCircle} className="bigger">
        <div id="circle_mobile" style={{ backgroundColor: fillColor }} />
      </div>
      <div onClick={addTriangle} className="bigger">
        <div id="triangle_mobile" style={{ backgroundColor: fillColor }} />
      </div>
      <div onClick={addLine} className="bigger">
        <div id="line_mobile" style={{ backgroundColor: fillColor }} />
      </div>
      <div onClick={addEllipse} className="bigger">
        <div id="ellipse_mobile" style={{ backgroundColor: fillColor }} />
      </div>
      <div onClick={addRightTriangle} className="bigger">
        <div id="triangle_mobile" style={{ backgroundColor: fillColor }} />
      </div>
      <div onClick={addIsoscelesTriangle} className="bigger">
        <div
          id="isosclesTriangle_mobile"
          style={{ backgroundColor: fillColor }}
        />
      </div>
      <div onClick={addParallelogram} className="bigger">
        <div id="parallelogram_mobile" style={{ backgroundColor: fillColor }} />
      </div>
      <div onClick={addTextbox} className="bigger">
        <div id="textbox_mobile" style={{ backgroundColor: fillColor }} />
      </div>
    </div>
  );
}
