import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import HomePage from "./homepage";
import ProfilePage from "./profile";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// import FirebaseRead from "./firebase";
// import {
//   signInWithGoogle,
//   signInWithFB,
//   signOut,
//   // firebaseTest,
//   // firebaseGet,
// } from "./firebase";
// import SignInLocal from "./components/SignIn";
// import SignUpLocal from "./components/SignUp";
// import firebase from "firebase";
// import firebaseConfig from "./firebaseConfig";
// import { Router, Route, Link } from 'react-router'
// const app = firebase.apps.length
//   ? firebase.app()
//   : firebase.initializeApp(firebaseConfig);
// firebase.auth().onAuthStateChanged(function (user) {
//   if (user) {
//     // User is signed in.
//     document.querySelector("#status").innerHTML = "已登入";
//     console.log(user.email);
//   } else {
//     // No user is signed in.
//     document.querySelector("#status").innerHTML = "未登入，請點以下登入方式";
//   }
// });

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
ReactDOM.render(
  <React.StrictMode>
    {/* <FirebaseRead /> */}
    {/* <h1 id="status"></h1>
    <button onClick={signInWithGoogle}>Sign in with Google</button>
    <button onClick={signInWithFB}>Sign in with FaceBook</button>
    <button onClick={signOut}>Sign Out</button> */}
    {/* <button onClick={firebaseTest}>Test</button> */}
    {/* <button onClick={firebaseGet}>Get</button> */}
    {/* <button onClick={firebaseSnap}>On</button>
    <SignUpLocal />
    <SignInLocal /> */}
    <Router>
      <Switch>
        <Route path="/profile">
          <ProfilePage />
        </Route>
        <Route path="/board">
          {/* <Route path={`${match.path}/:topicId`}> */}
          <App />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
