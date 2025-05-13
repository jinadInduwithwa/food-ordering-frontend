import React from "react";
import { Link } from "react-router-dom";

// Define the type for each section
interface Feature {
  image: string;
  headline: string;
  subtitle: string;
  alt: string;
  link: string; // Added link property
}

interface FeatureSectionProps {
  features?: Feature[];
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  features = [
    {
      image: "../../assets/emp.webp", // Replace with your image path
      headline: "Feed your employees",
      subtitle: "Create a business account",
      alt: "Person using laptop with salad bowl",
      link: "/signup/business", // Navigate to business signup
    },
    {
      image: "/assets/images/restaurant.jpg", // Replace with your image path
      headline: "Your restaurant, delivered",
      subtitle: "Add your restaurant",
      alt: "Chef cooking on stove",
      link: "/resturent-signup", // Navigate to restaurant registration
    },
    {
      image: "/assets/images/delivery.jpg", // Replace with your image path
      headline: "Deliver with Uber Eats",
      subtitle: "Sign up to deliver",
      alt: "Delivery person on bicycle with Uber Eats bag",
      link: "/signup/delivery", // Navigate to delivery signup
    },
  ],
}) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive grid: 1 column on xs/sm, 3 columns on md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-left text-left"
            >
              {/* Image */}
              <div className="w-full h-40 sm:h-48 md:h-52 lg:h-56 mb-4 sm:mb-6">
                <img
                  src={feature.image}
                  alt={feature.alt}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
              {/* Headline */}
              <h6 className="text-md sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-3">
                {feature.headline}
              </h6>
              {/* Subtitle as a Link */}
              <Link
                to={feature.link}
                className="text-sm sm:text-base md:text-lg text-orange-600 hover:underline hover:text-orange-700 transition-colors"
              >
                {feature.subtitle}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;