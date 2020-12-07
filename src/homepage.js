import React from "react";
import reportWebVitals from "./reportWebVitals";
import { ReactComponent as Cancel } from "./Img/addshapes/cancel.svg";
import { ReactComponent as Logo } from "./Img/toolbar/open.svg";
import { ReactComponent as GoogleLogo } from "./Img/google-icon.svg";
// import FirebaseRead from "./firebase";
import {
  signInWithGoogle,
  signInWithFB,
  signOut,
  // firebaseTest,
  // firebaseGet,
} from "./firebase";
import SignInLocal from "./components/SignIn";
import SignUpLocal from "./components/SignUp";
import firebase from "firebase";
import firebaseConfig from "./firebaseConfig";
import { useHistory } from "react-router-dom";
import "./homepage.css";
// import { Router, Route, Link } from 'react-router'

export default function HomePage() {
  let history = useHistory();
  const showLoginStatus = () => {
    document.querySelector("#logcontent").style.display = "block";
    document.querySelector("#signUpBox").style.display = "none";
  };
  const showSignUpStatus = () => {
    document.querySelector("#logcontent").style.display = "none";
    document.querySelector("#signUpBox").style.display = "block";
  };

  // const app = firebase.apps.length
  //   ? firebase.app()
  //   : firebase.initializeApp(firebaseConfig);
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      // document.querySelector("#status").innerHTML = "已登入";
      console.log(user.email);
      history.push("/profile");
    } else {
      // No user is signed in.
      // document.querySelector("#status").innerHTML = "未登入，請點以下登入方式";
    }
  });

  // const firebaseSnap = () => {
  //   const app = firebase.apps.length
  //     ? firebase.app()
  //     : firebase.initializeApp(firebaseConfig);
  //   var db = firebase.firestore();
  //   db.collection("canvases")
  //     .doc("Test")
  //     .onSnapshot((querySnapshot) => {
  //       console.log(querySnapshot.data().data);
  //     });
  // };

  const loginBoxNon = () => {
    document.querySelector("#darkBack").style.display = "none";
    document.querySelector("#ahome").className = "";
  };

  const showLoginBox = () => {
    document.querySelector("#darkBack").style.display = "flex";
    document.querySelector("#ahome").className = "hidden";
  };

  return (
    <div>
      <div id="ahome">
        <div className="topNav">
          <div className="mainLogo">
            <Logo className="logo" />
            <div>BIBEN</div>
          </div>
          <div className="logInWay">
            <div>log In</div>
            <div>Sign Up</div>
          </div>
        </div>
        <div id="BigAtt">BIBEN</div>
        {/* <div>The best online board you'll ever have!</div> */}
        <div id="middleAtt">
          Drawing, building &amp; sharing your best idea with friends
        </div>
        <div id="startBtnBox">
          <div id="startBtn" onClick={showLoginBox}>
            start now for free
          </div>
        </div>
        <div id="HcanvasBox">
          something cool~
          <canvas id="Hcanvas"></canvas>
        </div>
      </div>
      <div id="darkBack">
        <div id="loginBoxOuter">
          <div id="logInBox">
            <Cancel id="cancelOut" onClick={loginBoxNon} />
            <div id="logoBox">
              <Logo className="logo" />
            </div>
            <div id="title">Welcome to BIBEN!</div>
            <div id="logcontent">
              <SignInLocal />
              <div id="or">Or</div>
              <div id="googleLogin" onClick={signInWithGoogle}>
                <GoogleLogo style={{ width: 20, height: 20 }} />
                Log In with Google
              </div>
              <div id="FBcenter">
                <div
                  onClick={signInWithFB}
                  className="fb-login-button"
                  data-size="large"
                  data-button-type="continue_with"
                  data-layout="rounded"
                  data-auto-logout-link="false"
                  data-use-continue-as="true"
                  data-width=""
                ></div>
              </div>
              <label>First Time visiting?</label>
              <div id="signUpbut" onClick={showSignUpStatus}>
                create an account free
              </div>
            </div>
            <div id="signUpBox" className="hiddenStatus">
              <SignUpLocal id="signUpLocal" />
              <div id="tryAn">Or try another way to log in?</div>
              <div id="anotherLogin" onClick={showLoginStatus}>
                Login with other ways
              </div>
            </div>
            <div id="policy">
              繼續使用即代表你同意 BIBen 的 《隱私權政策》。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
