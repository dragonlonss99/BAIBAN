import { useState, useEffect, useRef } from "react";
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
import {
  signInWithGoogle,
  signInWithFB,
  onAuthState,
} from "./utils/firebaseUtils.js";
import SignInLocal from "./components/SignIn";
import SignUpLocal from "./components/SignUp";
import { useHistory } from "react-router-dom";
import "./homepage.scss";
import Loading from "./components/Loading.js";

export default function HomePage() {
  const [loginPage, setLoginPage] = useState(false);
  const [loginSignUp, setLoginSignUp] = useState(true);
  const [scalein, setScalein] = useState(false);
  const [topNavscroll, setTopNavscroll] = useState(false);
  const [limit, setLimit] = useState(30);
  const history = useHistory();
  const [loadingFinish, setLoadingFinish] = useState(false);
  onAuthState(function (user) {
    if (user) {
      history.push("/profile");
    }
  });
  useEffect(() => {
    if (window.innerWidth > 425) {
      setLimit(30);
    } else {
      setLimit(10);
    }
    setLoadingFinish(true);
  }, []);
  const loginBoxNon = () => {
    setScalein(false);
    setTimeout(() => {
      setLoginPage(false);
    }, 300);
  };

  const showLoginBox = () => {
    setScalein(true);
    setLoginPage(true);
    setLoginSignUp(true);
  };
  const showSignBox = () => {
    setScalein(true);
    setLoginPage(true);
    setLoginSignUp(false);
  };

  return (
    <div
      id="homePage"
      onScroll={(e) => {
        if (e.target.scrollTop > limit) {
          setTopNavscroll(true);
        } else {
          setTopNavscroll(false);
        }
      }}
    >
      <div id="ahome">
        <div>
          <div
            className={topNavscroll ? "topNavBox floatingNav" : "topNavBox"}
            style={{
              position: topNavscroll ? "fixed" : "absolute",
              marginTop: topNavscroll ? "0px" : `${limit}px`,
            }}
          >
            <div className="topNav">
              <div className="mainLogo">
                <img src={logo} className="logo" />
                <div>BAIBAN</div>
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
            <div id="BigAtt">BAIBAN</div>
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
        <img src={eraser} className="homePageImage eraser" />
      </div>
      <div id="introduction">
        <div id="howeWhy">What can we do with BAIBAN?</div>
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
        <div>&copy; 2020 BAIBAN All rights reserved.</div>
      </div>
      {loadingFinish || <Loading />}
      <div id="dark" style={{ display: loginPage ? "block" : "none" }} />
      <div
        id="darkBack"
        className={scalein ? "scaleIn" : "scaleOut"}
        style={{ display: loginPage ? "flex" : "none" }}
      >
        <div id="loginBoxOuter">
          <div id="logInBox">
            <Cancel id="cancelOut" onClick={loginBoxNon} className="bigger" />
            <div id="logoBox">
              <img src={logo} className="logo" />
            </div>
            <div id="title">Welcome to BAIBAN!</div>
            <div
              id="logcontent"
              style={{ display: loginSignUp ? "block" : "none" }}
            >
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
              <div
                id="signUpbut"
                onClick={() => {
                  setLoginSignUp(false);
                }}
                className="bigger"
              >
                create an free account
              </div>
            </div>
            <div
              id="signUpBox"
              className="hiddenStatus"
              style={{ display: loginSignUp ? "none" : "block" }}
            >
              <SignUpLocal id="signUpLocal" />
              <div id="tryAn">Or try another way to log in?</div>
              <div
                id="anotherLogin"
                onClick={() => {
                  setLoginSignUp(true);
                }}
              >
                Login with other ways
              </div>
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
