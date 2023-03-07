import React from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Footer.module.css'
import FooterApi from '../pages/mockDatas/footerapi/static.json'
import Link from 'next/link'

export default function Footer() {
  const router = useRouter()
  const { locale } = router;

  return (

    FooterApi.footer
      .filter((p) => p.languages_code === locale)
      .map(({
        id, powered_by, guide, join_in_project, partners, descr, github, telegram, mozillo
      }) =>
        <footer className={(router.pathname === "/" || router.pathname === "/pricing") ? styles.footerBg + ' ' + styles.footer : styles.footer} key={id}>
          <div className="container__fluid">
            <div className={styles.footer__body}>
              <div className={styles.footer__main}>
                {/* {
                  (router.pathname === "/" || router.pathname === "/pricing") ?
                    <img className={styles.footer__logo} src="/logo.svg" alt='logofooter' /> :
                    <img className={styles.footer__logo} src="/newlogo.svg" alt='logofooter' />
                } */}
                {/* <div className={styles.powered}>
                  <h3>{powered_by}</h3>
                </div> */}
              </div>              
            </div>
            <h3>{descr}</h3>
          </div>
        </footer>
      )
  )
}
