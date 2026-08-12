import Hero from "../components/home/Hero";
import About from "../components/home/About";
import ExperienceTimeline from "../components/home/ExperienceTimeline";
import Publications from "../components/home/Publications";
import Skills from "../components/home/Skills";
import Teaching from "../components/home/Teaching";
import Achievements from "../components/home/Achievements";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <ExperienceTimeline />
      <Publications />
      <Teaching />
      <Skills />
      <Achievements />
    </>
  );
}