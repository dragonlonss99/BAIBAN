import firebase from "firebase/app";

const canvasId = window.location.pathname.split("/")[2];
const db = firebase.firestore();
export function canvasesUpdate(dataToUpdate) {
  db.collection("canvases").doc(canvasId).update(dataToUpdate);
}

export const updateToCloud = (canvas) => {
  let canvasToUpload = JSON.stringify(canvas.toJSON());
  const dataURL = canvas.toDataURL({
    format: "png",
    top: 0,
    left: 0,
    width: canvas.width,
    height: canvas.height,
    multiplier: 0.5,
    quality: 0.1,
  });
  canvasesUpdate({
    data: canvasToUpload,
    photoURL: dataURL,
  });
};

export function canvasesGet() {}
