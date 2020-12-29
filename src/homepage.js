import React, { useState, useEffect, useRef } from "react";
import reportWebVitals from "./reportWebVitals";
import { ReactComponent as Cancel } from "./Img/back/cancel.svg";
import logo from "./Img/icon13.svg";
import eraser from "./Img/back/eraser2.svg";
import fbLogo from "./Img/f_logo.svg";
import { ReactComponent as GoogleLogo } from "./Img/google-icon.svg";
import man from "./Img/back/undraw_professor.svg";
import triangleR from "./Img/back/triangle-ruler.svg";
import penDraw from "./Img/back/fountain-pen.svg";
import chat from "./Img/back/chat-02.svg";
import audi from "./Img/back/audience.svg";
import Try_It from "./components/Try_It.js";
import { signInWithGoogle, signInWithFB, signOut } from "./firebase";
import SignInLocal from "./components/SignIn";
import SignUpLocal from "./components/SignUp";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import "./homepage.scss";

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
      // console.log(user.email);
      // console.log(user.photoURL);
      history.push("/profile");
    } else {
      // No user is signed in.
      // document.querySelector("#status").innerHTML = "未登入，請點以下登入方式";
    }
  });

  const loginBoxNon = () => {
    document.querySelector("#darkBack").className = "scaleOut";
    setTimeout(() => {
      document.querySelector("#darkBack").style.display = "none";
      document.querySelector("#dark").style.display = "none";
    }, 300);
  };

  const showLoginBox = () => {
    document.querySelector("#darkBack").className = "scaleIn";
    document.querySelector("#darkBack").style.display = "flex";
    document.querySelector("#dark").style.display = "block";
    showLoginStatus();
  };

  const onScroll = (e) => {
    let obj = document.querySelector(".topNavBox");
    if (window.innerWidth > 425) {
      if (e.target.scrollTop > 30) {
        obj.style.position = "fixed";
        obj.style.marginTop = "0px";
        obj.className = "topNavBox floatingNav";
      } else {
        obj.style.position = "absolute";
        obj.style.marginTop = "30px";
        obj.className = "topNavBox";
      }
    } else {
      if (e.target.scrollTop > 10) {
        obj.style.position = "fixed";
        obj.style.marginTop = "0px";
        obj.className = "topNavBox floatingNav";
      } else {
        obj.style.position = "absolute";
        obj.style.marginTop = "10px";
        obj.className = "topNavBox";
      }
    }
  };
  // onscroll = () => {
  //   console.log("2");
  // };
  // onwheel = (e) => {
  //   // e.preventDefault();
  //   e.stopPropagation();
  //   let obj = document.querySelector(".topNavBox");
  //   let home = document.querySelector("#homePage");
  //   // console.log("1");
  //   if (home.scrollTop > 30) {
  //     obj.style.marginTop = "0px";
  //     obj.style.paddingTop = "30px";
  //     obj.className = "topNavBox floatingNav";
  //   } else {
  //     obj.style.marginTop = "30px";
  //     obj.style.paddingTop = "0px";
  //     obj.className = "topNavBox";
  //   }
  // };
  const showSignBox = () => {
    showLoginBox();
    showSignUpStatus();
  };
  return (
    <div id="homePage" onScroll={onScroll}>
      <div id="ahome">
        <div>
          <div className="topNavBox">
            <div className="topNav">
              <div className="mainLogo">
                <img src={logo} className="logo" />
                <div>BAIBEN</div>
              </div>
              <div className="logInWay">
                <div className="bigger" onClick={showLoginBox}>
                  log In
                </div>
                <div
                  id="homeSignUpBtn"
                  className="bigger"
                  onClick={showSignBox}
                >
                  Sign Up
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="mainContain">
          <div id="homePageLeft">
            <div id="BigAtt">BAIBEN</div>
            <div id="middleAtt">Sharing ideas from NOW!</div>

            <div id="startBtnBox">
              <div id="startBtn" onClick={showLoginBox} className="bigger">
                start now for free
              </div>
            </div>
          </div>
          <div id="homePageRight">
            <img src={man} />
          </div>
        </div>
        {/* <img src={bottom} id="bottomBar" /> */}
        {/* <div id="HcanvasBox">
          something cool~
          <canvas id="Hcanvas"></canvas>
        </div> */}
        {/* <img src={triangle} className="homePageImage triangle" /> */}
        {/* <img src={compass} className="homePageImage compass" /> */}
        <img src={eraser} className="homePageImage eraser" />
        {/* <img src={sigma} className="homePageImage sigma" /> */}
      </div>
      {/* <img src={bottom} id="bottomBar" /> */}
      <div id="introduction">
        <div id="howeWhy">What can we do with BAIBEN?</div>
        <div id="circleBox">
          <div>
            <div className="homePageCircle">
              <img src={triangleR} />
              <div>Pattern</div>
            </div>
            <div className="homePageCircle">
              <img src={penDraw} />
              <div>Drawing</div>
            </div>
          </div>
          <div>
            <div className="homePageCircle">
              <img src={audi} />
              <div>Cowork</div>
            </div>
            <div className="homePageCircle">
              <img src={chat} />
              <div>Message</div>
            </div>
          </div>
        </div>
        <div id="howeWhy">Try it now! </div>
        <Try_It />
      </div>
      <div className="footer">
        <div>&copy; 2020 BAIBEN All rights reserved.</div>
      </div>
      <div id="dark" />
      <div id="darkBack" className="scaleIn">
        <div id="loginBoxOuter">
          <div id="logInBox">
            <Cancel id="cancelOut" onClick={loginBoxNon} className="bigger" />
            <div id="logoBox">
              <img src={logo} className="logo" />
            </div>
            <div id="title">Welcome to BAIBEN!</div>
            <div id="logcontent">
              <SignInLocal />
              <div id="or">Or</div>
              <div
                id="googleLogin"
                onClick={signInWithGoogle}
                className="bigger"
              >
                <GoogleLogo style={{ width: 20, height: 20 }} />
                Log In with Google
              </div>

              <div id="FBcenter" onClick={signInWithFB} className="bigger">
                <img src={fbLogo} style={{ width: 20, height: 20 }} />
                Log In with FaceBook
              </div>
              <label>First Time visiting?</label>
              <div id="signUpbut" onClick={showSignUpStatus} className="bigger">
                create an free account
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
              {/* 繼續使用即代表你同意 BIBen 的 《隱私權政策》。 */}
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
