import firebase from "firebase/app";

firebase.initializeApp({
  apiKey: "AIzaSyDh6uamYJP8Wp2UG3qJihL0uOOnLZYf8dc",
  authDomain: "biben-1193b.firebaseapp.com",
  databaseURL: "https://biben-1193b.firebaseio.com",
  projectId: "biben-1193b",
  storageBucket: "biben-1193b.appspot.com",
  messagingSenderId: "532211232221",
  appId: "1:532211232221:web:672f0108ab14f418499a34",
  measurementId: "G-X35JWETTVG",
});

const db = firebase.firestore();
const user = firebase.auth().currentUser;
function arrayUnion(data) {
  return firebase.firestore.FieldValue.arrayUnion(data);
}
function canvasesUpdate(canvasId, dataToUpdate) {
  db.collection("canvases").doc(canvasId).update(dataToUpdate);
}

const updateCanvasToCloud = (canvas, canvasId) => {
  const canvasToUpload = JSON.stringify(canvas.toJSON());
  const dataURL = canvas.toDataURL({
    format: "png",
    top: 0,
    left: 0,
    width: canvas.width,
    height: canvas.height,
    multiplier: 0.5,
    quality: 0.1,
  });
  canvasesUpdate(canvasId, {
    data: canvasToUpload,
    photoURL: dataURL,
  });
};

function canvasesGet(canvasId, callback) {
  db.collection("canvases").doc(canvasId).get().then(callback);
}

function selectUpdate(canvasId, email, dataToUpdate) {
  db.collection("selectedObj")
    .doc(canvasId)
    .collection("userSelect")
    .doc(email)
    .update(dataToUpdate);
}

function selectSet(canvasId, email, dataToUpdate) {
  db.collection("selectedObj")
    .doc(canvasId)
    .collection("userSelect")
    .doc(email)
    .set(dataToUpdate);
}

function selectGet(canvasId, email, callback) {
  db.collection("selectedObj")
    .doc(canvasId)
    .collection("userSelect")
    .doc(email)
    .get()
    .then(callback);
}

function userUpdate(email, userData) {
  db.collection("users").doc(email).update(userData);
}

function canvasSnapShot(canvasId, callback) {
  db.collection("canvases").doc(canvasId).onSnapshot(callback);
}

function selectSnapShot(canvasId, callback) {
  db.collection("selectedObj")
    .doc(canvasId)
    .collection("userSelect")
    .onSnapshot(callback);
}

function onAuthState(callback) {
  firebase.auth().onAuthStateChanged(callback);
}

function selectGetWithoutDoc(canvasId, callback) {
  db.collection("selectedObj")
    .doc(canvasId)
    .collection("userSelect")
    .get()
    .then(callback);
}
export {
  db,
  user,
  // email,
  arrayUnion,
  canvasesUpdate,
  updateCanvasToCloud,
  canvasesGet,
  selectUpdate,
  selectGet,
  userUpdate,
  canvasSnapShot,
  selectSnapShot,
  selectSet,
  onAuthState,
  selectGetWithoutDoc,
};
