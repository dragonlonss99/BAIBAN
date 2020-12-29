/* eslint-disable react/prop-types */
import React, { useState } from "react";
import * as firebase from "../utils/firebaseUtils.js";
import { ReactComponent as Cancel } from "../Img/back/cancel.svg";
import { ReactComponent as Cowork } from "../Img/profile/undraw_Online_collaboration.svg";
import { ReactComponent as Learn } from "../Img/profile/undraw_Online_learning.svg";
export default function SharePage(props) {
  const canvasId = props.canvasId;
  const [shareInputUse, setShareInputUse] = useState("");
  const [shareInputObserve, setShareInputObserve] = useState("");
  // const canvasId = window.location.pathname.split("/")[2];
  const shareCanvasUse = (userEmail) => {
    firebase.canvasesUpdate(canvasId, {
      user: firebase.arrayUnion(userEmail),
    });
    firebase.userUpdate(userEmail, {
      canvasUse: firebase.arrayUnion(canvasId),
    });
  };

  const shareCanvasObserve = (observerEmail) => {
    firebase.canvasesUpdate(canvasId, {
      observer: firebase.arrayUnion(observerEmail),
    });
    firebase.userUpdate(canvasId, observerEmail, {
      canvasObserve: firebase.arrayUnion(canvasId),
    });
  };

  const handleShareUse = () => {
    shareCanvasUse(shareInputUse);
    setShareInputUse("");
    setShareInputObserve("");
    shareBoxNon();
  };

  const handleShareObserve = () => {
    shareCanvasObserve(shareInputObserve);
    setShareInputUse("");
    setShareInputObserve("");
    shareBoxNon();
  };
  const shareBoxNon = () => {
    document.querySelector("#darkBack").className = "scaleOut";
    setTimeout(() => {
      document.querySelector("#darkBack").style.display = "none";
      document.querySelector("#dark").style.display = "none";
    }, 300);
  };

  return (
    <>
      <div id="dark" />
      <div id="darkBack" style={{ display: "none" }} className="scaleIn">
        <div id="shareBoxOuter">
          <div id="profileShareBox">
            <div id="profileCancelBox">
              <Cancel
                id="cancelOutShare"
                onClick={shareBoxNon}
                className="bigger"
              />
            </div>
            <div id="shareInputBox">
              <div className="shareWayBox">
                <div className="h1">Share to co-worker</div>
                <div>invite others to co-work </div>
                <div> (the one you invited can edit the board)</div>
                <Cowork className="shareImg" />
                <div className="shareBtnBox">
                  <input
                    value={shareInputUse}
                    className="shareInput"
                    placeholder="Please enter an Email"
                    onChange={(e) => {
                      setShareInputUse(e.target.value);
                    }}
                  />
                  <div onClick={handleShareUse} className="shareBtn">
                    share
                  </div>
                </div>
              </div>
              <div className="shareWayBox">
                <div className="h1">Share to student</div>
                <div>invite others to read </div>
                <div>(the one you invited can read only)</div>
                <Learn className="shareImg" />
                <div className="shareBtnBox">
                  <input
                    className="shareInput"
                    value={shareInputObserve}
                    placeholder="Please enter an Email"
                    onChange={(e) => {
                      setShareInputObserve(e.target.value);
                    }}
                  />
                  <div onClick={handleShareObserve} className="shareBtn">
                    share
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
