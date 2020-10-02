import React, { useState, useEffect, useLayoutEffect, useRef } from "react";

import * as ml5 from "ml5";

import TimeTracker from "../time-tracker/TimeTracker";
import ManIcon from "../icons/ManIcon";

import "./object-detector.css";

const ObjectDetector = () => {
  const [results, setResults] = useState([]);
  const [isWorkplaceOccupied, setWorkplaceOccupation] = useState(false);

  const setCanvasSize = (width, height) => {
    canvasRef.current.width = width;
    canvasRef.current.height = height;
  };

  useLayoutEffect(() => {
    (async () => {
      const capture = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const video = videoRef.current;

      if (!video) {
        return;
      }

      const { width, height } = video;
      video.srcObject = capture;
      setCanvasSize(width, height);
    })();
  }, []);
  useLayoutEffect(() => {
    detect();
  });

  useEffect(() => {
    setWorkplaceState();
    drawBandingBox();
  });

  const width = 640;
  const height = 480;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const isPersonPresent = () => results.some(({ label }) => label === "person");

  const setWorkplaceState = () => {
    setWorkplaceOccupation(isPersonPresent());
  };

  const detect = async () => {
    const objectDetector = await ml5.objectDetector("cocossd", {});
    objectDetector.detect(videoRef.current, (err, results) =>
      setResults(results ? [...results] : [])
    );
  };

  const drawBandingBox = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const filteredResults = filterResultsByPerson(results);

    // Clear part of the canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    ctx.drawImage(video, 0, 0, width, height);

    filteredResults.forEach(({ label, x, y, width: w, height: h }) => {
      const scale = canvas.width / width;

      ctx.strokeRect(x * scale, y * scale, w * scale, h * scale);
      ctx.strokeStyle = "green";
      ctx.lineWidth = 2;

      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "green";
      ctx.fillText(label, x + 4, y + 16);
    });
  };

  const filterResultsByPerson = (results) =>
    results.filter(({ label }) => label === "person");

  return (
    <div className="app-wrapper">
      <div className="header"></div>
      <div className="content-wrapper">
        <div className="main">
          <div className="webcam-wrapper">
            <div className="status">
              <div className="status-item">
                <div className="people-amount__wrapper">
                  <ManIcon></ManIcon>
                  <span className="people-amount">
                    {filterResultsByPerson(results).length}
                  </span>
                </div>
              </div>
              <div className="status-item">
                <div
                  className={
                    isWorkplaceOccupied
                      ? "status-indicator taken"
                      : "status-indicator empty"
                  }
                ></div>
              </div>
            </div>
            <canvas className="canvas" ref={canvasRef}></canvas>
            <video ref={videoRef} width="640" height="480" autoPlay></video>
          </div>
        </div>
        <div className="sidebar">
          <TimeTracker isWorkplaceOccupied={isWorkplaceOccupied}></TimeTracker>
        </div>
      </div>
      <div className="footer"></div>
    </div>
  );
};

export default ObjectDetector;
