import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";

interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  cuisine: string;
  deliveryTime: string;
}

const restaurants = [
  {
    id: 1,
    name: "Burger King",
    image: "/restaurants/burger-king.png",
    rating: 4.5,
    cuisine: "Fast Food",
    deliveryTime: "25-30 min",
  },
  {
    id: 2,
    name: "Pizza Hut",
    image: "/restaurants/pizza-hut.png",
    rating: 4.3,
    cuisine: "Italian",
    deliveryTime: "30-35 min",
  },
  {
    id: 3,
    name: "Subway",
    image: "/restaurants/subway.png",
    rating: 4.2,
    cuisine: "Sandwiches",
    deliveryTime: "20-25 min",
  },
  {
    id: 4,
    name: "KFC",
    image: "/restaurants/kfc.png",
    rating: 4.4,
    cuisine: "Chicken",
    deliveryTime: "25-30 min",
  },
  {
    id: 5,
    name: "Taco Bell",
    image: "/restaurants/taco-bell.png",
    rating: 4.1,
    cuisine: "Mexican",
    deliveryTime: "20-25 min",
  },
  // Add more restaurants as needed
];

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
  return (
    <motion.div
      className="flex-shrink-0 w-72 mx-4  bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="relative h-48 ">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg text-sm font-semibold text-gray-700">
          ⭐️ {restaurant.rating}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {restaurant.name}
        </h3>
        <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">🕒 {restaurant.deliveryTime}</span>
          <span className="text-orange-600 font-semibold">Order Now</span>
        </div>
      </div>
    </motion.div>
  );
};

function RestaurantsSection() {
  return (
    <section className="relative py-16 w-full bg-gradient-to-b from-gray-50 to-gray-200">


      <div className="max-w-7xl mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Popular Restaurants
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Discover the best food from over 1,000 restaurants and fast delivery
            to your doorstep
          </p>
        </motion.div>
      </div>

      <div className="mb-8">
        <Marquee gradient={false} speed={40} pauseOnHover={true}>
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </Marquee>
      </div>

      <div className="mt-8">
        <Marquee
          gradient={false}
          speed={40}
          pauseOnHover={true}
          direction="right"
        >
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}

export default RestaurantsSection;
