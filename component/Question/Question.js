import React from "react";
import Accordion from "./Accordion";
import { useRouter } from "next/router";
import styles from "../../styles/Accordion.module.css";
import HomeContent from '../../pages/mockDatas/homeapi/static.json'

export default function Question({ data }) {
  const { locale } = useRouter();

  return (
    <div className={styles.question}>
      {HomeContent.faq
        .filter((p) => p.languages_code === locale)
        .map((HomeContent, i) => {
          const { title } = HomeContent;
          return (
            <div key={i}>
              <h3>{title}</h3>
            </div>
          );
        })}

      <div className={styles.faqSides}>
        <div className={styles.main}>
          {data
            .filter((p) => p.languages_code === locale)
            .slice(0, 9)
            .map(({ id, answer, question }) => (
              <Accordion key={id} title={question} content={answer} />
            ))}
        </div>
      </div>
    </div>
  );
}
