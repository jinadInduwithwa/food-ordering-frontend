import resturent from "../../assets/images/get-start-resturent.webp";
import { motion } from "framer-motion";

function ResturentGetStartedSection() {
  return (
    <section className="py-16 md:py-20 w-full bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        {/* Left side - Animated Illustration */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 relative"
        >
          <motion.img
            src={resturent}
            alt="Restaurant Partner Setup"
            className="w-full h-auto max-w-md mx-auto"
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating elements */}
          <motion.div
            className="absolute top-8 left-8 bg-orange-100 rounded-full p-3"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-2xl">🍴</span>
          </motion.div>

          <motion.div
            className="absolute bottom-8 right-8 bg-green-100 rounded-full p-3"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <span className="text-2xl">📋</span>
          </motion.div>
        </motion.div>

        {/* Right side - Content */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full md:w-1/2"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Get Started in Just{" "}
            <span className="text-orange-600">3 Steps</span>
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-start space-x-4"
            >
              <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                <span className="text-2xl">1️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Tell Us About Your Restaurant</h3>
                <p className="text-gray-600">
                  Share basic details like your restaurant’s name, location, cuisine type, and contact information. This helps us set up your profile and connect you with hungry customers in your area.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex items-start space-x-4"
            >
              <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                <span className="text-2xl">2️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Menu</h3>
                <p className="text-gray-600">
                  Add your menu items, prices, and mouthwatering photos. Customize options and set availability to showcase what makes your restaurant special—our team can assist with optimization!
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="flex items-start space-x-4"
            >
              <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                <span className="text-2xl">3️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Access Restaurant Dashboard & Go Live</h3>
                <p className="text-gray-600">
                  Once approved, log into your Restaurant Dashboard to manage orders, track performance, and adjust settings. You’ll be live on FoodyX, ready to serve customers in no time!
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ResturentGetStartedSection;