import React, { useState, useEffect } from "react";

export default function BottomBar(props) {
  const changeFontSize = (e) => {
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type === "textbox") {
      canvas.getActiveObject().set("fontSize", e.target.value);
    }
    setFontSizeInput(e.target.value);
    canvas.renderAll();

    canvas.fire("object:modified");
  };
  const changeTextColor = (e) => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      canvas.getActiveObject().set("fill", e.target.value);
      setTextColor(e.target.value);
      canvas.renderAll();
      canvas.fire("object:modified");
    }
  };
  const changeTextBackColor = (e) => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      canvas.getActiveObject().set("textBackgroundColor", e.target.value);
      setTextBackColor(e.target.value);
      canvas.renderAll();
      canvas.fire("object:modified");
    }
  };
  const [rowHeightInput, setRowHeightInput] = useState("1");
  const changeRowHeight = (e) => {
    const newRowHeight = parseInt(e.target.value, 10) / 10;
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      canvas.getActiveObject().set("lineHeight", newRowHeight);
    }
    setRowHeightInput(e.target.value);
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const [letterSpacingInput, setLetterSpacingInput] = useState("1");
  const changeLetterSpacing = (e) => {
    const newletterSpacing = parseInt(e.target.value, 10) * 10;
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      canvas.getActiveObject().set("charSpacing", newletterSpacing);
    }
    setLetterSpacingInput(e.target.value);
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const underLine = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      if (canvas.getActiveObject().underline) {
        canvas.getActiveObject().set("underline", false);
      } else {
        canvas.getActiveObject().set("underline", true);
      }
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const deleteLine = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      if (canvas.getActiveObject().linethrough) {
        canvas.getActiveObject().set("linethrough", false);
      } else {
        canvas.getActiveObject().set("linethrough", true);
      }
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const italic = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      if (canvas.getActiveObject().fontStyle !== "italic") {
        canvas.getActiveObject().set("fontStyle", "italic");
      } else {
        canvas.getActiveObject().set("fontStyle", "normal");
      }
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const toLeft = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      if (canvas.getActiveObject().textAlign !== "left") {
        canvas.getActiveObject().set("textAlign", "left");
      }
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const toMiddle = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      if (canvas.getActiveObject().textAlign !== "center") {
        canvas.getActiveObject().set("textAlign", "center");
      }
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const toRight = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      if (canvas.getActiveObject().textAlign !== "right") {
        canvas.getActiveObject().set("textAlign", "right");
      }
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const setSuper = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      canvas.getActiveObject().setSuperscript();
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const setSub = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      canvas.getActiveObject().setSubscript();
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };
  const removeScript = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      canvas.getActiveObject().setSelectionStyles({
        fontSize: undefined,
        deltaY: undefined,
      });
      canvas.renderAll();
      canvas.fire("object:modified");
    }
  };
  const setBold = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().type === "textbox"
    ) {
      if (canvas.getActiveObject().fontWeight !== "bold") {
        canvas.getActiveObject().set("fontWeight", "bold");
      } else {
        canvas.getActiveObject().set("fontWeight", "normal");
      }
    }
    canvas.renderAll();
    canvas.fire("object:modified");
  };

  return <div></div>;
}
