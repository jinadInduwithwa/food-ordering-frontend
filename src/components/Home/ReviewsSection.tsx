import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "Home/avatar1.png",
    rating: 5,
    review:
      "The delivery was super fast and the food arrived hot. Exactly what I was looking for!",
    role: "Food Enthusiast",
  },
  {
    id: 2,
    name: "Michael Chen",
    image: "Home/avatar1.png",
    rating: 5,
    review:
      "Great variety of restaurants and excellent customer service. My go-to food delivery app!",
    role: "Regular Customer",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    image: "Home/avatar1.png",
    rating: 4,
    review:
      "The tracking feature is amazing! I always know exactly when my food will arrive.",
    role: "Food Blogger",
  },
  {
    id: 4,
    name: "David Kim",
    image: "Home/avatar1.png",
    rating: 5,
    review:
      "Outstanding service and the app is so easy to use. Highly recommended!",
    role: "Tech Professional",
  },
];

function ReviewsSection() {
  return (
    <section className="py-10 w-full bg-gray-50">
      <div className="max-w-7xl  mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read genuine reviews from our satisfied customers about their food
            delivery experience
          </p>
        </motion.div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet custom-bullet",
            bulletActiveClass:
              "swiper-pagination-bullet-active custom-bullet-active",
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-12 custom-swiper"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg h-[250px]"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">{review.name}</h3>
                    <p className="text-gray-500 text-sm">{review.role}</p>
                  </div>
                </div>
                <div className="mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 italic">"{review.review}"</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default ReviewsSection;
