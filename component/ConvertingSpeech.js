import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useLatest } from "ahooks";
import styles from "../styles/ConvertingSpeech.module.css";
import { useAudioRecorder } from "../utils/use-audio-recorder";
import { transcribeAudio } from "../utils/api";

const currentAudios = [];

// show 3 gray  dots when the message is loading
function AnimatedTypingIndicator() {
  return <div className={styles.typingAnimation}></div>;
}

/*********** begin component **************/
const ConvertingSpeech = ({ data }) => {
  const { locale } = useRouter();

  const [conversation, setConversation] = useState([]);
  const [latestTranscription, setLatestTranscription] = useState("");
  const conversationRef = useLatest(conversation);
  const [transcribing, setTranscribing] = useState(false);
  const finalConversation = [
    ...conversation,
    ...(transcribing
      ? [
          {
            text: <AnimatedTypingIndicator />,
            author: "Human",
          },
        ]
      : []),
  ].reverse();
  const [recording, setRecording] = useState(false);
  const recorderControls = useAudioRecorder(false);
  useEffect(() => {
    if (!recorderControls.isRecording && recorderControls.blob.current) {
      (async () => {
        const transcription = await transcribeAudio(
          recorderControls.blob.current
        );
        if (transcription.replaceAll(" ", "").length > 0) {
          const newConversation = [
            ...conversationRef.current,
            {
              text: transcription,
            },
          ];
          setConversation(newConversation);
        }
      })();
    }
  }, [conversationRef, recorderControls.isRecording]);

  const MessageBubble = ({ text }) => {
    return (
      <div className={styles.answer_text}>
        <span>{text}</span>
      </div>
    );
  };

  return data.data
    .filter((p) => p.languages_code === locale)
    .map((value) => (
      <div key={value.id} className={styles.ConvertingSpeech}>
        <div className={styles.title}>
          <h3>
            {value?.stt_title}
            <span></span>
          </h3>
          <p>{value?.tts_text}</p>
        </div>

        <div className={styles.speech_box}>
          {recorderControls.isRecording ? (
            <div>
              <MessageBubble text={recorderControls.transcription} />
            </div>
          ) : null}
          {finalConversation.map((item, index) => {
            return (
              <div key={index} className={``}>
                <MessageBubble text={item.text} />
              </div>
            );
          })}
          <div className={styles.recorderIcon + " AudioRecorder"}>
            <div className={styles.realRecordingImage}>
              {recording ? (
                <div
                  onClick={() => {
                    setRecording(false);
                    setTimeout(() => {
                      recorderControls.stopRecording();
                    }, 800);
                  }}
                  className={styles.iconWrapper}
                >
                  <div className={styles.stopIcon}></div>
                  <img src="/recordingBg.png" alt="mic" />
                </div>
              ) : (
                <div
                  onClick={() => {
                    recorderControls.startRecording();
                    setRecording(true);
                  }}
                  className={styles.iconWrapper}
                >
                  <img src="/micIcon.svg" className={styles.ellips} />
                  <img src="/recordingBg.png" alt="mic" />
                </div>
              )}
            </div>
          </div>
          <p>{value?.speak_text}</p>
        </div>
      </div>
    ));
};

export default ConvertingSpeech;
