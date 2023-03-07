import React, { useState } from "react";
import styles from "../styles/ModalPartners.module.css";
import PartnersApi from "../pages/mockDatas/partnersapi/static.json";
import { useRouter } from "next/router";
import Input from "react-phone-number-input/input";

export default function ModalPartners({ setOpenPartnersModal }) {

  const [name, setName] = useState("");
  const [number, setNumber] = useState('');
  const [comment, setComment] = useState("");
  const [btnStyle, setBtnStyle] = useState(null);
  const [isSend, setIsSend] = useState(false);

  const { locale } = useRouter();

  const buttonStyle = () => {
    if (name !== '' && comment !== '') {
      setBtnStyle(true)
    } else {
      setBtnStyle(false)
    }
  }

  const token = "5898057424:AAHPSH1xom0rFNHCHYN_9MgVJzdizDctelA";
  const chad_id = -1001865248088;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name !== "" && number !== '') {

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
            "\nTelefon raqam: " +
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

                    <label>{value.label_comment}</label>
                    <textarea
                      onKeyUp={buttonStyle}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      cols="50"
                      placeholder={value.placeholder_comment}
                    ></textarea>

                    <button className={btnStyle ? styles.activeBtn : ''} type="submit">{value.button}</button>
                  </form>
              }
            </div>
          </div>
        </div>
      )
  );
}
