import React, { useEffect, useState } from "react";
import Slider from "../component/Carousel";
import ConvertingSpeech from "../component/ConvertingSpeech";
import ConvertingText from "../component/ConvertingText";
import FrequentlyCases from "../component/FrequentlyCases";
import HeroIndex from "../component/Index/HeroIndex";
import UnderstandMore from "../component/UnderstandMore";
import InitiativePartners from "../component/InitiativePartners";
import OurPartners from "../component/OurPartners";

export default function Index({ data, new_partners }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div>
      <HeroIndex data={data} />
      <ConvertingSpeech data={data} />
      <Slider data={data} />
      <ConvertingText data={data} />
      <FrequentlyCases data={data} />
      <UnderstandMore data={data} />
      <OurPartners data={data} />
      <InitiativePartners new_partners={new_partners} data={data} />
    </div>
  );
}

export async function getStaticProps() {
  let partnersResponse = null;
  try {
    partnersResponse = await fetch(
      "https://admin.uzbekvoice.ai/items/new_partners"
    );
  } catch (e) {
    console.error("Failed to load new partners", e);
  }
  let translationResponse = null;
  try {
    translationResponse = await fetch(
      "https://admin.uzbekvoice.ai/items/landing_page_translations"
    );
  } catch (e) {
    console.error("Failed to load translations", e);
  }

  const data =
    translationResponse?.status === 200
      ? await translationResponse.json()
      : { data: [] };
  const new_partners =
    partnersResponse?.status === 200
      ? await partnersResponse.json()
      : { data: [] };

  return {
    props: {
      new_partners,
      data,
    },
    revalidate: 3600,
  };
}
