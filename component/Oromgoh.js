import React from "react";
import styles from "../styles/Oromgoh.module.css";
import Link from "next/link";


import BusAnimation from "./BusAnimation";
import { useRouter } from "next/router";


export default function Oromgoh({ data }) {
  const { locale } = useRouter();
  const dates = data.filter((c) => c.languages_code === locale)
  const list = dates[0].camp_info;
  return (

    <div>
      {data
        .filter((c) => c.languages_code === locale)
        .map(
          ({
            camp_title,
            camp_start,
            start,
             camp_finish,
             finish
           
          
          }) => (
            <div className={styles.block}>
              <h1>{camp_title}</h1>

              <div className={styles.flex}>
                <div>
                  <h3>{start}</h3>
                  <h4>{camp_start}</h4>
                </div>

                <div>
                  <h3>{finish}</h3>
                  <h4>{camp_finish}</h4>
                </div>
              </div>

              <BusAnimation />
            </div>
          )
        )}
      <div className={styles.desc}>
      {/* <ul>
        {list.map(({ camp_info }) => (
         
            <li>
              <span>&#10003; </span> {camp_info}
            </li>
         
        ))}
         </ul> */}

      </div>

    </div>
  );
}
