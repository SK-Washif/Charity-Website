import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Gallery from "@/components/sections/Gallery";
import ScholarshipPreview from "@/components/sections/ScholarshipPreview";
import Contact from "@/components/sections/Contact";
import StatsSection from "@/components/sections/StatsSection";

// সিঙ্গেল-পেজ হোম: নেভবারের প্রতিটি আইটেম এখানে একটি id-যুক্ত সেকশনকে
// পয়েন্ট করে, আলাদা কোনো রুটে যেতে হয় না — পুরো সাইট এক পেজেই স্ক্রল
// করে দেখা যায়।
export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection/>
      <About />
      <Services />
      <Gallery />
      <ScholarshipPreview />
      <Contact />
    </>
  );
}
