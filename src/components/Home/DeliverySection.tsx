import { motion } from "framer-motion";

function DeliverySection() {
  return (
    <section className="py-20 w-full bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Animated Illustration */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <motion.img
            src="/Home/delivery-boy.png" 
            alt="Delivery Service"
            className="w-full h-auto max-w-lg mx-auto"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating elements */}
          <motion.div
            className="absolute top-10 left-10 bg-orange-100 rounded-full p-4"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-3xl">🛵</span>
          </motion.div>

          <motion.div
            className="absolute bottom-10 right-10 bg-green-100 rounded-full p-4"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <span className="text-3xl">📦</span>
          </motion.div>
        </motion.div>

        {/* Right side - Content */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Lightning Fast
            <span className="text-orange-600"> Delivery</span>
          </h2>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-start space-x-4"
            >
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">⚡️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Quick Delivery</h3>
                <p className="text-gray-600">
                  Get your food delivered in under 30 minutes or your money back
                  guaranteed
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex items-start space-x-4"
            >
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">🗺️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Real-time Tracking
                </h3>
                <p className="text-gray-600">
                  Track your delivery in real-time with our advanced GPS system
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="flex items-start space-x-4"
            >
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">💝</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Professional Service
                </h3>
                <p className="text-gray-600">
                  Our trained delivery partners ensure your food arrives fresh
                  and safe
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default DeliverySection;
