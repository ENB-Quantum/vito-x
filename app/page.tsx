import Hero from "@/components/Hero";
import About from "@/components/about";
import Albums from "@/components/albums";
import Extra from "@/components/extra";
import Footer from "@/components/footer";
import Video from "@/components/video";

export default function Home() {
  return (
    <div>
      <Hero />
      <Albums />
      <About />
      <Video />
      <Extra />
      <Footer />
    </div>
  );
}
