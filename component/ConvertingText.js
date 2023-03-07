import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "../styles/ConvertingText.module.css";
import { tts } from "../utils/api";
const currentAudios = [];

const ConvertingText = ({ data }) => {
  const { locale } = useRouter();
  const [text, setText] = useState(null);
  const [pause, setPause] = useState("text");

  function playAudio(src) {
    const audio = new Audio(src);
    audio.play();
    currentAudios.push(audio);
    return audio;
  }

  function stopAudio(item) {
    for (const audio of currentAudios) {
      audio.pause();
      setPause("text");
    }
  }

  function continueAudio(item) {
    for (const audio of currentAudios) {
      audio.play();
      setPause("stop");
    }
  }

  const soundHandler = async (item) => {
    if (text) {
      const audio = await tts(text);
      playAudio(audio);
      setPause("stop");
      const dr = new Audio(audio);
      dr.addEventListener(
        "loadedmetadata",
        function () {
          let duration = dr.duration;
          setTimeout(() => {
            setPause("text");
          }, duration * 1000);
        },
        false
      );
    } else {
      const audio2 = await tts(
        data?.data.filter((p) => p.languages_code === locale)[0].tts_hint_text
      );
      playAudio(audio2);
      setPause("stop");
      const dr = new Audio(audio2);
      dr.addEventListener(
        "loadedmetadata",
        function () {
          let duration = dr.duration;
          setTimeout(() => {
            setPause("text");
          }, duration * 1000);
        },
        false
      );
    }
  };

  const onChange = (e) => {
    setText(e.target.value);
  };

  return data?.data
    .filter((p) => p.languages_code === locale)
    .map((value) => (
      <div key={value.id} className={styles.ConvertingSpeech}>
        <div className={styles.title}>
          <h3>
            {value?.tts_title}
            <span></span>
          </h3>
          <p>{value.tts_text}</p>
        </div>

        <div className={styles.speech_box}>
          <textarea
            onChange={onChange}
            placeholder={value?.tts_hint_text}
          ></textarea>
          {
            pause === "text" ? (
              <button onClick={() => soundHandler("text")} type="button">
                {value.listen_text}
              </button>
            ) : (
              // : pause === 'stop' ?
              <button onClick={() => stopAudio("stop")} type="button">
                {"uz-UZ" === locale
                  ? "Pauza"
                  : "en-US" === locale
                  ? "Pause"
                  : "Пауза"}
              </button>
            )
            // <button onClick={() => continueAudio()} type='button'>{'lis'}</button>
          }
        </div>
      </div>
    ));
};

export default ConvertingText;
