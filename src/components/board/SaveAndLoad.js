/* eslint-disable react/prop-types */
import { fabric } from "fabric";

export default function SaveAndLoad(props) {
  const canvas = props.canvas;
  const name = props.name;
  let canvasToUpload;
  //addImage
  const imgEl = document.createElement("img");
  imgEl.src =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8vgrE9P-qzTv_GwbscTXwzP8YmVS3e95GLw&usqp=CAU";
  const addImage = (canvi) => {
    const Image = new fabric.Image(imgEl, {
      top: 150,
      left: 150,
      scaleX: 1,
      scaleY: 1,
    });
    canvi.add(Image);
    canvi.renderAll();
  };

  //saveAsJSON
  const saveAsJSON = () => {
    canvasToUpload = JSON.stringify(canvas.toJSON());
  };
  //saveToCloud
  // const saveToCloud = () => {
  //   canvasToUpload = JSON.stringify(canvas.toJSON());
  //   const app = firebase.apps.length
  //     ? firebase.app()
  //     : firebase.initializeApp(firebaseConfig);
  //   var db = firebase.firestore();
  //   db.collection("canvases")
  //     .doc("Test")
  //     .set({
  //       data: canvasToUpload,
  //       name: name,
  //       owner: "bbb@gmail.com",
  //       user: ["bbb@gmail.com"],
  //     })
  //     .then(function (docRef) {})
  //     .catch(function (error) {
  //       console.error("Error adding document: ", error);
  //     });
  // };
  //LoadFromJSON
  const LoadFromJSON = () => {
    canvas.loadFromJSON(canvasToUpload);
  };
  function output(formatType) {
    const dataURL = canvas.toDataURL({
      format: `image/${formatType}`,
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      multiplier: 0.5,
      quality: 0.1,
    });

    const img = document.createElement("img");
    img.src = dataURL;
    // document.body.appendChild(img);

    window.open(dataURL);
    // const Image = new fabric.Image(img, {
    //   top: 150,
    //   left: 150,
    //   scaleX: 2,
    //   scaleY: 2,
    // });
    // canvas.add(Image);
    // canvas.renderAll();
    // var storageRef = firebase
    //   .storage()
    //   .ref(
    //     "image_for_canvas/" +
    //       window.location.pathname.split("/")[2] +
    //       `.${formatType}`
    //   );
    // storageRef.put(img);

    const a = document.createElement("a");
    a.href = dataURL;
    a.download = `output.${formatType}`;
    document.body.appendChild(a);
    a.click();
    // document.body.removeChild(a);
  }
  return (
    <div>
      <button onClick={saveAsJSON}>Save as JSON</button>
      <button onClick={saveToCloud}>Save to cloud</button>
      <button onClick={LoadFromJSON}>Load</button>
      <button onClick={() => addImage(canvas)}>Upload Image</button>
      <div>
        <button
          id="outputJpgBtn"
          onClick={() => {
            output("jpeg");
          }}
        >
          匯出成 jpeg
        </button>
        <button
          id="outputPngBtn"
          onClick={() => {
            output("png");
          }}
        >
          匯出成 png
        </button>
      </div>
    </div>
  );
}
