import styles from "../styles/Header.module.css";
import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Chevron from "./Question/Chevron";
import NavbarApi from "../pages/mockDatas/navbarapi/static.json";

function Header({
    menuToggle,
    setMenuToggle,
    openLang,
    setOpenLang,
    setModal,
    setOpenPartnersModal
}) {
    const router = useRouter();
    const {asPath, locale} = router;
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) 
        return null;
    


    return NavbarApi.menu.filter((p) => p.languages_code === locale).map(({id, waitless, contact, pricing}) => (
        <div className={
                (menuToggle ? styles.header__main + ' ' + styles.header__menu_bg_grey + ' ' + styles.header__main_bg : styles.header__main + ' ' + styles.header__main_bg)
            }
            key={id}>
            <div className={
                styles.container
            }>
                <Link href="/">
                    <a> {
                        < img className = {
                            styles.header_logo
                        }
                        src = "/logo.svg" alt = "logo" />
                    } </a>
                </Link>

                <div className={
                        styles.header__main_wrapper
                    }
                    onClick={
                        (e) => e.stopPropagation()
                }>                   
                    <div onClick={
                            () => setOpenLang(!openLang)
                        }
                        className={
                            styles.mobileLan
                    }>
                        <span> {
                            locale.slice(0, 2) === "uz" ? (
                                <img src="/uz.png" alt="'uz"/>
                            ) : locale.slice(0, 2) === "ru" ? (
                                <img src="/ru.png" alt="ru"/>
                            ) : (
                                <img src="/eng.png" alt="'eng"/>
                            )
                        }
                            {
                            locale.slice(0, 2)
                        } </span>
                        <ul style={
                                {
                                    display: openLang ? "block" : 'none'
                                }
                            }
                            className={
                                styles.language
                        }>
                            <li>
                                <Link href={asPath}
                                    locale="uz-UZ">
                                    <a>uz</a>
                                </Link>
                            </li>
                            <li>
                                <Link locale="ru-RU"
                                    href={asPath}>
                                    <a>ru</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={asPath}
                                    locale="en-US">
                                    <a>en</a>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className={
                        styles.header_burger_menu
                    }>
                        {

                        (menuToggle ? <div onClick={
                            () => setMenuToggle(false)
                        }>
                            <img src="/x.png" alt="close icon"/>
                        </div> : <div className={
                                styles.menu_img
                            }
                            onClick={
                                () => setMenuToggle(true)
                        }>
                            <img src="/menu-white.png" alt="burger"/>
                        </div>)
                    } </div>
                </div>

                <div onClick={
                        (e) => {
                            e.stopPropagation();
                        }
                    }
                    className={
                        menuToggle ? styles.header__menu + ' ' + styles.header__menu_mobile : styles.header__menu
                }>

                    <div className={
                        styles.navMobileCopy + ' ' + styles.container
                    }>
                        <Link href="/">
                            <a>
                                <img className={
                                        styles.header_logo
                                    }
                                    src="/logo.svg"
                                    alt="logo"/>
                            </a>
                        </Link>

                        <div className={
                                styles.header__main_wrapper
                            }
                            onClick={
                                (e) => e.stopPropagation()
                        }>
                            <div className={
                                styles.header_burger_menu
                            }>
                                {
                                (menuToggle ? <div onClick={
                                    () => setMenuToggle(false)
                                }>
                                    <img src="/x.png" alt="close icon"/>
                                </div> : <div className={
                                        styles.menu_img
                                    }
                                    onClick={
                                        () => setMenuToggle(true)
                                }>
                                    <img src="/menu-white.png" alt="burger"/>
                                </div>)
                            } </div>
                        </div>
                    </div>

                    {/* <Link href="/pricing">
                        <a>{pricing}</a>
                    </Link> */}

                    <div className={
                        styles.waitlist
                    }>
                        <div onClick={
                            () => setOpenPartnersModal(true)
                        }>
                            {contact}
                            <Chevron className={
                                    styles.chevron + " rotate"
                                }
                                width={7}
                                height={11}
                                fill={"#ffffff"}/>
                        </div>
                        <button type="button"
                            onClick={
                                () => setModal(true)
                        }>
                            {waitless}</button>
                    </div>

                    <div onClick={
                            () => setOpenLang(!openLang)
                        }
                        className={
                            styles.item + " " + styles.lan
                    }>
                        <span> {
                            locale.slice(0, 2) === "uz" ? (
                                <img src="/uz.png" alt="'uz"/>
                            ) : locale.slice(0, 2) === "ru" ? (
                                <img src="/ru.png" alt="ru"/>
                            ) : (
                                <img src="/eng.png" alt="'eng"/>
                            )
                        }
                            {
                            locale.slice(0, 2)
                        } </span>

                        <ul style={
                                {
                                    display: openLang ? "block" : 'none'
                                }
                            }
                            className={
                                styles.language
                        }>
                            <li>
                                <Link href={asPath}
                                    locale="uz-UZ">
                                    <a>uz</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={asPath}
                                    locale="ru-RU">
                                    <a>ru</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={asPath}
                                    locale="en-US">
                                    <a>en</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    ));
}

export default Header;
