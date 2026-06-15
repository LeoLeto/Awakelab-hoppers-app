import Hero from "@/components/landing/Hero";
import ValueProps from "@/components/landing/ValueProps";
import MarketPreview from "@/components/landing/MarketPreview";
import ConsultancyLogos from "@/components/landing/ConsultancyLogos";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <ConsultancyLogos />
      <ValueProps />
      <MarketPreview />
      <CTASection />
    </>
  );
}
