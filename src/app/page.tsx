import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CTASection from "@/components/landing/CTASection";
import ProductShowcase from "@/components/landing/ProductShowcase";

export default async function HomePage() {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch {
    // Not logged in
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
      <Navbar user={user} />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ProductShowcase />
      <CTASection />
      <Footer />
    </main>
  );
}
