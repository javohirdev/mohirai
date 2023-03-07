import React from 'react'
import styles from '../styles/UnderstandMore.module.css'
import { useRouter } from 'next/router';

const UnderstandMore = ({ data }) => {
    const { locale } = useRouter();

    const getImage = (i) => {
        switch (i) {
            case 0: return <img src='chat.png' alt='img' />
            case 1: return <img src='goals-2.png' alt='img' />
            case 2: return <img src='copy.png' alt='img' />
            case 3: return <img src='goals-1.png' alt='img' />
            case 4: return <img src='sun.png' alt='img' />
            default: return <img src='chat-text.png' alt='img' />
        }
    }

    return (
        data.data.filter((p) => p.languages_code === locale)
            .map(value =>
                <div key={value.id} className={styles.ConvertingSpeech}>
                    <div className={styles.title}>
                        <h3>{value?.soon_title}
                            <span></span>
                        </h3>
                        {/* <p>Speech recognition
                            understanding features</p> */}
                    </div>

                    <div className={styles.speech_box}>
                        {
                            value.soon.map((item, i) => {
                                return (
                                    <div key={i} className={styles.card}>
                                        <div>
                                            <h4>{item?.soon_title}</h4>
                                            <p>{item?.soon_text}</p>
                                        </div>

                                        {getImage(i)}

                                        <button type='button'>{value?.coming_soon_text}</button>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
    )
}

export default UnderstandMore