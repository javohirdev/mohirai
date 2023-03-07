import { useState, useCallback, useRef } from "react";
import { transcribeAudio } from "./api";
import { useLatest } from "ahooks";
import { nanoid } from "nanoid";

/**
 * @returns Controls for the recording. Details of returned controls are given below
 *
 * @details `startRecording`: Calling this method would result in the recording to start. Sets `isRecording` to true
 * @details `stopRecording`: This results in a recording in progress being stopped and the resulting audio being present in `recordingBlob`. Sets `isRecording` to false
 * @details `togglePauseResume`: Calling this method would pause the recording if it is currently running or resume if it is paused. Toggles the value `isPaused`
 * @details `recordingBlob`: This is the recording blob that is created after `stopRecording` has been called
 * @details `isRecording`: A boolean value that represents whether a recording is currently in progress
 * @details `isPaused`: A boolean value that represents whether a recording in progress is paused
 * @details `recordingTime`: Number of seconds that the recording has gone on. This is updated every second
 */
export const useAudioRecorder = (stopOnSilence = true) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef();
  const recordingBlobRef = useRef();

  const chunkMsProcessed = useRef(0);
  const silenceStartedAtRef = useRef(0);
  const recordingStartedAtRef = useRef(0);
  const finalBlobRef = useRef();
  const startRecording = useCallback(() => {
    recordingStartedAtRef.current = Date.now();
    let disposed = false;
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: {
            ideal: false,
          },
          noiseSuppression: {
            ideal: false,
          },
          autoGainControl: {
            ideal: true,
          },
          sampleRate: 16000,
        },
      })
      .then((stream) => {
        setIsRecording(true);
        const recorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
          audioBitsPerSecond: 128000,
          bitsPerSecond: 128000,
        });
        mediaRecorder.current = recorder;
        recorder.start(200);

        recorder.addEventListener("dataavailable", async (event) => {
          const newBlob = new Blob(
            [recordingBlobRef.current, event.data].filter(Boolean),
            {
              type: event.data.type,
            }
          );
          chunkMsProcessed.current += 200;
          recordingBlobRef.current = newBlob;
          const duration = (Date.now() - recordingStartedAtRef.current) / 1000;
          if (duration > 25) {
            stopRecording();
          }
          if (
            chunkMsProcessed.current % 1000 === 0 &&
            mediaRecorder.current?.state !== "inactive"
          ) {
            finalBlobRef.current = newBlob;
          }
        });

        recorder.addEventListener("stop", async () => {
          chunkMsProcessed.current = 0;
          recordingBlobRef.current = null;
          setIsRecording(false);
        });

        const audioContext = new AudioContext();
        const sourceNode = audioContext.createMediaStreamSource(stream);

        const analyserNode = audioContext.createAnalyser();
        sourceNode.connect(analyserNode);

        analyserNode.fftSize = 1024 * 2;

        // analyserNode.smoothingTimeConstant = 0.8;

        const audioBuffer = new Float32Array(analyserNode.fftSize);

        function detectSilence() {
          if (disposed) return;
          analyserNode.getFloatTimeDomainData(audioBuffer);
          const sum = audioBuffer.reduce((acc, val) => acc + Math.abs(val), 0);
          const avg = sum / audioBuffer.length;
          if (avg < 0.01) {
            if (silenceStartedAtRef.current === 0) {
              silenceStartedAtRef.current = Date.now();
            }
            if (stopOnSilence) {
              if (
                Date.now() - silenceStartedAtRef.current > 3000 &&
                Date.now() - recordingStartedAtRef.current > 4000
              ) {
                stopRecording();
                return;
              }
            }
          } else {
            silenceStartedAtRef.current = 0;
          }
          requestAnimationFrame(detectSilence);
        }

        requestAnimationFrame(detectSilence);
      })
      .catch((err) => console.log(err));
    return () => {
      disposed = true;
    };
  }, [stopOnSilence]);

  const stopRecording = () => {
    if (mediaRecorder.current?.state !== "inactive")
      mediaRecorder.current?.stop();
    mediaRecorder.current?.stream.getTracks().forEach((t) => t.stop());
    setRecordingTime(0);
    setIsPaused(false);
    chunkMsProcessed.current = 0;
    silenceStartedAtRef.current = 0;
  };

  return {
    startRecording,
    stopRecording,
    isRecording,
    isPaused,
    recordingTime,
    blob: finalBlobRef,
  };
};
