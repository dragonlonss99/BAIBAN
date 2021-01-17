import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import "./App.scss";
import ToolBar from "./components/ToolBar";
import LeftBar from "./components/LeftBar";
import ChatRoom from "./components/ChatRoom";
import "fabric-history";
import rotate from "./Img/refresh.svg";
import * as firebaseApp from "./utils/firebaseUtils";
import SharePage from "./components/SharePage.js";
export const updateToCloud = (canvas) => {
  const canvasId = window.location.pathname.split("/")[2];
  firebaseApp.updateCanvasToCloud(canvas, canvasId);
};

const App = () => {
  const [canvas, setCanvas] = useState("");
  const [name, setName] = useState("");
  const [chatEditing, setChatEditing] = useState(false);
  const canvasId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const canvasToSet = new fabric.Canvas("canvas", {
      width: window.innerWidth,
      height: window.innerHeight - 60,
      backgroundColor: "#ffffff",
      selection: false,
      objectChaching: false,
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

    fabric.Object.prototype.controls.mtr = new fabric.Control({
      x: 0,
      y: -0.5,
      offsetY: -40,
      withConnection: true,
      actionName: "rotate",
      cursorStyle: "pointer",
      cornerSize: 20,
      actionHandler: fabric.controlsUtils.rotationWithSnapping,
    });

    firebaseApp.canvasesGet(canvasId, (data) => {
      setName(data.data().name);
      canvasToSet.clearHistory();
    });
    firebaseApp.onAuthState(function (user) {
      if (user) {
        const email = user.email;
        canvasToSet.on("object:modified", () => {
          if (canvasToSet.getActiveObject().type !== "textbox") {
            if (beenStoped) {
              updateModifiedData(email, () => {
                updateSelectToCloud(email);
              });
            } else {
              if (canvasToSet.getActiveObject()) {
                updateSelectToCloud(email);
              }
              firebaseApp.updateCanvasToCloud(canvasToSet, canvasId);
            }
          } else {
            updateSelectToCloud(email);
            firebaseApp.updateCanvasToCloud(canvasToSet, canvasId);
          }
        });
        canvasToSet.on("selection:created", () => {
          updateSelectToCloud(email);
        });
        canvasToSet.on("selection:updated", () => {
          updateSelectToCloud(email);
        });
        canvasToSet.on("mouse:down", () => {
          if (!canvasToSet.getActiveObject()) {
            firebaseApp.selectUpdate(canvasId, email, {
              selected: false,
            });
          }
        });
        window.onbeforeunload = () => {
          firebaseApp.selectUpdate(canvasId, email, {
            selected: false,
          });
          const dataURL = canvasToSet.toDataURL({
            format: "png",
            top: 0,
            left: 0,
            width: canvasToSet.width,
            height: canvasToSet.height,
            multiplier: 0.5,
            quality: 0.1,
          });
          firebaseApp.canvasesUpdate(canvasId, {
            photoURL: dataURL,
          });
        };
        firebaseApp.canvasSnapShot(canvasId, (querySnapshot) => {
          if (!updateAble && canvasToSet.getObjects()) {
            beenStoped = true;
            return;
          } else {
            setActive(email, () => {
              canvasToSet.offHistory();
              canvasToSet.loadFromJSON(querySnapshot.data().data);
              canvasToSet.onHistory();
            });
          }
        });
        firebaseApp.selectSnapShot(canvasId, (querySnapshot) => {
          if (!updateAble && canvasToSet.getObjects()) {
            beenStoped = true;
            return;
          } else {
            querySnapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                querySnapshot.forEach((doc) => {
                  if (doc.id !== email) {
                    const json = JSON.parse(doc.data().ObjSelected);
                    canvasToSet.getObjects().forEach((obj) => {
                      if (
                        doc.data().selected === true &&
                        obj.type === json.type &&
                        obj.left === json.left &&
                        obj.top === json.top &&
                        obj.width === json.width &&
                        obj.fill === json.fill &&
                        obj.stroke === json.stroke &&
                        obj.strokeWidth === json.strokeWidth &&
                        obj.angle === json.angle
                      ) {
                        obj.set({
                          opacity: 0.4,
                          selectable: false,
                          evented: false,
                        });
                        canvasToSet.renderAll();
                      }
                    });
                  }
                });
              }
              if (change.type === "modified") {
                querySnapshot.forEach((doc) => {
                  if (doc.id !== email) {
                    const json = JSON.parse(doc.data().ObjSelected);
                    canvasToSet.getObjects().forEach((obj) => {
                      obj.set({
                        opacity: 1,
                        selectable: true,
                        evented: true,
                      });
                      canvasToSet.renderAll();
                      if (
                        obj.type === json.type &&
                        obj.left === json.left &&
                        obj.top === json.top &&
                        obj.width === json.width &&
                        obj.fill === json.fill &&
                        obj.stroke === json.stroke &&
                        obj.strokeWidth === json.strokeWidth &&
                        obj.angle === json.angle
                      ) {
                        if (doc.data().selected) {
                          obj.set({
                            opacity: 0.4,
                            selectable: false,
                            evented: false,
                          });
                        }
                        canvasToSet.renderAll();
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });

    function updateModifiedData(email, callback) {
      firebaseApp.selectGet(canvasId, email, (selectData) => {
        firebaseApp.canvasesGet(canvasId, (canvasData) => {
          beenStoped = false;
          if (selectData.exists) {
            const selectedD = JSON.parse(selectData.data().ObjSelected);
            const canvasD = JSON.parse(canvasData.data().data);
            const activeD = canvasToSet.getActiveObject();
            canvasD.objects.forEach((obj) => {
              if (
                obj.type === selectedD.type &&
                obj.left === selectedD.left &&
                obj.top === selectedD.top &&
                obj.width === selectedD.width &&
                obj.height === selectedD.height &&
                obj.fill === selectedD.fill &&
                obj.stroke === selectedD.stroke &&
                obj.strokeWidth === selectedD.strokeWidth &&
                obj.angle === selectedD.angle
              ) {
                canvasD.objects.splice(
                  canvasD.objects.indexOf(obj),
                  1,
                  activeD
                );
                firebaseApp.canvasesUpdate(canvasId, {
                  data: JSON.stringify(canvasD),
                });
              }
            });
            if (activeD) {
              callback();
            }
          } else {
            firebaseApp.updateCanvasToCloud(canvasToSet, canvasId);
          }
        });
      });
    }

    var updateAble = true;
    var beenStoped = false;
    canvasToSet.on("mouse:up", () => {
      if (canvasToSet.isDrawingMode) {
        firebaseApp.updateCanvasToCloud(canvasToSet, canvasId);
        canvasToSet.renderAll();
      }
      updateAble = true;
    });
    canvasToSet.on("mouse:down", () => {
      updateAble = false;
    });
    const updateSelectToCloud = (email) => {
      const ObjSelected = JSON.stringify(canvasToSet.getActiveObject());
      firebaseApp.selectSet(canvasId, email, {
        ObjSelected: ObjSelected,
        selected: true,
      });
    };
    const setActive = (user, callback) => {
      firebaseApp.selectGetWithoutDoc(canvasId, (querySnapshot) => {
        firebaseApp.canvasesGet(canvasId, (data) => {
          if (!data.data()) {
            return;
          }
          if (data.data().data === "") {
            return;
          }
          const canvasCloud = JSON.parse(data.data().data).objects;
          const canvasNow = canvasToSet.toJSON().objects;

          if (canvasCloud.length === canvasNow.length) {
            for (var i = 0; i < canvasCloud.length; i++) {
              if (canvasNow[i].type === "textbox") {
                if (
                  canvasCloud[i].type !== canvasNow[i].type ||
                  canvasCloud[i].left !== canvasNow[i].left ||
                  canvasCloud[i].top !== canvasNow[i].top ||
                  canvasCloud[i].width !== canvasNow[i].width ||
                  canvasCloud[i].fill !== canvasNow[i].fill ||
                  canvasCloud[i].stroke !== canvasNow[i].stroke ||
                  canvasCloud[i].strokeWidth !== canvasNow[i].strokeWidth ||
                  canvasCloud[i].angle !== canvasNow[i].angle ||
                  canvasCloud[i].text !== canvasNow[i].text
                ) {
                  callback();
                }
              } else {
                if (
                  canvasCloud[i].type !== canvasNow[i].type ||
                  canvasCloud[i].left !== canvasNow[i].left ||
                  canvasCloud[i].top !== canvasNow[i].top ||
                  canvasCloud[i].width !== canvasNow[i].width ||
                  canvasCloud[i].height !== canvasNow[i].height ||
                  canvasCloud[i].fill !== canvasNow[i].fill ||
                  canvasCloud[i].stroke !== canvasNow[i].stroke ||
                  canvasCloud[i].strokeWidth !== canvasNow[i].strokeWidth ||
                  canvasCloud[i].angle !== canvasNow[i].angle
                ) {
                  callback();
                }
              }
            }
          } else {
            callback();
          }
          querySnapshot.forEach((doc) => {
            if (doc.id !== user) {
              const json = JSON.parse(doc.data().ObjSelected);
              canvasToSet.getObjects().forEach((obj) => {
                if (
                  doc.data().selected &&
                  obj.type === json.type &&
                  obj.left === json.left &&
                  obj.top === json.top &&
                  obj.width === json.width &&
                  obj.fill === json.fill &&
                  obj.stroke === json.stroke &&
                  obj.strokeWidth === json.strokeWidth &&
                  obj.angle === json.angle
                ) {
                  obj.set({
                    opacity: 0.4,
                    selectable: false,
                    evented: false,
                  });
                  canvasToSet.renderAll();
                }
              });
            } else if (doc.id === user && doc.data()) {
              const json = JSON.parse(doc.data().ObjSelected);
              canvasToSet.getObjects().forEach((obj) => {
                if (
                  doc.data().selected &&
                  obj.type === json.type &&
                  obj.left === json.left &&
                  obj.top === json.top &&
                  obj.width === json.width &&
                  // obj.height === json.height &&
                  obj.fill === json.fill &&
                  obj.stroke === json.stroke &&
                  obj.strokeWidth === json.strokeWidth &&
                  obj.angle === json.angle
                ) {
                  obj.set({
                    opacity: 1,
                    selectable: true,
                    evented: true,
                  });
                  canvasToSet.setActiveObject(obj);
                  canvasToSet.renderAll();
                }
              });
            }
          });
        });
      });
    };
    setCanvas(canvasToSet);
  }, []);
  return (
    <div>
      <div id="container">
        <LeftBar canvas={canvas} name={name} />
        <div id="rightside">
          <div id="top_bar">
            <ToolBar
              canvas={canvas}
              name={name}
              setName={setName}
              chatEditing={chatEditing}
            />
          </div>
          <div id="canvas_area">
            <canvas id="canvas" />
            <ChatRoom setChatEditing={setChatEditing} />
          </div>
        </div>
      </div>
      <SharePage canvasId={canvasId} />
    </div>
  );
};

export default App;
