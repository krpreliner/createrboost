import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <CTA />
      </main>
      
      <footer className="border-t border-white/10 py-12 text-center text-muted-foreground glass">
        <p>© 2026 CreatorBoost AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
