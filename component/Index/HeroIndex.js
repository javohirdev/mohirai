import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/HeroIndex.module.css";
import Modal from "../Modal";
import { nanoid } from "nanoid";
import { useLatest } from "ahooks";
import {
  currentAudios,
  findAnswer,
  playAudio,
  transcribeAudio,
  translate,
  tts,
} from "../../utils/api";
import { useAudioRecorder } from "../../utils/use-audio-recorder";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// show 3 gray  dots when the message is loading
function AnimatedTypingIndicator() {
  return <div className={styles.typingAnimation}></div>;
}

export default function HeroIndex({ data }) {
  const { locale } = useRouter();
  const [modal, setModal] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [chatToggle, setChatToggle] = useState(false);

  const handleCloseModal = () => { setShowModal(false); };

  const openModal = (e) => {
    setModal(true);
    e.stopPropagation();
  };
  const [calleeAudios, setCalleeAudios] = useState({});

  const [conversation, setConversation] = useState([]);
  const conversationRef = useLatest(conversation);
  const [answering, setAnswering] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [recording, setRecording] = useState(false);
  const recorderControls = useAudioRecorder();

  const finalConversation = [
    ...conversation,
    ...(answering
      ? [
        {
          text: <AnimatedTypingIndicator />,
          author: "AI",
        },
      ]
      : []),
    // ...(recorderControls.isRecording
    //   ? [
    //       {
    //         text: recorderControls.transcription,
    //         author: "Human",
    //       },
    //     ]
    //   : []),
    ...(transcribing
      ? [
        {
          text: <AnimatedTypingIndicator />,
          author: "Human",
        },
      ]
      : []),
  ].reverse();

  useEffect(() => {
    if (!recorderControls.isRecording && recorderControls.blob.current) {
      (async () => {
        const audioUrl = URL.createObjectURL(recorderControls.blob.current);
        setCalleeAudios((prev) => {
          return {
            ...prev,
            [nanoid()]: audioUrl,
          };
        });

        setTranscribing(true);
        try {
          const transcription = await transcribeAudio(
            recorderControls.blob.current
          );
          if (transcription !== "") {
            const enTranscription = await translate(transcription, "uz", "en");
            setTranscribing(false);
            if (transcription.replaceAll(" ", "").length > 0) {
              const newConversation = [
                ...conversationRef.current,
                {
                  text: transcription,
                  enText: enTranscription,
                  audio: audioUrl,
                  author: "Human",
                },
              ];
              setConversation(newConversation);
              setAnswering(true);
              const answerEn = await findAnswer(newConversation);
              if (answerEn.trim().length > 0) {
                const answerUz = await translate(answerEn, "en", "uz");
                const answerAudio = await tts(answerUz);
                setConversation([
                  ...newConversation,
                  {
                    text: answerUz,
                    enText: answerEn,
                    author: "AI",
                    audio: answerAudio,
                  },
                ]);
                await playAudio(answerAudio);
              }
            }
          }
        } finally {
          setTranscribing(false);
          setAnswering(false);
        }
      })();
    }
  }, [conversationRef, recorderControls.isRecording]);

  const MessageBubble = ({ text, audio }) => {
    return (
      <div
        onClick={() => {
          if (audio) {
            for (const audio of currentAudios) {
              if (!audio.paused) {
                audio.pause();
                return;
              }
            }

            playAudio(audio);
          }
        }}
      >
        <span className={styles.message}>{text}</span>
      </div>
    );
  };

  useEffect(() => {
    toast.warning(
      `
      Ushbu xizmatdan foydalanish orqali siz ovozli ma'lumotlaringizni yig'ish va qayta ishlashga rozilik bildirasiz,
      Agar siz bunga rozi bo'lmasangiz, iltimos, ushbu xizmatdan foydalanishdan saqlaning!
      `
    );
  }, []);

  return data.data
    .filter((p) => p.languages_code === locale)
    .map((value, i) => (
      <div key={i} className={styles.container} onClick={() => setModal(false)}>
        <ToastContainer limit={1} autoClose={8000}/>
        <div className={styles.block}>
          <div className={styles.hero_blur}></div>
          <div className={styles.content}>
            <h1>{value?.title}</h1>
            <p>{value?.subtitle}</p>
            <div className={styles.waitlist}>
              <button type="button" onClick={openModal}>
                {value?.call_action_button}
              </button>
            </div>
            {modal ? <Modal setModal={setModal} /> : null}
          </div>
          {chatToggle ? (
            <div className={styles.mic + " " + styles.chat}>
              <img className={styles.wave} src="/wave.gif" alt="mic" />
              <div className={styles.wrapperMain}>
                <div className={styles.warpperChat}>
                  {finalConversation.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={
                          item.author === "AI"
                            ? styles.messageWrapperStart
                            : styles.messageWrapperEnd
                        }
                      >
                        <MessageBubble
                          audio={item.audio}
                          author={item.author}
                          text={item.text}
                        />
                      </div>
                    );
                  })}
                  <div className={styles.recordAudio + " AudioRecorder"}>
                    <div className={styles.realRecordingImage}>
                      {recording ? (
                        <div
                          onClick={() => {
                            setTimeout(() => {
                              recorderControls.stopRecording();
                            }, 800);
                            setRecording(false);
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
                          <img src="/micIcon.svg" className={styles.play} />
                          <img src="/recordingBg.png" alt="mic" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.mic}>
              <div className={styles.micPictureWrapper}>
                <div
                  className={styles.micPicture}
                  onClick={() => {
                    setChatToggle(true);
                    (async () => {
                      const ttsAudio = await tts(
                        "Salom! men o`zbek tilidagi ilk sun`iy intellektman. Sizga qanday yordam bera olaman"
                      );
                      setConversation([
                        {
                          text: "Salom! men o`zbek tilidagi ilk sun`iy intellektman. Sizga qanday yordam bera olaman",
                          enText:
                            "Hello, I am Aziza, your AI assistant. How can I help you?",
                          audio: ttsAudio,
                          author: "AI",
                        },
                      ]);
                      playAudio(ttsAudio).then(() => {
                        recorderControls?.startRecording();
                      });
                    })();
                  }}
                >
                  <img src="/micIcon.svg" className={styles.ellips} />
                  <img
                    className={styles.recordBg}
                    src="/recordingBg.png"
                    alt="mic"
                  />
                </div>
                <span className={styles.textInfo}>{value?.try_me_text}</span>
                <div className={styles.micAnimation}>
                  <div class={styles.waves}></div>
                  <div class={styles.waves}></div>
                </div>
                <div className={styles.banner} style={{ display: showModal ? 'block' : 'none' }}>
                  <div className={styles.bannerMain}>
                  <button className={styles.closeButton} onClick={handleCloseModal}>
                    X
                  </button>
                  <img src="/mohirai.svg" className={styles.bannerLogo} alt="mohirdev" />

                    <p className={styles.bannerContent}>
                      Ayni damda foydalanuvchilar koʻpligi uchun
                      keyinroq urinib koʻring,
                      yoki <Link href="https://t.me/MohirAIChatBot" target="_blank" className={styles.mohirLink}><a>Mohir AI</a></Link> telegram botiga oʻting
                    </p>
                    <div className={styles.bannerButton}>
                      <Link href="https://t.me/MohirAIChatBot" target="_blank">
                        <a>Telegram botga o'tish</a>
                      </Link>
                      <img src="/telegram.png" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    ));
}
