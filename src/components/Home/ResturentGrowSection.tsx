import { motion } from "framer-motion";

const ResturentGrowSection = () => {
  return (
    <section className="py-20 w-full bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How FoodyX  Works for{" "}
            <span className="text-orange-600">Restaurant Partners</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Partner with FoodyX to reach more customers and grow your business with our seamless delivery platform.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 - Customers Order */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-md p-6 shadow-lg"
          >
            <motion.div
              className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-3xl">🍽️</span>
            </motion.div>
            <h3 className="text-xl font-semibold text-center mb-3">Customers Order</h3>
            <p className="text-gray-600 text-center">
              A customer finds your restaurant and places an order through the Uber Eats app.
            </p>
          </motion.div>

          {/* Card 2 - You Prepare */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-md p-6 shadow-lg"
          >
            <motion.div
              className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-3xl">👨‍🍳</span>
            </motion.div>
            <h3 className="text-xl font-semibold text-center mb-3">You Prepare</h3>
            <p className="text-gray-600 text-center">
              Your restaurant accepts and prepares the order.
            </p>
          </motion.div>

          {/* Card 3 - Delivery Partners Arrive */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white rounded-md p-6 shadow-lg"
          >
            <motion.div
              className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-3xl">🛵</span>
            </motion.div>
            <h3 className="text-xl font-semibold text-center mb-3">Delivery Partners Arrive</h3>
            <p className="text-gray-600 text-center">
              Delivery people using the Uber platform pick up the order from your restaurant, then deliver it to the customer.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ResturentGrowSection
