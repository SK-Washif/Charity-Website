import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Gallery from "@/components/sections/Gallery";
import ScholarshipPreview from "@/components/sections/ScholarshipPreview";
import Contact from "@/components/sections/Contact";
// import StatsSection from "@/components/sections/StatsSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* StatsSection */}
      <About />
      <Services />
      <Gallery />
      <ScholarshipPreview />
      <Contact />
    </>
  );
}