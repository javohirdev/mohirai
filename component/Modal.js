import React, { useState } from "react";
import styles from "../styles/Modal.module.css";
import PartnersApi from "../pages/mockDatas/partnersapi/static.json";
import { useRouter } from "next/router";
import Input from "react-phone-number-input/input";
import ReCAPTCHA from "react-google-recaptcha";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function Modal({ setModal }) {

  const [name, setName] = useState("");
  const [checked, setChecked] = useState(false);
  const [number, setNumber] = useState('');
  const [btnStyle, setBtnStyle] = useState(null);
  const [isSend, setIsSend] = useState(false);

  const { locale } = useRouter();

  const buttonStyle = () => {
    if (name !== '') {
      setBtnStyle(true)
    } else {
      setBtnStyle(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name !== "" && number !== '') {

      fetch("https://admin.uzbekvoice.ai/items/waitlist_form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: number,
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
  };

  const [token, setToken] = useState(null);

  const handleTokenChange = (token) => {
    setToken(token);
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
                    <input onChange={(e) => setName(e.target.value)} type={'text'} id="name" placeholder={value.placeholder_name} />

                    <label htmlFor="number">{value.label_comment}</label>
                    <Input
                      id="number"
                      international
                      country="UZ"
                      defaultCountry="UZ"
                      withCountryCallingCode
                      maxLength="17"
                      value={number}
                      required
                      onChange={setNumber}
                      onKeyUp={buttonStyle}
                    />
                    <div className={styles.checkbox}>
                      <input onChange={(e) => setChecked(e.target.checked)} type={'checkbox'} />
                      <span>{value.descr}</span>
                    </div>

                    <div>
                      <ReCAPTCHA sitekey={`6LdNod0kAAAAAK232SzA4L9AftUhMM0SnFccF_a2`} onChange={handleTokenChange} />

                      <HCaptcha
                        sitekey={`9a098deb-3095-4202-97c0-347d8a1b43e2`}
                      />
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
