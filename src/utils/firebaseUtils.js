import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import * as config from "../config.js";
const firebaseConfig = config.REACT_APP_FIREBASE_CONFIG;

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const user = firebase.auth().currentUser;
const email = firebase.auth().currentUser?.email;
function timeStamp() {
  return firebase.firestore.FieldValue.serverTimestamp();
}

function arrayUnion(data) {
  return firebase.firestore.FieldValue.arrayUnion(data);
}
function arrayRemove(data) {
  return firebase.firestore.FieldValue.arrayRemove(data);
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

function canvasesAdd(dataToAdd, callback) {
  db.collection("canvases").add(dataToAdd).then(callback);
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

const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  signInWith(provider);
};

const signInWithFB = () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  signInWith(provider);
};

const signInWith = (provider) => {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      var email = result.user.email;
      var db = firebase.firestore();
      var emailExist;
      db.collection("users")
        .doc(email)
        .get()
        .then((q) => {
          emailExist = q.exists;
        })
        .then(() => {
          if (!emailExist) {
            db.collection("users").doc(email).set({
              email: email,
              canvasOwn: [],
              canvasUse: [],
              canvasObserve: [],
            });
          }
        });
    });
};

const signOut = () => {
  firebase.auth().signOut();
};

const docDelete = (collection, doc) => {
  db.collection(collection).doc(doc).delete();
};

function userSnapShot(user, callback) {
  db.collection("users").doc(user.email).onSnapshot(callback);
}

export {
  db,
  user,
  email,
  arrayUnion,
  arrayRemove,
  canvasesUpdate,
  canvasesAdd,
  updateCanvasToCloud,
  userSnapShot,
  canvasesGet,
  selectUpdate,
  selectGet,
  userUpdate,
  canvasSnapShot,
  selectSnapShot,
  selectSet,
  onAuthState,
  selectGetWithoutDoc,
  signInWithGoogle,
  signInWithFB,
  signOut,
  docDelete,
  timeStamp,
};
