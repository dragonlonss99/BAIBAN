/* eslint-disable react/prop-types */
/* eslint-disable prefer-const */
import { useState, useEffect } from "react";
import { fabric } from "fabric";
import ellipse from "../../Img/addshapes/LogoMakr-9rD1kw.png";
import circle from "../../Img/addshapes/LogoMakr-00Rh5a.png";
import triangle from "../../Img/addshapes/LogoMakr-4keFSv.png";
import isotri from "../../Img/addshapes/LogoMakr-101qmV.png";
import parra from "../../Img/addshapes/LogoMakr-0mlYb5.png";
import line from "../../Img/addshapes/LogoMakr-7xibzp.png";
import righttriangle from "../../Img/addshapes/LogoMakr-6YA1tz.png";
import square from "../../Img/addshapes/LogoMakr-60BBJ5.png";
import RectAdjust from "./RectAdjust";
import { updateToCloud } from "../../App.js";
import * as firebaseApp from "../../utils/firebaseUtils";

export default function AddShapes(props) {
  let canvas = props.canvas;
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#ffffff");
  const [strokeWidthInput, setStrokeWidthInput] = useState("2");
  const [opacityInput, setOpacityInput] = useState("100");
  //Rect
  const addRect = (canvas) => {
    const rect = new fabric.Rect({
      height: 100,
      width: 100,
      strokeWidth: parseFloat(parseFloat(strokeWidthInput)),
      stroke: strokeColor,
      fill: fillColor,
      owner: "owner",
    });

    // rect.toObject = (function (toObject) {
    //   return function (propertiesToInclude) {
    //     return fabric.util.object.extend(
    //       toObject.call(this, propertiesToInclude),
    //       {
    //         id: count,
    //         author: author, //my custom property
    //         // _controlsVisibility: this._getControlsVisibility(), //i want to get the controllsVisibility
    //       }
    //     );
    //   };
    // })(rect.toObject);
    canvas.add(rect);
    updateToCloud(canvas);
    canvas.renderAll();
  };
  //Circle
  const addCircle = (canvas) => {
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
  };
  //Triangle
  const addTriangle = (canvas) => {
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
  const addLine = (canvas) => {
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
  const addEllipse = (canvas) => {
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
  const addRightTriangle = (canvas) => {
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
  const addIsoscelesTriangle = (canvas) => {
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
  const addParallelogram = (canvas) => {
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

  return (
    <div id="addShapes">
      <div id="imgBox">
        <img
          src={square}
          onClick={() => addRect(canvas)}
          className="shapeIcon"
        />
        <img
          src={circle}
          onClick={() => addCircle(canvas)}
          className="shapeIcon"
        />

        <img
          src={triangle}
          onClick={() => addTriangle(canvas)}
          className="shapeIcon"
        />
        <img
          src={ellipse}
          onClick={() => addEllipse(canvas)}
          className="shapeIcon"
        />
        <img
          src={righttriangle}
          onClick={() => addRightTriangle(canvas)}
          className="shapeIcon"
        />
        <img
          src={isotri}
          onClick={() => addIsoscelesTriangle(canvas)}
          className="shapeIcon"
        />
        <img
          src={parra}
          onClick={() => addParallelogram(canvas)}
          className="shapeIcon"
        />
        <img src={line} onClick={() => addLine(canvas)} className="shapeIcon" />
      </div>
      <RectAdjust
        canvas={canvas}
        strokeColor={strokeColor}
        fillColor={fillColor}
        strokeWidthInput={strokeWidthInput}
        opacityInput={opacityInput}
        setStrokeColor={(v) => {
          setStrokeColor(v);
        }}
        setFillColor={(v) => {
          setFillColor(v);
        }}
        setStrokeWidthInput={(v) => {
          setStrokeWidthInput(v);
        }}
        setOpacityInput={(v) => {
          setOpacityInput(v);
        }}
      />
    </div>
  );
}
