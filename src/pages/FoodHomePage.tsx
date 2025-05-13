import { useState } from "react";
import { motion } from "framer-motion";


// Sample Data
const categories = [
  { label: "All", icon: "🍔" },
  { label: "Ice Cream", icon: "🍦" },
  { label: "Wings", icon: "🍗" },
  { label: "Street Food", icon: "🌯" },
  { label: "Grocery", icon: "🛒" },
  { label: "Convenience", icon: "🛍️" },
];

const filters = [
  { label: "Pickup" },
  { label: "Offers" },
  { label: "Delivery fee" },
  { label: "Under 30 min" },
];

const allFoods = [
  // Example food items
  {
    id: 1,
    name: "Cappuccino",
    img: "../assets/images/coffee.jpg",
    price: 3.8,
    delivery: 39,
    time: 20,
    featured: true,
    bestSale: false,
    category: "Street Food",
    offer: "30% off (up to LKR 600)",
    restaurant: "Coffee By Urban Garden",
    restaurantId: "urban-garden",
  },
  {
    id: 2,
    name: "Rice & Curry",
    img: "../assets/images/spices.jpg",
    price: 4.0,
    delivery: 99,
    time: 25,
    featured: true,
    bestSale: true,
    category: "Grocery",
    offer: "Buy 1, Get 1 Free",
    restaurant: "Ceylon Spices Food",
  },
  {
    id: 3,
    name: "Ice Cream",
    img: "../assets/images/Ice Cream.jpg",
    price: 4.0,
    delivery: 99,
    time: 25,
    featured: true,
    bestSale: true,
    category: "Ice Cream",
    offer: "Buy 1, Get 1 Free",
    restaurant: "Creamy Delights",
  },
  {
    id: 4,
    name: "Pasta",
    img: "../assets/images/pasta.jpg",
    price: 4.0,
    delivery: 99,
    time: 25,
    featured: true,
    bestSale: true,
    category: "Street Food",
    offer: "Buy 1, Get 1 Free",
    restaurant: "Pasta House",
  },
  {
    id: 5,
    name: "Fried Chicken Wings",
    img: "../assets/images/Wings.jpg",
    price: 4.0,
    delivery: 99,
    time: 25,
    featured: true,
    bestSale: true,
    category: "Wings",
    offer: "Buy 1, Get 1 Free",
    restaurant: "Wing Factory",
  },
  // ...add more items
];

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, type: "spring", stiffness: 120, damping: 14 },
  }),
  hover: { scale: 1.04, boxShadow: "0 8px 32px rgba(255,140,0,0.15)" },
};

export default function FoodHomePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Filtering logic
  const filteredFoods = allFoods.filter((food) => {
    const matchCategory =
      selectedCategory === "All" || food.category === selectedCategory;
    const matchSearch = food.name
      .toLowerCase()
      .includes(search.toLowerCase());
    // Add more filter logic as needed
    return matchCategory && matchSearch;
  });

  const featuredFoods = filteredFoods.filter((f) => f.featured);
  const bestSaleFoods = filteredFoods.filter((f) => f.bestSale);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
        <br/>
        <br/>
        <br/>
        <br/>
     

      {/* Search Bar */}
      <div className="px-4 py-3 bg-white">
        <input
          className="w-full rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Search Eats"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Bar */}
      <div className="flex gap-4 px-4 py-2 overflow-x-auto bg-white">
        {categories.map((cat) => (
          <button
            key={cat.label}
            className={`flex flex-col items-center px-3 py-1 rounded-lg transition ${
              selectedCategory === cat.label
                ? "bg-orange-100 text-orange-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedCategory(cat.label)}
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-xs">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Filter Options */}
      <div className="flex gap-2 px-4 py-2 bg-white">
        {filters.map((filter) => (
          <button
            key={filter.label}
            onClick={() =>
              setActiveFilters((prev) =>
                prev.includes(filter.label)
                  ? prev.filter((f) => f !== filter.label)
                  : [...prev, filter.label]
              )
            }
            className={`px-4 py-1 rounded-full border transition ${
              activeFilters.includes(filter.label)
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-orange-50"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Offer Banner */}
      <motion.div
        className="fixed left-1/2 bottom-8 -translate-x-1/2 bg-white shadow-lg rounded-full flex items-center px-4 py-2 z-30"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-2xl mr-2">🍲</span>
        <span className="font-semibold">30% off (up to LKR 600)</span>
        <span className="mx-2 text-gray-500 text-xs">LKR 2,000 minimum. See offer.</span>
        <button className="ml-2 text-gray-500 hover:text-red-500 text-xl">&times;</button>
      </motion.div>

      {/* Featured Section */}
      <section className="px-4 mt-6">
        <h2 className="font-bold text-xl mb-3">Featured on FoodyX</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {featuredFoods.map((food, i) => (
            <motion.div
              key={food.id}
              className="min-w-[220px] bg-white rounded-xl shadow-lg overflow-hidden"
              custom={i}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
            >
              <img src={food.img} alt={food.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <div className="font-semibold">{food.name}</div>
                <div className="text-gray-500 text-xs flex items-center gap-2">
                  <span>₳{food.delivery} Delivery Fee</span>
                  <span>·</span>
                  <span>{food.time} min</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-semibold">{food.price}</span>
                </div>
                {food.offer && (
                  <div className="mt-2 inline-block bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs font-bold">{food.offer}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sale Section */}
      <section className="px-4 mt-8">
        <h2 className="font-bold text-xl mb-3">Best Sale Foods</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {bestSaleFoods.map((food, i) => (
            <motion.div
              key={food.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              custom={i}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
            >
              <img src={food.img} alt={food.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <div className="font-semibold">{food.name}</div>
                <div className="text-gray-500 text-xs flex items-center gap-2">
                  <span>₳{food.delivery} Delivery Fee</span>
                  <span>·</span>
                  <span>{food.time} min</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-semibold">{food.price}</span>
                </div>
                {food.offer && (
                  <div className="mt-2 inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{food.offer}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Foods Section */}
      <section className="px-4 mt-8">
        <h2 className="font-bold text-xl mb-3">All Foods</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredFoods.map((food, i) => (
            <motion.div
                key={food.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                custom={i}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
            >
                <img src={food.img} alt={food.name} className="w-full h-32 object-cover" />
                <div className="p-3">
                <div className="font-semibold">{food.name}</div>
                <div className="text-sm text-gray-500 mb-1">{food.restaurant}</div> {/* Restaurant name here */}
                <div className="text-gray-500 text-xs flex items-center gap-2">
                    <span>₳{food.delivery} Delivery Fee</span>
                    <span>·</span>
                    <span>{food.time} min</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-semibold">{food.price}</span>
                </div>
                {food.offer && (
                    <div className="mt-2 inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">
                    {food.offer}
                    </div>
                )}
                </div>
            </motion.div>
            ))}
            
        </div>
      </section>
    </div>
  );
}
