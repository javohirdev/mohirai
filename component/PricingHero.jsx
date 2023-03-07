import { useRouter } from 'next/router';
import React, { useState } from 'react'
import styles from '../styles/PricingHero.module.css'

const PricingHero = ({ pricing_rates, pricing }) => {

  const [filtered, setFiltered] = useState('second')
  const data = pricing_rates.data[0];

  const { locale } = useRouter();

  let sec = locale === 'uz-UZ' ? 'sek' : locale === 'en-US' ? 'sec' : 'сек';
  let min = locale === 'uz-UZ' ? 'daq' : locale === 'en-US' ? 'min' : 'мин';
  let hour = locale === 'uz-UZ' ? 'soat' : locale === 'en-US' ? 'hr' : 'час';
  let som = locale === 'uz-UZ' ? 'so`m' : locale === 'en-US' ? 'som' : 'сум';

  const getCost = (price) => {
    return (
      <span>
        {
          filtered === 'minute' ?
            parseFloat(price.replace(',', '.') * 60).toFixed(1) :
            filtered === 'hour' ?
              parseFloat(price.replace(',', '.') * 3600).toFixed(1) :
              price
        }
        {' ' + som}/
        {filtered === 'second' ? sec : filtered === 'hour' ? hour : min}
      </span>
    )
  }

  return (

    pricing?.data.filter((p) => p.languages_code === locale)
      .map((value) =>
        <div className={styles.container} key={value.id}>
          <div className={styles.hero_blur}></div>
          <div className={styles.headWrapper}>
            <h3>{value?.title}</h3>

            <div className={styles.filter}>
              <span onClick={() => setFiltered('second')} className={filtered === 'second' ? styles.active : ''}>{value?.seconds}</span>
              <span onClick={() => setFiltered('minute')} className={filtered === 'minute' ? styles.active : ''}>{value?.minutes}</span>
              <span onClick={() => setFiltered('hour')} className={filtered === 'hour' ? styles.active : ''}>{value.hourly}</span>
            </div>
          </div>

          <div className={styles.bodyWarpper}>
            {/************************ Pay As You Go *****************/}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeader_head}>
                  <h4>{value.pay_as_you_go[0].title}</h4>
                  <img src='/umbrella.svg' alt="" />
                </div>

                <p>{value?.pay_as_you_go[0].sub_title}</p>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.flexsible}>
                  <p>{value?.pay_as_you_go[0].trnscription_title}</p>
                  <h5>{value?.pay_as_you_go[0].enhansed_title}</h5>
                  <div className={styles.cardBody_body}>
                    <p>{value?.pay_as_you_go[0].pre_recorded}</p>
                    {getCost(data.pay_as_you_go[0]?.first_price)}
                  </div>
                  <div className={styles.cardBody_body}>
                    <p>{value?.pay_as_you_go[0].live_streaming}</p>
                    {getCost(data.pay_as_you_go[0]?.second_price)}
                  </div>
                  <h5>{value?.pay_as_you_go[0].base_title}</h5>
                  <div className={styles.cardBody_body}>
                    <p>{value?.pay_as_you_go[0].pre_recorded}</p>
                    {getCost(data.pay_as_you_go[0]?.third_price)}
                  </div>
                  <div className={styles.cardBody_body}>
                    <p>{value?.pay_as_you_go[0].live_streaming}</p>
                    {getCost(data.pay_as_you_go[0]?.fourth_price)}
                  </div>
                </div>
                <a href="#plan">{value?.pay_as_you_go[0].all_included_text} <img src='/arrow-blue.svg' alt="" /></a>

                <button type='button'>{value?.pay_as_you_go[0].start_button_text}</button>
              </div>
            </div>
            {/************************ starter *****************/}
            <div className={styles.card + ' ' + styles.starter}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeader_head}>
                  <h4>{value.pay_as_you_go[1].title}</h4>
                  <img src="/rocket.svg" alt="" />
                </div>

                <p>{value?.pay_as_you_go[1].sub_title}</p>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.flexsible}>
                  <p>{value?.pay_as_you_go[1].trnscription_title}</p>
                  <h5>{value?.pay_as_you_go[1].enhansed_title}</h5>
                  <div className={styles.cardBody_body}>
                    <p>{value?.pay_as_you_go[1].pre_recorded}</p>
                    {getCost(data.starter[0]?.first_price)}
                  </div>
                  <div className={styles.cardBody_body}>
                    <p>{value?.pay_as_you_go[1].live_streaming}</p>
                    {getCost(data.starter[0]?.second_price)}
                  </div>
                  <h5>{value?.pay_as_you_go[1].base_title}</h5>
                  <div className={styles.cardBody_body}>
                    <p>{value?.pay_as_you_go[1].pre_recorded}</p>
                    {getCost(data.starter[0]?.third_price)}
                  </div>
                  <div className={styles.cardBody_body}>
                    <p>{value?.pay_as_you_go[1].live_streaming}</p>
                    {getCost(data.starter[0]?.fourth_price)}
                  </div>
                </div>
                <a href="#plan">{value?.pay_as_you_go[1].all_included_text} <img src='/arrow-blue.svg' alt="" /></a>

                <button type='button'>{value?.pay_as_you_go[1].start_button_text}</button>
              </div>
            </div>

            {/************************ growth *****************/}
            <div className={styles.card + ' ' + styles.growth}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeader_head}>
                  <h4>{value.pay_as_you_go[2].title}</h4>
                  <img src="/fire.svg" alt="" />
                </div>

                <p>{value?.pay_as_you_go[2].sub_title}</p>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.flexsible}>
                  <p>{value?.pay_as_you_go[2].trnscription_title}</p>
                  <h5>{value?.pay_as_you_go[2].enhansed_title}</h5>
                  <div className={styles.cardBody_body}>
                    <p>{value?.pay_as_you_go[2].pre_recorded}</p>
                    {getCost(data.growth[0]?.first_price)}
                  </div>
                  <div className={styles.cardBody_body}>
                    <p>{value?.pay_as_you_go[2].live_streaming}</p>
                    {getCost(data.growth[0]?.second_price)}
                  </div>
                  <h5>{value?.pay_as_you_go[2].base_title}</h5>
                  <div className={styles.cardBody_body}>
                    <p>{value?.pay_as_you_go[2].pre_recorded}</p>
                    {getCost(data.growth[0]?.third_price)}
                  </div>
                  <div className={styles.cardBody_body}>
                    <p>{value?.pay_as_you_go[2].live_streaming}</p>
                    {getCost(data.growth[0]?.fourth_price)}
                  </div>
                </div>
                <a href="#plan">{value?.pay_as_you_go[2].all_included_text}<img src='/arrow-blue.svg' alt="" /></a>

                <button type='button'>{value?.pay_as_you_go[2].start_button_text}</button>
              </div>
            </div>
            {/************************ premium *****************/}
            <div className={styles.card + ' ' + styles.premium}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeader_head}>
                  <h4>{value?.premium_title}</h4>
                  <img src="/crown.svg" alt="" />
                </div>

                <p>{value?.premium_text}</p>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.flexsible}>
                  <p>{value?.premium_content[0].get_access}</p>

                  <h5>{value?.premium_content[0].first_text}</h5>
                  <h5>{value?.premium_content[0].second_text}</h5>
                  <h5>{value?.premium_content[0].third_text}</h5>
                  <h5>{value?.premium_content[0].fourth_text}</h5>
                  <h5>{value?.premium_content[0].fifth_text}</h5>
                  <h5>{value?.premium_content[0].sixth_text}</h5>
                  <h5>{value?.premium_content[0].seventh_text}</h5>
                </div>
                <a href="#plan">{value?.premium_content[0].all_included_text} <img src='/arrow-blue.svg' alt="" /></a>

                <button type='button'>{value?.premium_content[0].get_in_touch_button}</button>
              </div>
            </div>
          </div>
        </div>
      )
  )
}

export default PricingHero