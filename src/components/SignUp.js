import React, { useState } from "react";
import firebase from "firebase";
import firebaseConfig from "../firebaseConfig";

export default function SignUpLocal() {
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
  const signUp = () => {
    // let user = firebase.auth().currentUser;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function (user) {
        //註冊完後，可執行的動作
        console.log("signUp successfully");
        console.log(user);
      })
      .catch(function (error) {
        //註冊未成功的錯誤訊息
        var errorMessage = error.message;
        console.log(errorMessage);
      });
    var db = firebase.firestore();
    db.collection("users")
      .doc(email)
      .set({
        email: email,
        canvasOwn: [],
        canvasRead: [],
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  };
  return (
    <div className="nativeBox">
      <h2>Create a new account</h2>
      <input
        id="email"
        value={email}
        onChange={handleEmail}
        className="signinInput"
        placeholder="email"
      />
      <input
        id="pwd"
        type="password"
        value={password}
        onChange={handlePassword}
        className="signinInput"
        placeholder="set password"
      />
      <div id="submitSignUp" onClick={signUp}>
        Register
      </div>
    </div>
  );
}
