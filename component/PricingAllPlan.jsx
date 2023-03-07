import { useRouter } from 'next/router';
import React from 'react'
import styles from '../styles/PricingAllPlan.module.css'

const PricingAllPlan = ({ pricing }) => {
    
    const { locale } = useRouter();
    
    console.log(pricing?.data.filter((p) => p.languages_code === locale)[0].left_text.split('\n'))
    return (
        pricing?.data.filter((p) => p.languages_code === locale)
            .map((value) =>
                <div key={value.id} className={styles.PricingAllPlan} id='plan'>

                    <h2>{value?.all_plans_include}</h2>
                    <div className={styles.wrapper}>
                        <div className={styles.left_section}>
                            <ul>
                                {
                                    value?.left_text.split('\n').map((item, i) => <li key={i}> <span></span>{item}</li>)
                                }
                            </ul>
                        </div>
                        <div className={styles.right_section}>
                            <ul>
                                {
                                    value?.right_text.split('\n').map((item, i) => <li key={i}> <span></span>{item}</li>)
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            )
    )
}

export default PricingAllPlan