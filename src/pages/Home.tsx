import HeroSection from "@/components/Home/HeroSection";
import RestaurantsSection from "@/components/Home/RestaurantsSection";
import DeliverySection from "@/components/Home/DeliverySection";
import ReviewsSection from "@/components/Home/ReviewsSection";
// import FeatureSection from "@/components/Home/FeatureSection";

function Home() {
  return (
    <div className="w-full overflow-hidden">
      <HeroSection />
      <RestaurantsSection />
      <DeliverySection />
      <ReviewsSection />
      {/* <FeatureSection /> */}
    </div>
  );
}

export default Home;
