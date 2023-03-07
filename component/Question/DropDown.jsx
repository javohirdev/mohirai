import React, { useState, useRef } from "react";
import Chevron from "./Chevron";
import styles from "../../styles/Dropdown.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

function Dropdown(props) {
    const [setActive, setActiveState] = useState("");
    const [setHeight, setHeightState] = useState("0px");
    const [setRotate, setRotateState] = useState("accordion__icon");

    const router = useRouter();
    const content = useRef(null);

    let colors = (router.pathname === "/" || router.pathname === "/pricing") 

    function toggleAccordion() {
        setActiveState(setActive === "" ? "active" : "");
        setHeightState(
            setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
        );
        setRotateState(
            setActive === "active" ? "accordion__icon" : "accordion__icon rotate"
        );
    }

    return (
        <div
            className={colors? 'dropdown ' + styles.dropBg : 'dropdown'}
            onClick={(e) => e.stopPropagation()
            }>
            <button className={`accordion ${setActive}`} onClick={toggleAccordion}>
                <div
                    className={styles.accordion_title}
                >
                    <p>{props.title}</p>
                </div>

                <Chevron className={`${setRotate}` + ' ' + styles.Chevron} width={6} fill={'#fff'} />
                <Chevron className={`${setRotate}` + ' ' + styles.ChevronMG} width={6} fill={'#1717179d'} />
            </button>
            <div
                ref={content}
                style={{ maxHeight: `${setHeight}` }}
                className="accordion__content"
            >
                {
                    props.content.map((value, i) =>
                        <Link key={value} href={`/${props.title.slice(0, 7).toLowerCase()}/${i + 1}`}>
                            <a className={styles.accordion_text}
                                dangerouslySetInnerHTML={{ __html: value }}></a>
                        </Link>
                    )
                }
            </div>
        </div>
    );
}

export default Dropdown;
