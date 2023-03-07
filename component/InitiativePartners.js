import React from "react";
import styles from "../styles/InitiativePartners.module.css";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Scrollbar,
  Pagination,
  A11y,
  Autoplay,
  Controller,
} from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

export default function InitiativePartners(props) {  

  const { locale } = useRouter();

  const { data, new_partners } = props;  

  
  return (
    <div className={styles.initpartners}>
      {data.data
        .filter((p) => p.languages_code === locale)
        .map((value) => {
          return (
            <div key={value.id}>
              <div
                className={styles.black_bg}
              >
                <h3>{value?.partners_title}</h3>
              </div>

              <p className={styles.black_bg_p}>{value?.partners_text}</p>
            </div>
          );
        })}

      <div
        className={styles.sliders + ' initpartners ' + styles.card_bg}
      >
        <Swiper
          modules={[
            Navigation,
            Scrollbar,
            Autoplay,
            A11y,
            Pagination,
            Controller,
          ]}
          spaceBetween={20}
          slidesPerView={3}
          loop={true}
          navigation
          autoplay={true}
          speed={300}
          breakpoints={{
            0: {
              slidesPerView: 2,
              spaceBetween: 5,
            },
            580: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            900: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            1200: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1400: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
          }}
          scrollbar={{ draggable: true }}
        >
          {
            new_partners?.data.map(
              ({ id, partner_url, partner_logo, partner_name }) => (
                <SwiperSlide  key={id}>
                  {/* <div> */}
                    <a
                     className={styles.item} 
                      href={partner_url}
                      target="_blank"                      
                    >
                      <img
                        src={`https://admin.uzbekvoice.ai/assets/${partner_logo}`} alt='parners img'
                      />
                      {/* <span>{partner_name}</span> */}
                    </a>
                  {/* </div> */}
                </SwiperSlide>
              )
            )}
        </Swiper>
      </div>
    </div>
  );
}
