import React, { useState } from "react";
import firebase from "firebase";
import firebaseConfig from "../firebaseConfig";

export default function SignInLocal() {
  const app = firebase.apps.length
    ? firebase.app()
    : firebase.initializeApp(firebaseConfig);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const signIn = () => {
    let user = firebase.auth().currentUser;
    let canvasOwn = [];
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function (user) {
        //登入成功
        console.log("login successfully");
      })
      .catch(function (error) {
        //登入錯誤訊息
        var errorMessage = error.message;
        console.log(errorMessage);
      });
    var db = firebase.firestore();
    db.collection("users")
      .doc(email)
      .get()
      .then((querySnapshot) => {
        // querySnapshot.data().canvasOwn.forEach((can) => {
        //   console.log("cavas: " + can);
        // });
        // console.log(querySnapshot.data());
        canvasOwn = querySnapshot.data().canvasOwn;
      })
      .then(() => {
        canvasOwn.forEach((can) => {
          db.collection("canvases").doc(can).get();
          // .then((q) => {
          //   console.log(q.data().data);
          // });
        });
        // console.log(canvasOwn);
      });
  };
  return (
    <div className="nativeBox">
      <input
        id="emailSignIn"
        value={email}
        onChange={handleEmail}
        placeholder="email"
        className="signinInput"
      />

      <input
        className="signinInput"
        id="pwdSignIn"
        type="password"
        value={password}
        onChange={handlePassword}
        placeholder="password"
      />
      <div id="submit" onClick={signIn} className="bigger">
        Log In
      </div>
    </div>
  );
}
