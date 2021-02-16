/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import * as firebase from "../utils/firebaseUtils.js";
import { ReactComponent as Cancel } from "../Img/back/cancel.svg";
import { ReactComponent as Cowork } from "../Img/profile/undraw_Online_collaboration.svg";
import { ReactComponent as Learn } from "../Img/profile/undraw_Online_learning.svg";
export default function SharePage(props) {
  const canvasId = props.canvasId;
  const [shareInputUse, setShareInputUse] = useState("");
  const [shareInputObserve, setShareInputObserve] = useState("");
  const [display, setDisplay] = useState(false);
  const [scalein, setScalein] = useState(false);
  const sharePage = props.sharePage;
  const setSharePage = props.setSharePage;
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
    setSharePage(false);
    setScalein(false);
    setTimeout(() => {
      setDisplay(false);
    }, 300);
  };
  useEffect(() => {
    sharePage && setDisplay(true);
    sharePage && setScalein(true);
  }, [sharePage]);

  return (
    <>
      <div className="dark" style={{ display: display ? "block" : "none" }} />
      <div
        style={{ display: display ? "flex" : "none" }}
        className={scalein ? "scaleIn darkBack" : "scaleOut darkBack"}
      >
        <div className="shareBoxOuter">
          <div className="profileShareBox">
            <div className="profileCancelBox">
              <Cancel onClick={shareBoxNon} className="bigger cancelOutShare" />
            </div>
            <div className="shareInputBox">
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
