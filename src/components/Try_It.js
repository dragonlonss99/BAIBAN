import { useState, useEffect } from "react";
import { fabric } from "fabric";
import { ReactComponent as Pencil } from "../Img/back/pencil02.svg";
import { ReactComponent as Eraser } from "../Img/back/eraser02.svg";
import { ReactComponent as Artist } from "../Img/back/undraw_artist.svg";
import { SketchPicker } from "react-color";

export default function Try_It() {
  const [canvas, setCanvas] = useState("");
  const [drawingMode, setDrawingMode] = useState(false);
  const [fillColor, setFillColor] = useState("#d4864d");
  useEffect(() => {
    const canvasToSet = new fabric.Canvas("can", {
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
  const delKey = 8;
  onkeydown = (e) => {
    if (window.location.pathname === "/") {
      if (e.keyCode === delKey) {
        if (canvas.getActiveObject() && !canvas.getActiveObject().isEditing) {
          deleteChosen(canvas);
        }
      }
    }
  };
  const freeDwawing = () => {
    canvas.isDrawingMode ? closeDraw() : startDraw();
  };
  const closeDraw = () => {
    canvas.isDrawingMode = false;
    setDrawingMode(false);
  };
  const startDraw = () => {
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = fillColor;
    setDrawingMode(true);
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
    canvas.isDrawingMode && closeDraw();
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
    canvas.isDrawingMode && closeDraw();
  };
  const deleteChosen = () => {
    var activeObject = canvas.getActiveObject();
    activeObject && canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.renderAll();
    canvas.isDrawingMode && closeDraw();
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

  return (
    <div id="tryBox">
      <div id="tool">
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
        <div
          onClick={freeDwawing}
          className={
            drawingMode ? "tryIcon bigger drawClicked" : "tryIcon bigger"
          }
          id="tryItPencil"
        >
          <Pencil fill={fillColor} />
        </div>
        <div onClick={addRect} className="tryIcon center bigger">
          <div id="rect" style={{ backgroundColor: fillColor }} />
        </div>
        <div onClick={addCircle} className="tryIcon center bigger">
          <div id="circle" style={{ backgroundColor: fillColor }} />
        </div>
        <div onClick={deleteChosen} className="tryIcon bigger">
          <Eraser fill={fillColor} />
        </div>
      </div>
      <canvas id="can" />
      <div id="artistBox">
        <Artist id="artist" />
      </div>
    </div>
  );
}
