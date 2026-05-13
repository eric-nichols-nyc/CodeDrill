import { CompaniesSection } from "@/features/landing/components/companies-section";
import { ExploreSection } from "@/features/landing/components/explore-section";
import { FeaturesSection } from "@/features/landing/components/features-section";
import { Footer } from "@/features/landing/components/footer";
import { Header } from "@/features/landing/components/header";
import { HeroSection } from "@/features/landing/components/hero-section";
import { PlaygroundSection } from "@/features/landing/components/playground-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ExploreSection />
        <FeaturesSection />
        <PlaygroundSection />
        <CompaniesSection />
      </main>
      <Footer />
    </div>
  );
}
