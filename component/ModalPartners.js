import React, { useState } from "react";
import styles from "../styles/ModalPartners.module.css";
import PartnersApi from "../pages/mockDatas/partnersapi/static.json";
import { useRouter } from "next/router";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import PhoneInput from "react-phone-input-2";
// import dotenv from 'dotenv';
// Load the environment variables from the .env file
// dotenv.config();

export default function ModalPartners({ setOpenPartnersModal }) {

  const [name, setName] = useState("");
  const [number, setNumber] = useState('');
  const [comment, setComment] = useState("");
  const [btnStyle, setBtnStyle] = useState(null);
  const [isSend, setIsSend] = useState(false);
  const [hCaptchaResponse, setHCaptchaResponse] = useState('');

  const { locale } = useRouter();

  const buttonStyle = () => {
    if (name !== '' && comment !== '') {
      setBtnStyle(true)
    } else {
      setBtnStyle(false)
    }
  }

  const token = "5898057424:AAHPSH1xom0rFNHCHYN_9MgVJzdizDctelA";
  const chad_id = -1001942371012;

  const handleHCaptchaVerify = (responseToken) => {
    setHCaptchaResponse(responseToken);
  }

  const isHCaptchaChecked = () => {
    return hCaptchaResponse !== '';
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name !== "" && number !== '' && comment !== "" && isHCaptchaChecked()) {

      fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
        async: true,
        crossDomain: true,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cache-control": "no-cache",
        },
        body: JSON.stringify({
          chat_id: chad_id,
          parse_mode: 'html',
          text:
            "Ism: " +
            name +
            "\nTelefon raqam: +" +
            number +
            "\nIzoh: " +
            comment,
        }),
      }).then(function (response) {
        console.log(response);
      }).catch(err => console.log(err));

      setName("");
      setComment("")
      setNumber("");
      setBtnStyle(false)
      setIsSend(true)
      setTimeout(() => {
        setOpenPartnersModal(false)
      }, 4000);
    }

  };

  return (
    PartnersApi.partners
      .filter((p) => p.languages_code === locale)
      .map(value =>
        <div key={value.id}>
          <div className={styles.modal_bg}>
            <div onClick={(e) => e.stopPropagation()} className={styles.modal_content}>

              <div className={styles.modal_close}>
                <h3>{value.title}</h3>
                <div onClick={() => setOpenPartnersModal(false)}>
                  <img src="/modal-times.svg" />
                </div>
              </div>

              {
                isSend ? <span className={styles.thanksMessage}>{value.thanks}</span> :
                  <form onSubmit={handleSubmit} className={styles.body}>
                    <label htmlFor="name">{value.label_name}</label>
                    <input onChange={(e) => setName(e.target.value)} type={'text'} id="name" placeholder={value.placeholder_name} />

                    <label htmlFor="number">{value.label_phone}</label>
                    <PhoneInput
                      id="number"
                      specialLabel=""
                      country={'uz'}
                      countryCodeEditable={false}
                      value={number}
                      required
                      onChange={(number) => {
                        setNumber(number);
                        buttonStyle();
                      }}
                      onKeyUp={buttonStyle}
                      enableAreaCodes={true}
                      placeholder="+998"
                      className={styles.input}
                    />

                    <label>{value.label_comment}</label>
                    <textarea
                      onKeyUp={buttonStyle}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      cols="50"
                      placeholder={value.placeholder_comment}
                      required
                    ></textarea>

                    <div className={styles.captcha}>
                      <HCaptcha
                        sitekey={`9a098deb-3095-4202-97c0-347d8a1b43e2`}
                        onVerify={handleHCaptchaVerify}
                      />
                      {isHCaptchaChecked() ? (<></>) : (<p>Captcha tekshirilmadi!</p>)}
                    </div>

                    <button className={btnStyle ? styles.activeBtn : ''} type="submit">{value.button}</button>
                  </form>
              }
            </div>
          </div>
        </div>
      )
  );
}
