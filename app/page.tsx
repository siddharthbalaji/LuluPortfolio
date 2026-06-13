import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Work from "@/components/Work";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Illustrations from "@/components/Illustrations";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Brand from "@/components/Brand";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";

export default function Page() {
  return (
    <>
      <Nav />
      <main className="relative z-[2]">
        <Hero />
        <Marquee />
        <Work />
        <About />
        <Experience />
        <Illustrations />
        <Skills />
        <Education />
        <Brand />
        <Contact />
      </main>
      <Footer />
      <Lightbox />
    </>
  );
}
