import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProgramsSection from "@/components/ProgramsSection";
import TrainersSection from "@/components/TrainersSection";
import MembershipSection from "@/components/MembershipSection";
import BMICalculator from "@/components/BMICalculator";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProgramsSection />
      <TrainersSection />
      <MembershipSection />
      <BMICalculator />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
