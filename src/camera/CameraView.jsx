import { useEffect, useRef, useState } from "react";

import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

import {
  analyzeEyes,
  analyzeHeadOrientation,
} from "../driverState/driverVision";

import { createEyeStateTracker } from "../driverState/eyeStateTracker";

import { createHeadOrientationTracker } from "../driverState/headOrientationTracker";

import {
  DRIVER_STATES,
  createDriverStateData,
} from "../driverState/driverState";

import { calculateDriverState } from "../driverState/driverStateEngine";

function CameraView({ active, onDriverStateChange }) {
  const videoRef = useRef(null);

  const faceLandmarkerRef = useRef(null);

  const animationFrameRef = useRef(null);

  const eyeTrackerRef = useRef(null);

  const headTrackerRef = useRef(null);

  const [cameraError, setCameraError] = useState("");

  const [faceStatus, setFaceStatus] = useState("Waiting");

  const [eyeData, setEyeData] = useState(null);

  const [eyeClosedDuration, setEyeClosedDuration] =
    useState(0);

  const [headDirection, setHeadDirection] =
    useState("FORWARD");

  const [headAwayDuration, setHeadAwayDuration] =
    useState(0);

  const [isDistracted, setIsDistracted] =
    useState(false);

  const [visionDriverState, setVisionDriverState] =
    useState(DRIVER_STATES.ALERT);

  if (!eyeTrackerRef.current) {
    eyeTrackerRef.current = createEyeStateTracker();
  }

  if (!headTrackerRef.current) {
    headTrackerRef.current =
      createHeadOrientationTracker();
  }

  useEffect(() => {
    if (!active) {
      setCameraError("");
      setFaceStatus("Waiting");
      setEyeData(null);
      setEyeClosedDuration(0);
      setHeadDirection("FORWARD");
      setHeadAwayDuration(0);
      setIsDistracted(false);
      setVisionDriverState(DRIVER_STATES.ALERT);

      eyeTrackerRef.current?.reset();
      headTrackerRef.current?.reset();

      onDriverStateChange?.(
        createDriverStateData({
          state: DRIVER_STATES.ALERT,
          confidence: 0,
          source: "CAMERA",
        })
      );

      return undefined;
    }

    let stream;
    let cancelled = false;

    const startCameraAndML = async () => {
      try {
        const vision =
          await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
          );

        const faceLandmarker =
          await FaceLandmarker.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath:
                  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                delegate: "GPU",
              },
              runningMode: "VIDEO",
              numFaces: 1,
            }
          );

        if (cancelled) {
          faceLandmarker.close();
          return;
        }

        faceLandmarkerRef.current =
          faceLandmarker;

        stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });

        if (!videoRef.current || cancelled) {
          stream
            .getTracks()
            .forEach((track) => track.stop());

          return;
        }

        videoRef.current.srcObject = stream;

        await videoRef.current.play();

        const detectFace = () => {
          if (
            cancelled ||
            !videoRef.current ||
            !faceLandmarkerRef.current
          ) {
            return;
          }

          const video = videoRef.current;

          if (video.readyState >= 2) {
            const result =
              faceLandmarkerRef.current.detectForVideo(
                video,
                performance.now()
              );

            if (result.faceLandmarks.length > 0) {
              setFaceStatus("Face Detected");

              const landmarks =
                result.faceLandmarks[0];

              const eyes =
                analyzeEyes(landmarks);

              setEyeData(eyes);

              const head =
                analyzeHeadOrientation(
                  landmarks
                );

              setHeadDirection(head.direction);

              const headState =
                headTrackerRef.current.update(
                  head.direction
                );

              setHeadAwayDuration(
                headState.durationMs
              );

              setIsDistracted(
                headState.isDistracted
              );

              const eyeState =
                eyeTrackerRef.current.update(
                  eyes.averageEyeOpenness
                );

              setEyeClosedDuration(
                eyeState.durationMs
              );

              const nextDriverState =
                calculateDriverState({
                  eyeState,
                  headState,
                });

              console.log("DRIVER STATES:", {
                eyeDrowsy: eyeState.isDrowsy,
                eyeDuration: Math.round(
                  eyeState.durationMs
                ),
                headDistracted:
                  headState.isDistracted,
                headDuration: Math.round(
                  headState.durationMs
                ),
                result: nextDriverState,
              });

              let confidence = 1;

              if (
                nextDriverState ===
                DRIVER_STATES.DROWSY
              ) {
                confidence = Math.min(
                  eyeState.durationMs / 3000,
                  1
                );
              } else if (
                nextDriverState ===
                DRIVER_STATES.DISTRACTED
              ) {
                confidence = Math.min(
                  headState.durationMs / 3000,
                  1
                );
              } else if (
                nextDriverState ===
                DRIVER_STATES.CRITICAL
              ) {
                confidence = Math.min(
                  Math.max(
                    eyeState.durationMs,
                    headState.durationMs
                  ) / 3000,
                  1
                );
              }

              setVisionDriverState(
                nextDriverState
              );

              onDriverStateChange?.(
                createDriverStateData({
                  state: nextDriverState,
                  confidence,
                  source: "CAMERA",
                })
              );
            } else {
              setFaceStatus(
                "No Face Detected"
              );

              setEyeData(null);

              setEyeClosedDuration(0);

              setHeadDirection("UNKNOWN");

              setHeadAwayDuration(0);

              setIsDistracted(false);

              eyeTrackerRef.current.reset();

              headTrackerRef.current.reset();

              setVisionDriverState(
                DRIVER_STATES.ALERT
              );

              onDriverStateChange?.(
                createDriverStateData({
                  state: DRIVER_STATES.ALERT,
                  confidence: 0,
                  source: "CAMERA",
                })
              );
            }
          }

          animationFrameRef.current =
            requestAnimationFrame(
              detectFace
            );
        };

        detectFace();
      } catch (error) {
        console.error(
          "Camera/MediaPipe error:",
          error
        );

        setCameraError(
          "Unable to start the camera or driver vision system."
        );

        setFaceStatus("Unavailable");
      }
    };

    startCameraAndML();

    return () => {
      cancelled = true;

      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      if (stream) {
        stream
          .getTracks()
          .forEach((track) => track.stop());
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
        faceLandmarkerRef.current = null;
      }

      eyeTrackerRef.current?.reset();
      headTrackerRef.current?.reset();
    };
  }, [active, onDriverStateChange]);

  return (
    <div className="camera-view">
      <div className="camera-header">
        <h2>📷 Driver Camera</h2>

        <span>
          {active
            ? "CAMERA ACTIVE"
            : "CAMERA STANDBY"}
        </span>
      </div>

      {active && cameraError ? (
        <p>{cameraError}</p>
      ) : active ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
          />

          <p>
            Vision Status: {faceStatus}
          </p>

          {eyeData?.averageEyeOpenness !== null &&
            eyeData?.averageEyeOpenness !==
              undefined && (
              <p>
                Eye Openness:{" "}
                {eyeData.averageEyeOpenness.toFixed(
                  3
                )}
              </p>
            )}

          <p>
            Low Eye Openness Duration:{" "}
            {Math.round(eyeClosedDuration)} ms
          </p>

          <p>
            Head Direction: {headDirection}
          </p>

          <p>
            Looking Away Duration:{" "}
            {Math.round(headAwayDuration)} ms
          </p>

          <p>
            Distraction:{" "}
            {isDistracted ? "YES" : "NO"}
          </p>

          <p>
            Vision Driver State:{" "}
            {visionDriverState}
          </p>
        </>
      ) : (
        <p>
          Camera will activate when the drive begins.
        </p>
      )}
    </div>
  );
}

export default CameraView;
