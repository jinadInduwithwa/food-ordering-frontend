import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface CartItem {
  _id: string;
  menuItemId: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
  mainImage?: string;
  thumbnailImage?: string;
}

const Cart: React.FC = () => {
  const {
    cartItems,
    cartTotal,
    updateItemQuantity,
    removeItemFromCart,
    clearCartItems,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const deliveryFee = 0.0;
  const discount = 0;
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    console.log("Cart items updated:", cartItems);
    console.log("Cart total:", cartTotal);
  }, [cartItems, cartTotal]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleImageError = (itemId: string) => {
    setImageError((prev) => ({ ...prev, [itemId]: true }));
  };

  const getImageUrl = (item: CartItem): string => {
    if (imageError[item._id]) {
      return "https://via.placeholder.com/500";
    }
    return (
      item.thumbnailImage || item.mainImage || "https://via.placeholder.com/500"
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="flex-grow lg:w-2/3">
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Cart Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Cart Items
              </h2>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCartItems}
                  className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Cart Items Table */}
            {cartItems.length === 0 ? (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-gray-500 text-lg mb-2">
                  Your cart is empty
                </div>
                <Link
                  to="/restaurants"
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Browse Menu
                </Link>
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4">Image</th>
                      <th className="text-left py-4 px-4">Details</th>
                      <th className="text-right py-4 px-4">Price</th>
                      <th className="text-center py-4 px-4">Quantity</th>
                      <th className="text-right py-4 px-4">Total</th>
                      <th className="py-4 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <motion.tr
                        key={item._id}
                        className="border-b"
                        variants={itemVariants}
                      >
                        <td className="py-4 px-4">
                          <div className="relative w-32 h-24 overflow-hidden rounded-lg">
                            <motion.img
                              src={getImageUrl(item)}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              initial={{ scale: 0.95, opacity: 0.8 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.2 + index * 0.1,
                              }}
                              whileHover={{ scale: 1.05 }}
                              onError={() => handleImageError(item._id)}
                            />
                            {item.quantity > 1 && (
                              <motion.div
                                className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                              >
                                {item.quantity}
                              </motion.div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <h3 className="font-medium text-gray-800 mb-1">
                            {item.name}
                          </h3>
                          {item.size && (
                            <p className="text-sm text-gray-500">
                              Size: {item.size}
                            </p>
                          )}
                          {item.pieces && (
                            <p className="text-sm text-gray-500">
                              {item.pieces} Pieces
                            </p>
                          )}
                        </td>
                        <td className="text-right py-4 px-4">
                          Rs. {item.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                updateItemQuantity(
                                  item.menuItemId,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                              <FaMinus size={12} />
                            </motion.button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                updateItemQuantity(
                                  item.menuItemId,
                                  item.quantity + 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                              <FaPlus size={12} />
                            </motion.button>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4 font-medium">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <motion.button
                            whileHover={{ scale: 1.1, color: "#EF4444" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeItemFromCart(item.menuItemId)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <FaTrash size={16} />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* Cart Summary Section */}
        <motion.div
          className="lg:w-1/3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Total Cart
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">Rs. {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery:</span>
                <span className="font-medium">
                  Rs. {deliveryFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium">Rs. {discount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-800 font-semibold">Total:</span>
                  <span className="text-xl font-bold text-orange-500">
                    Rs. {(cartTotal + deliveryFee - discount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Apply
                </motion.button>
              </div>

              {/* Checkout Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/checkout"
                  className="block w-full bg-orange-500 text-white text-center py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors mt-6"
                >
                  Checkout
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
