import axios from "axios";

const URLS = {
  answer: "/answer",
  tts: "/speak",
  transcribe: "/transcribe",
  translate: "/translate",
};

export async function transcribeAudio(blob) {
  const baseUrl = `/api${URLS.transcribe}`;
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("blocking", "true");
  formData.append("model", "models/small-11.1-merged");
  const { data } = await axios.post(baseUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.result;
}

export async function translate(text, source, target) {
  const baseUrl = `/api${URLS.translate}`;
  const { data } = await axios.post(baseUrl, {
    text,
    source,
    target,
  });
  return data.result;
}

export async function tts(text) {
  const baseUrl = `/api${URLS.tts}`;
  const { data } = await axios.post(baseUrl, {
    text,
  });
  if (data.result != null) {
    return `/api${data.result}`;
  }
  throw new Error("Failed to tts");
}

export async function findAnswer(conversation) {
  const baseUrl = `/api${URLS.answer}`;
  const { data } = await axios.post(baseUrl, {
    messages: conversation.map((message) => {
      return {
        content: message.enText,
        role: message.author === "AI" ? "assistant" : "user",
      };
    }),
  });
  return data.result;
}

export const currentAudios = [];

export async function playAudio(src) {
  for (const audio of currentAudios) {
    audio.pause();
  }
  const audio = new Audio(src);
  audio.play();
  currentAudios.push(audio);

  return new Promise((resolve) => {
    audio.onended = () => {
      resolve();
    };
  });
}
