import CategoryNav from "@/components/Landing Page/CategoryNav";
import Header from "@/components/Landing Page/Header";
import HeroSection from "@/components/Landing Page/HeroSection";
import PromoBanner from "@/components/Landing Page/PromoBanner";

const Home = () => {
  return (
    <div className="w-full">
      <PromoBanner />
      <Header />
      <CategoryNav />
      <HeroSection />
    </div>
  );
};

export default Home;
