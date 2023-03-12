import React, { useState } from "react";
import styles from "../styles/Modal.module.css";
import PartnersApi from "../pages/mockDatas/partnersapi/static.json";
import { useRouter } from "next/router";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import PhoneInput from "react-phone-input-2";

export default function Modal({ setModal }) {

  const [name, setName] = useState("");
  const [checked, setChecked] = useState(false);
  const [number, setNumber] = useState('');
  const [btnStyle, setBtnStyle] = useState(null);
  const [isSend, setIsSend] = useState(false);
  const [hCaptchaResponse, setHCaptchaResponse] = useState('');
  const uzbekistanOperators = ['90', '91', '93', '94', '95', '97', '98', '99'];
  const firstTwoDigits = number.slice(0, 2);
  const isValidUzbekistanNumber = uzbekistanOperators.includes(firstTwoDigits);

  const { locale } = useRouter();

  const buttonStyle = () => {
    if (name !== '') {
      setBtnStyle(true)
    }
    else { 
      setBtnStyle(false)
    }
  }

  const handleHCaptchaVerify = (responseToken) => {
    setHCaptchaResponse(responseToken);
  }

  const isHCaptchaChecked = () => {
    return hCaptchaResponse !== '';
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name !== "" && isValidUzbekistanNumber !== '' && isHCaptchaChecked()) {

      fetch("https://admin.uzbekvoice.ai/items/waitlist_form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: isValidUzbekistanNumber,
          subscribe_checkbox: checked
        }),
      }).then(function (response) {
        console.log(response);
      }).catch(err => console.log(err));

      setName("");
      setNumber("");
      setChecked(false)
      setBtnStyle(false)
      setIsSend(true)
      setTimeout(() => {
        setModal(false)
      }, 4000);
    }

    console.log(`Submitting phone number: ${number}`);
  };

  return (
    PartnersApi.waitless
      .filter((p) => p.languages_code === locale)
      .map(value =>
        <div key={value.id}>
          <div className={styles.modal_bg} >
            <div onClick={(e) => e.stopPropagation()} className={styles.modal_content}>

              <div className={styles.modal_close}>
                <h3>{value.title}</h3>
                <div onClick={() => setModal(false)}>
                  <img src="/modal-times.svg" />
                </div>
              </div>

              {
                isSend ? <span className={styles.thanksMessage}>{value.thanks}</span> :
                  <form onSubmit={handleSubmit} className={styles.body}>
                    <label htmlFor="name">{value.label_name}</label>
                    <input
                      onChange={(e) => {
                        setName(e.target.value);
                        buttonStyle();
                      }}
                      type={'text'}
                      id="name"
                      placeholder={value.placeholder_name}
                    />
                    <label htmlFor="number">{value.label_comment}</label>
                    <PhoneInput
                      id="number"
                      specialLabel=""
                      country={'uz'}
                      countryCodeEditable={false}
                      value={number}
                      required
                      onChange={(value) => { setNumber(value) }}
                      onKeyUp={buttonStyle}
                      enableAreaCodes={true}
                      placeholder="+998"
                      className={styles.input}
                      pattern="[0-9]{9,15}"
                    />
                    <div className={styles.checkbox}>
                      <input onChange={(e) => setChecked(e.target.checked)} type={'checkbox'} />
                      <span>{value.descr}</span>
                    </div>

                    <div className={styles.captcha}>
                      <HCaptcha
                        sitekey={`9a098deb-3095-4202-97c0-347d8a1b43e2`}
                        onVerify={handleHCaptchaVerify}
                      />
                      {isHCaptchaChecked() ? (<></>) : (<p>Captcha tekshirilmadi!</p>)}
                    </div>

                    <button className={btnStyle ? styles.activeBtn : ''} disabled={!isValidUzbekistanNumber} type="submit">{value.button}</button>
                  </form>
              }
            </div>
          </div>
        </div>
      )
  );
}
