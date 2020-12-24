import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import pencil from "../Img/back/pencil02.svg";
import { ReactComponent as Pencil } from "../Img/back/pencil02.svg";
import eraser from "../Img/back/eraser02.svg";
import { ReactComponent as Eraser } from "../Img/back/eraser02.svg";
import { ReactComponent as Artist } from "../Img/back/undraw_artist.svg";
import { ReactComponent as ColorP } from "../Img/back/color-palette.svg";
import { SketchPicker } from "react-color";

export default function Try_It() {
  const [canvas, setCanvas] = useState("");
  const [fillColor, setFillColor] = useState("#d4864d");
  const [colorPlate, setColorPlate] = useState("");
  useEffect(() => {
    let canvasToSet = new fabric.Canvas("can", {
      height: 350,
      width: window.innerWidth * 0.5,
      backgroundColor: "#ffffff",
      selection: false,
      isDrawingMode: false,
    });
    fabric.Object.prototype.set({
      cornerColor: "white",
      conerSize: 20,
      cornerStrokeColor: "gray",
      borderColor: "gray",
      transparentCorners: false,
      cornerStyle: "circle",
      padding: 10,
    });
    setCanvas(canvasToSet);
  }, []);

  var delKey = 8;
  onkeydown = (e) => {
    if (e.keyCode === delKey) {
      if (canvas.getActiveObject() && !canvas.getActiveObject().isEditing) {
        deleteChosen(canvas);
      }
    }
  };
  const freeDwawing = () => {
    let pencil = document.querySelector("#tryItPencil");
    if (canvas.isDrawingMode) {
      canvas.isDrawingMode = false;
      pencil.className = "tryIcon bigger";
    } else {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = fillColor;
      pencil.className = "tryIcon bigger drawClicked";
    }
  };
  const closeDraw = () => {
    let pencil = document.querySelector("#tryItPencil");
    if (canvas.isDrawingMode) {
      canvas.isDrawingMode = false;
      pencil.className = "tryIcon bigger";
    }
  };
  const addRect = () => {
    const rect = new fabric.Rect({
      height: 100,
      width: 100,
      top: 50,
      left: 50,
      fill: fillColor,
    });
    canvas.add(rect);
    canvas.renderAll();
    closeDraw();
  };
  const addCircle = () => {
    const circle = new fabric.Circle({
      radius: 50,
      top: 50,
      left: 50,
      fill: fillColor,
    });
    canvas.add(circle);
    canvas.renderAll();
    closeDraw();
  };
  const deleteChosen = () => {
    var activeObject = canvas.getActiveObject();
    if (activeObject !== null) {
      canvas.remove(activeObject);
    }
    canvas.discardActiveObject();
    canvas.renderAll();
    closeDraw();
  };

  const changeFillColor = (e) => {
    if (canvas.getActiveObject()) {
      if (canvas.getActiveObject().type === "path") {
        canvas.getActiveObject().set("stroke", e.target.value);
      } else {
        canvas.getActiveObject().set("fill", e.target.value);
      }
    } else if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = e.target.value;
    }
    setFillColor(e.target.value);
    canvas.renderAll();
  };

  // const handleFillColor = (color, e) => {
  //   if (canvas.getActiveObject()) {
  //     if (canvas.getActiveObject().type === "path") {
  //       canvas.getActiveObject().set("stroke", color.hex);
  //     } else {
  //       canvas.getActiveObject().set("fill", color.hex);
  //     }
  //   } else if (canvas.isDrawingMode) {
  //     canvas.freeDrawingBrush.color = color.hex;
  //   }
  //   setFillColor(color.hex);
  //   canvas.renderAll();
  //   // setColorPlate("");
  // };

  // const showPicker = () => {
  //   if (colorPlate === "") {
  //     setColorPlate(
  //       <SketchPicker
  //         onChangeComplete={handleFillColor}
  //         color={fillColor}
  //         disableAlpha="true"
  //       />
  //     );
  //   } else {
  //     setColorPlate("");
  //   }
  // };
  return (
    <div id="tryBox">
      <div id="tool">
        {/* <div className="tryIcon bigger">
          <ColorP fill={fillColor} onClick={showPicker} />
          {colorPlate}

        </div> */}

        <div id="color">
          color
          <input
            type="color"
            value={fillColor}
            onChange={changeFillColor}
            id="tryColorInput"
            className="bigger"
          />
        </div>
        <div onClick={freeDwawing} className="tryIcon bigger" id="tryItPencil">
          <Pencil fill={fillColor} />
          {/* <img src={pencil} /> */}
        </div>
        <div onClick={addRect} className="tryIcon center bigger">
          <div id="rect" style={{ backgroundColor: fillColor }} />
          {/* <img /> */}
        </div>
        <div onClick={addCircle} className="tryIcon center bigger">
          <div id="circle" style={{ backgroundColor: fillColor }} />
          {/* <img /> */}
        </div>
        <div onClick={deleteChosen} className="tryIcon bigger">
          {/* <img src={eraser} /> */}
          <Eraser fill={fillColor} />
        </div>
      </div>
      <canvas id="can" />
      <div id="artistBox">
        <Artist id="artist" />
        {/* <img /> */}
      </div>
    </div>
  );
}
