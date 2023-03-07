import React from 'react'
import PricingAllPlan from '../component/PricingAllPlan.jsx'
import PricingHero from '../component/PricingHero.jsx'

const Pricing = ({pricing_rates, pricing}) => {

    return (
        <div style={
            {scrollBehavior: 'smooth'}
        }>
            <PricingHero pricing_rates={pricing_rates} pricing={pricing}/>
            <PricingAllPlan pricing={pricing}/>
        </div>
    )
}

export default Pricing

export async function getServerSideProps() {

    const res = await fetch("https://admin.uzbekvoice.ai/items/pricing_rates");

    const res2 = await fetch("https://admin.uzbekvoice.ai/items/pricing_content_translations");

    const pricing_rates = await res.json();
    const pricing = await res2.json();

    return {
        props: {
            pricing_rates,
            pricing
        }
    };
}
