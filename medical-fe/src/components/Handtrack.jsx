import React, { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";

const HandTrackingWithImageCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isHandStill, setIsHandStill] = useState(false);  // Flag for hand still detection
  const [lastTimeDetected, setLastTimeDetected] = useState(0);  // Timestamp for hand detection
  const [capturedImage, setCapturedImage] = useState(null);

  const setupWebcam = async () => {
    const video = videoRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    video.srcObject = stream;
  };

  const loadModelAndDetect = async () => {
    const model = await handpose.load(); // Load the handpose model
    setModel(model);

    // Start detecting hands
    setInterval(async () => {
      if (videoRef.current) {
        const predictions = await model.estimateHands(videoRef.current); // Estimate hands in video
        setPredictions(predictions); // Update state with predictions

        if (predictions.length > 0) {
          const currentTime = Date.now();
          if (currentTime - lastTimeDetected > 1000) { // Check if hand is still for 1 second
            setIsHandStill(true);  // Set hand still flag
          }
          setLastTimeDetected(currentTime);  // Update last detected time
        } else {
          setIsHandStill(false);  // Reset flag if no hand is detected
        }
      }
    }, 100);
  };

  const captureHandImage = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const video = videoRef.current;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);  // Draw the video frame to the canvas
      const imageData = canvas.toDataURL("image/png"); // Capture image as PNG
      setCapturedImage(imageData); // Set the captured image to state
    }
  };

  useEffect(() => {
    setupWebcam();
    loadModelAndDetect();
  }, []);

  useEffect(() => {
    if (isHandStill) {
      captureHandImage();  // Capture image when hand is still
    }
  }, [isHandStill]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="640"
        height="480"
        style={{ transform: "rotateY(180deg)" }}
      ></video>
      
      <div>
        {predictions.length > 0 && (
          <ul>
            {predictions.map((hand, index) => (
              <li key={index}>
                Hand {index + 1}: {hand.landmarks.length} points detected
              </li>
            ))}
          </ul>
        )}
      </div>

      <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }}></canvas>

      <div>
        {capturedImage && (
          <div>
            <h3>Captured Hand Image</h3>
            <img src={capturedImage} alt="Captured Hand" width="320" />
          </div>
        )}
      </div>
    </div>
  );
};

export default HandTrackingWithImageCapture;
