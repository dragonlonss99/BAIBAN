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
        value={email}
        onChange={handleEmail}
        placeholder="email"
        className="signinInput emailSignIn"
        onClick={() => {
          setEmailCheck("");
        }}
      />
      <div
        className="emailCheck"
        style={{ display: emailCheck ? "block" : "none" }}
      >
        <small>{emailCheck}</small>
      </div>
      <input
        className="signinInput pwdSignIn"
        type="password"
        value={password}
        onChange={handlePassword}
        placeholder="password"
        onClick={() => {
          setPasswordCheck("");
        }}
      />
      <div
        className="pwdCheck"
        style={{ display: passwordCheck ? "block" : "none" }}
      >
        <small>{passwordCheck}</small>
      </div>
      <div onClick={signIn} className="bigger submit">
        Log In
      </div>
    </div>
  );
}
