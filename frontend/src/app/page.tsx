import Header from "@/app/components/Header";
import HeroSection from "@/app/components/Hero";
import FeatureSlider from "@/app/components/FeatureSlides";
import FeatureGrid from "@/app/components/FeatureGrid";
import WhyUsSection from "@/app/components/WhySection";
import CTASection from "@/app/components/Cta";
import FooterSection from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeatureSlider />
      <FeatureGrid />
      <WhyUsSection />
      <CTASection />
      <FooterSection />  
    </>
  );
}
