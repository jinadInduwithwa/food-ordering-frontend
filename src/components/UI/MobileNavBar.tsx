import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";

const MobileNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const location = useLocation();
  // const isHomePage = location.pathname === "/" || location.pathname === "/home";
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Navigation Toggle */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-lg">
        <div className="flex justify-between items-center h-16 px-4">
          <Link to="/" className="text-2xl font-bold text-orange-600">
            FoodyX
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-orange-600"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-md transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 px-4">
          <Link
            to="/restaurants"
            className="text-gray-700 hover:text-orange-600 py-4 text-lg font-medium"
            onClick={() => setIsOpen(false)}
          >
            Restaurants
          </Link>
          <Link
            to="/dishes"
            className="text-gray-700 hover:text-orange-600 py-4 text-lg font-medium"
            onClick={() => setIsOpen(false)}
          >
            Dishes
          </Link>

          {isAuthenticated && user?.role === "CUSTOMER" ? (
            <>
              <Link
                to="/cart"
                className="flex items-center text-gray-700 hover:text-orange-600 py-4 text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                <HiOutlineShoppingBag className="mr-2" size={24} />
                Cart
              </Link>
              <Link
                to="/orders"
                className="text-gray-700 hover:text-orange-600 py-4 text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                My Orders
              </Link>
              <div className="flex items-center text-gray-700 py-4 text-lg font-medium">
                <FiUser className="mr-2" size={24} />
                {user.email}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-orange-600 py-4 text-lg font-medium"
              >
                <FiLogOut className="mr-2" size={24} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-gray-700 hover:text-orange-600 py-4 text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 hover:text-orange-600 py-4 text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileNavBar;
