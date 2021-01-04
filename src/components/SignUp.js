import React, { useState } from "react";
import firebase from "firebase/app";

export default function SignUpLocal() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCheck, setEmailCheck] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
    document.querySelector("#emailUpCheck").style.display = "none";
  };

  const handleuserName = (e) => {
    setUserName(e.target.value);
    document.querySelector("#userNameCheck").style.display = "none";
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    document.querySelector("#pwdUpCheck").style.display = "none";
  };

  const signUp = () => {
    if (!userName) {
      document.querySelector("#userNameCheck").style.display = "block";
      return;
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(function (user) {
          var db = firebase.firestore();
          db.collection("users")
            .doc(email)
            .set({
              userName: userName,
              email: email,
              canvasOwn: [],
              canvasUse: [],
              canvasObserve: [],
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
        })
        .catch(function (error) {
          var errorCode = error.code;
          if (errorCode === "auth/email-already-in-use") {
            document.querySelector("#emailUpCheck").style.display = "block";
            setEmailCheck("This email has been used!");
          } else if (errorCode === "auth/invalid-email") {
            document.querySelector("#emailUpCheck").style.display = "block";
            setEmailCheck("Invalid email address, please check!");
          } else if (errorCode === "auth/weak-password") {
            document.querySelector("#pwdUpCheck").style.display = "block";
            setPasswordCheck("Password should > 6 characters!");
          }
        });
    }
  };
  return (
    <div className="nativeBox">
      <h2>Create a new account</h2>
      <input
        id="userName"
        value={userName}
        onChange={handleuserName}
        className="signinInput"
        placeholder="user name"
        onClick={(e) => {
          document.querySelector("#userNameCheck").style.display = "none";
        }}
      />
      <div id="userNameCheck">
        <small>User name should not be empty!</small>
      </div>
      <input
        id="email"
        value={email}
        onChange={handleEmail}
        className="signinInput"
        placeholder="email"
        onClick={(e) => {
          document.querySelector("#emailUpCheck").style.display = "none";
        }}
      />
      <div id="emailUpCheck">
        <small>{emailCheck}</small>
      </div>

      <input
        id="pwd"
        type="password"
        value={password}
        onChange={handlePassword}
        className="signinInput"
        placeholder="set password"
        onClick={(e) => {
          document.querySelector("#pwdUpCheck").style.display = "none";
        }}
      />
      <div id="pwdUpCheck">
        <small>{passwordCheck}</small>
      </div>
      <div id="submitSignUp" onClick={signUp} className="bigger">
        Register
      </div>
    </div>
  );
}
