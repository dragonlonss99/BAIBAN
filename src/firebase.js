import React, { useState } from "react";
import firebase from "firebase";
import firebaseConfig from "./firebaseConfig";

export const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  signInWith(provider);
};

export const signInWithFB = () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  signInWith(provider);
  console.log(provider);
};

const signInWith = (provider) => {
  // const app = firebase.apps.length
  //   ? firebase.app()
  //   : firebase.initializeApp(firebaseConfig);
  // provider.setCustomParameters({
  //   prompt: "select_account",
  // });
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      // var token = result.credential.accessToken;
      // The signed-in user info.
      var email = result.user.email;
      let canvasOwn = [];
      // ...
      // console.log(result.user);
      console.log("login successfully");
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
            // } else {
            //   db.collection("users")
            //     .doc(email)
            //     .get()
            //     .then((querySnapshot) => {
            //       // querySnapshot.data().canvasOwn.forEach((can) => {
            //       //   console.log("cavas: " + can);
            //       // });
            //       // console.log(querySnapshot.data());
            //       canvasOwn = querySnapshot.data().canvasOwn;
            //     })
            //     .then(() => {
            //       canvasOwn.forEach((can) => {
            //         db.collection("canvases")
            //           .doc(can)
            //           .get()
            //           .then((q) => {
            //             // console.log(q.data().data);
            //           });
            //       });
            //       // console.log(canvasOwn);
            //     });
          }
        });
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      console.log(error);
      var errorMessage = error.message;
      console.log(errorMessage);
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
};

export const signOut = () => {
  firebase
    .auth()
    .signOut()
    .then(function () {
      //登出成功
      console.log("logout");
    })
    .catch(function (error) {
      //錯誤事件
      var errorMessage = error.message;
      console.log("logout error", errorMessage);
    });
};

export const firebaseGet = () => {
  const app = firebase.apps.length
    ? firebase.app()
    : firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  db.collection("users")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, doc.data());
      });
    });
};
