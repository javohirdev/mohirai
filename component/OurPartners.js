import React, { useState } from "react";
import styles from "../styles/Ourpartners.module.css";
import { useRouter } from "next/router";
import ModalPartners from "./ModalPartners";

export default function OurPartners({ data }) {

  const { locale } = useRouter();
  const [openPartnersModal, setOpenPartnersModal] = useState(false);

  const openModal = (e) => {
    e.stopPropagation()
    setOpenPartnersModal(true)
  }

  return (
    data?.data.filter((p) => p.languages_code === locale)
      .map(value =>
        <div key={value.id} className={styles.partners} onClick={() => setOpenPartnersModal(false)}>

          {
            openPartnersModal ? <ModalPartners setOpenPartnersModal={setOpenPartnersModal} /> : null
          }
          <div className={styles.detail}>
            <div>
              <h2>{value?.partnership_title}</h2>
              <p>{value?.partnership_text}</p>
              <button onClick={openModal}>{value?.partnership_button}
                <img src='/arrow-left-white.png' />
              </button>
            </div>
          </div>
          <div className={styles.imgunit}>
            <div className={styles.img_wrapper}>
              <div className={styles.blur_bg}></div>
              <img src="/puzzle.png" alt="puzzle" />
            </div>
          </div>
        </div>
      )
  );
}
