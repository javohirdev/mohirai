import React, { useState, useRef } from "react";
import Chevron from "./Chevron";
import styles from "../../styles/Accordion.module.css";

function Accordion(props) {
  const [setActive, setActiveState] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const [setRotate, setRotateState] = useState("accordion__icon");

  const content = useRef(null);

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
    <div className={`accordion__section ${setActive}`}>
      <button className={`accordion ${setActive}`} onClick={toggleAccordion}>
        <div className={styles.accordion_title}>
          <p>{props.title}</p>
        </div>

        <div className='open'>
          {
            setActive ? <span></span> :
              <div>
                <h1></h1>
                <h2></h2>
              </div>
          }
        </div>
        {/* <Chevron className={`${setRotate}`} width={8} fill={"#8D53FD"} /> */}
      </button>
      <div
        ref={content}
        style={{ maxHeight: `${setHeight}` }}
        className="accordion__content"
      >
        <div
          className={styles.accordion_text}
          dangerouslySetInnerHTML={{ __html: props.content }}
        />
      </div>
    </div>
  );
}

export default Accordion;
