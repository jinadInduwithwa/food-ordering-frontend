import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaEnvelope,
} from "react-icons/fa";
import Slider from "react-slick"; // Import react-slick
import "slick-carousel/slick/slick.css"; // Import slick-carousel CSS
import "slick-carousel/slick/slick-theme.css"; // Import slick-carousel theme CSS
import { getMenuItemById, getProfile } from "../utils/api";
import { useCart } from "../context/CartContext";
import RelatedProducts from "./../components/UI/RelatedProducts";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  mainImage?: string;
  thumbnailImage?: string;
  description?: string;
  category?: string;
  isAvailable?: boolean;
  size?: string;
  pieces?: number;
  orderHours?: string;
}

const ViewMenuItem: React.FC = () => {
  const { restaurantId, menuItemId } = useParams<{
    restaurantId: string;
    menuItemId: string;
  }>();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItemToCart, toggleCart } = useCart();

  useEffect(() => {
    const fetchMenuItem = async () => {
      if (!menuItemId || !restaurantId) return;

      try {
        setLoading(true);
        const itemData = await getMenuItemById(restaurantId, menuItemId);
        setMenuItem(itemData);
        setError(null);
      } catch (err: Error | unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load menu item"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [restaurantId, menuItemId]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = async () => {
    if (!menuItem) return;
    try {
      const defaultAddress = await fetchDefaultAddress();
      console.log("Default Address:", defaultAddress);
      console.log("Attempting to add to cart:", {
        menuItemId: menuItem._id,
        restaurantId: restaurantId,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      });
      await addItemToCart(menuItem._id, quantity, restaurantId!);
      toggleCart(); // Open the cart after adding item
    } catch (error: unknown) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const fetchDefaultAddress = async () => {
    try {
      const profile = await getProfile();
      const defaultAddress = profile.address; // Assuming the address is returned in the profile
      console.log("Default Address:", defaultAddress);
      return defaultAddress;
    } catch (error) {
      console.error("Failed to fetch default address:", error);
      throw error;
    }
  };

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true, // Show dots for navigation
    infinite: true, // Loop the slideshow
    speed: 1000, // Transition speed (1 second for a slow effect)
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Auto-play the slideshow
    autoplaySpeed: 3000, // 3 seconds per slide
    arrows: true, // Show navigation arrows
    fade: true, // Use fade effect for a smoother transition
  };

  if (!restaurantId || !menuItemId) {
    return (
      <div className="text-center py-8 text-red-500">
        Invalid restaurant or menu item ID.
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!menuItem) {
    return <div className="text-center py-8">Menu item not found.</div>;
  }

  // Prepare images for the slideshow (filter out undefined/null images)
  const images = [
    menuItem.mainImage || "https://via.placeholder.com/500",
    menuItem.thumbnailImage || "https://via.placeholder.com/500",
  ].filter((img) => img !== null);

  return (
    <div className="w-full bg-white min-h-screen">
    

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 text-sm text-gray-600">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/shop" className="hover:underline">
          Shop
        </Link>{" "}
        /{" "}
        <Link
          to={`/restaurant/${restaurantId}/menu`}
          className="hover:underline"
        >
          {menuItem.category || "Menu"}
        </Link>{" "}
        / <span>{menuItem.name}</span>
      </div>

      {/* Main Section */}
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Slideshow Section */}
        <div className="w-full lg:w-1/2">
          {images.length > 0 ? (
            <Slider {...sliderSettings}>
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`${menuItem.name} - Image ${index + 1}`}
                    className="w-full h-auto object-cover rounded-lg shadow-md cursor-zoom-in transform transition-transform duration-300 hover:scale-110"
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <img
              src="https://via.placeholder.com/500"
              alt="Placeholder"
              className="w-full h-auto object-cover rounded-lg shadow-md cursor-zoom-in transform transition-transform duration-300 hover:scale-110"
            />
          )}
        </div>

        {/* Details Section */}
        <div className="w-full lg:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{menuItem.name}</h1>
          <p className="text-xl font-semibold text-gray-900">
            Rs. {menuItem.price.toFixed(2)}
          </p>
          <p className="text-gray-600">
            {menuItem.description || "No description available."}
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-200"
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-200"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            >
              Add to cart
            </button>
          </div>

          <p className="text-gray-600">
            Category:{" "}
            <Link
              to={`/restaurant/${restaurantId}/menu`}
              className="text-orange-600 hover:font-bold"
            >
              {menuItem.category || "Menu"}
            </Link>
          </p>

          <div className="flex items-center gap-5">
            <span className="text-gray-600">Share the product:</span>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 p-2 bg-gray-50 rounded-2xl"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-600 p-2 bg-gray-50  rounded-2xl"
            >
              <FaTwitter />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-700 p-2 bg-gray-50  rounded-2xl"
            >
              <FaPinterestP />
            </a>
            <a
              href="mailto:example@example.com"
              className="text-gray-500 hover:text-gray-700 bg-gray-50  p-2 rounded-2xl"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="container mx-auto px-4 py-8 ">
        <div className="border-t border-gray-300 pt-4">
          <div className="flex gap-4 mb-4">
            <button className="text-gray-800 font-semibold border-b-2 border-amber-600 pb-2">
              Description
            </button>
          </div>
          <div className="text-gray-600 space-y-2">
            <p>{menuItem.description || "No description available."}</p>
            {menuItem.size && menuItem.pieces && (
              <p>
                Size: {menuItem.size} / {menuItem.pieces} Pieces
              </p>
            )}
            {menuItem.orderHours && (
              <p>Orders accepted from {menuItem.orderHours}</p>
            )}
          </div>
        </div>
      </div>
      {/* Related heading: Related Products Section */}
      <RelatedProducts
        restaurantId={restaurantId}
        currentMenuItemId={menuItemId}
        category={menuItem.category}
      />
    </div>
  );
};

export default ViewMenuItem;
