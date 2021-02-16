import { useState } from "react";
import firebase from "firebase/app";

export default function SignUpLocal() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCheck, setEmailCheck] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [userNameCheck, setUserNameCheck] = useState(false);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailCheck("");
  };

  const handleuserName = (e) => {
    setUserName(e.target.value);
    setUserNameCheck(false);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordCheck("");
  };

  const signUp = () => {
    if (!userName) {
      setUserNameCheck(true);
      return;
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(function (user) {
          var db = firebase.firestore();
          db.collection("users").doc(email).set({
            userName: userName,
            email: email,
            canvasOwn: [],
            canvasUse: [],
            canvasObserve: [],
          });
        })
        .catch(function (error) {
          var errorCode = error.code;
          if (errorCode === "auth/email-already-in-use") {
            setEmailCheck("This email has been used!");
          } else if (errorCode === "auth/invalid-email") {
            setEmailCheck("Invalid email address, please check!");
          } else if (errorCode === "auth/weak-password") {
            setPasswordCheck("Password should > 6 characters!");
          }
        });
    }
  };
  return (
    <div className="nativeBox">
      <h2>Create a new account</h2>
      <input
        value={userName}
        onChange={handleuserName}
        className="signinInput userName"
        placeholder="user name"
        onClick={() => {
          setUserNameCheck(false);
        }}
      />
      <div
        className="userNameCheck"
        style={{ display: userNameCheck ? "block" : "none" }}
      >
        <small>User name should not be empty!</small>
      </div>
      <input
        value={email}
        onChange={handleEmail}
        className="signinInput email"
        placeholder="email"
        onClick={() => {
          setEmailCheck("");
        }}
      />
      <div
        className="emailUpCheck"
        style={{ display: emailCheck ? "block" : "none" }}
      >
        <small>{emailCheck}</small>
      </div>

      <input
        type="password"
        value={password}
        onChange={handlePassword}
        className="signinInput pwd"
        placeholder="set password"
        onClick={() => {
          setPasswordCheck("");
        }}
      />
      <div
        className="pwdUpCheck"
        style={{ display: passwordCheck ? "block" : "none" }}
      >
        <small>{passwordCheck}</small>
      </div>
      <div onClick={signUp} className="bigger submitSignUp">
        Register
      </div>
    </div>
  );
}
