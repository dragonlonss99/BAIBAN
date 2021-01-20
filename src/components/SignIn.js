import { useState } from "react";
import firebase from "firebase/app";

export default function SignInLocal() {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("111111");
  const [emailCheck, setEmailCheck] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailCheck("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordCheck("");
  };

  const signIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function (user) {})
      .catch(function (error) {
        var errorCode = error.code;
        if (errorCode === "auth/user-not-found") {
          setEmailCheck("Email address hasn't been sign up!");
        } else if (errorCode === "auth/invalid-email") {
          setEmailCheck("Invalid email address, please check!");
        } else if (errorCode === "auth/wrong-password") {
          setPasswordCheck("Password is wrong, please check!");
        }
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
        onClick={() => {
          setEmailCheck("");
        }}
      />
      <div id="emailCheck" style={{ display: emailCheck ? "block" : "none" }}>
        <small>{emailCheck}</small>
      </div>
      <input
        className="signinInput"
        id="pwdSignIn"
        type="password"
        value={password}
        onChange={handlePassword}
        placeholder="password"
        onClick={() => {
          setPasswordCheck("");
        }}
      />
      <div id="pwdCheck" style={{ display: passwordCheck ? "block" : "none" }}>
        <small>{passwordCheck}</small>
      </div>
      <div id="submit" onClick={signIn} className="bigger">
        Log In
      </div>
    </div>
  );
}
