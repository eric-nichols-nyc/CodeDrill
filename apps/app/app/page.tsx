import { CompaniesSection } from "@/features/landing/components/companies-section";
import { ExploreSection } from "@/features/landing/components/explore-section";
import { FeaturesSection } from "@/features/landing/components/features-section";
import { Footer } from "@/features/landing/components/footer";
import { HeroSection } from "@/features/landing/components/hero-section";
import { LandingHeader } from "@/features/landing/components/landing-header";
import { PlaygroundSection } from "@/features/landing/components/playground-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
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
