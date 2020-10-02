import React, { useState, useEffect } from "react";

import * as ml5 from "ml5";

import "./image-classifier.css";

export const ImageClassifier = () => {
  let yolo;
  let status;
  let objects = [];
  let video;
  let canvas, ctx;
  let width = 480;
  let height = 360;

  const [result, setResult] = useState({});

  useEffect(() => {
    make();
    // Initialize the Image Classifier method with MobileNet passing the video
    // element as second argument
    ml5
      .imageClassifier("MobileNet", video)
      .then((classifier) => loop(classifier));

    // Call to classify, set the results in the component state,
    // call this function again to create a loop
    const loop = (classifier) => {
      classifier
        .classify(5, (e) => console.log("e: ", e))
        .then((results) => {
          console.log("RESULTS: ", results);
          setResult({
            label: results[0].label,
            probability: results[0].confidence.toFixed(4),
          });
          loop(classifier);
        });
    };
  }, [ml5]);

  async function make() {
    // get the video
    video = await getVideo();
    yolo = await ml5.YOLO(video, startDetecting);
    canvas = createCanvas(width, height);
    ctx = canvas.getContext("2d");
  }

  async function getVideo() {
    // Grab elements, create settings, etc.
    const videoElement = document.createElement("video");
    videoElement.setAttribute("style", "display: none;");
    videoElement.width = width;
    videoElement.height = height;
    document.body.appendChild(videoElement);

    // Create a webcam capture
    const capture = await navigator.mediaDevices.getUserMedia(
      { video: true },
      (localMediaStream) => (video.srcObject = localMediaStream),
      (error) => console.error(error)
    );
    videoElement.srcObject = capture;
    videoElement.play();

    return videoElement;
  }

  return (
    <div className="image-classifier">
      <section className="classifier__result">
        <span className="classifier__label">Label:</span>
        {result.label || "Loading..."}
      </section>

      <section className="classifier__result">
        <span className="classifier__probability">Probability:</span>
        {result.probability || "Loading..."}
      </section>

      <video ref={} width="320" height="240" autoPlay></video>
    </div>
  );
};

export default ImageClassifier;
