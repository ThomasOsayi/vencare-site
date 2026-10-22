import { AudienceProvider } from "@/components/AudienceContext";
import EmergencySequence from "@/components/EmergencySequence";
import Faq from "@/components/Faq";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InterestForm from "@/components/InterestForm";
import RevealObserver from "@/components/RevealObserver";
import { About, Dashboard, FinalCta, Footer, Insurers, Places, ReadyMark, Stats, Subscription } from "@/components/Sections";

export default function Home() {
  return (
    <AudienceProvider>
      <Header />
      <main>
        <Hero />
        <Places />
        <Stats />
        <EmergencySequence />
        <Subscription />
        <Dashboard />
        <ReadyMark />
        <Insurers />
        <About />
        <Faq />
        <InterestForm />
        <FinalCta />
      </main>
      <Footer />
      <RevealObserver />
    </AudienceProvider>
  );
}
