import { useState } from "react";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import MobileNavBar from "./MobileNavBar";
import { useAuth } from "@/context/AuthContext";
import { FiUser, FiLogOut } from "react-icons/fi";

function NavBar() {
  const [isScrolled] = useState(false);
  const [isInfoBarVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Redirect to home page after logout
    window.location.href = "/";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <>
      {/* Info Bar */}
      <div
        className={`hidden md:block bg-orange-600 text-white text-sm transition-all duration-300 ${"h-8"}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 mr-1" />
                <span>+94 76 123 4567</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">✉️</span>
                <span>support@foodyx.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="mr-1">🚚</span>
                <span>Free delivery on orders over Rs. 1000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav
        className={`hidden md:block fixed w-full ${
          isInfoBarVisible ? "top-8" : "top-0"
        } z-50 transition-all duration-300`}
      >
        <div
          className={`${
            isScrolled || !isHomePage
              ? "bg-white/95 backdrop-blur-md shadow-lg"
              : "bg-white/80 backdrop-blur-md"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Left Side - Logo */}
              <Link
                to="/"
                className={`text-2xl font-bold ${
                  isScrolled ? "text-orange-600" : "text-orange-600"
                } hover:text-orange-700 transition-colors`}
              >
                FoodyX
              </Link>

              {/* Center - Search Box (Only for non-delivery users) */}
              {user?.role !== "DELIVERY" && (
                <div className="flex-1 max-w-md mx-8">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Search for restaurants or dishes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200"
                    />
                    <button
                      type="submit"
                      className="absolute left-3 top-2.5 text-gray-500 hover:text-orange-600 transition-colors"
                    >
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              )}

              {/* Right Side - Navigation */}
              <div className="flex items-center space-x-8">
                {user?.role === "DELIVERY" ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">{user.email}</span>
                    <button
                      onClick={handleLogout}
                      className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 hover:scale-105 transform transition-all duration-200 flex items-center"
                    >
                      <FiLogOut className="mr-2" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/restaurants"
                      className={`hover:text-orange-600 transition-colors ${
                        isScrolled ? "text-gray-700" : "text-gray-700"
                      } font-medium hover:scale-105 transform transition-transform`}
                    >
                      Restaurants
                    </Link>
                    <Link
                      to="/dishes"
                      className={`hover:text-orange-600 transition-colors ${
                        isScrolled ? "text-gray-700" : "text-gray-700"
                      } font-medium hover:scale-105 transform transition-transform`}
                    >
                      Dishes
                    </Link>
                    {isAuthenticated && user?.role === "CUSTOMER" && (
                      <>
                        <Link
                          to="/cart"
                          className={`flex items-center hover:text-orange-600 transition-colors ${
                            isScrolled ? "text-gray-700" : "text-gray-700"
                          } font-medium hover:scale-105 transform transition-transform`}
                        >
                          <ShoppingCartIcon className="h-6 w-6 mr-1" />
                          Cart
                        </Link>
                        <Link
                          to="/orders"
                          className={`hover:text-orange-600 transition-colors ${
                            isScrolled ? "text-gray-700" : "text-gray-700"
                          } font-medium hover:scale-105 transform transition-transform`}
                        >
                          My Orders
                        </Link>
                      </>
                    )}
                    {isAuthenticated && user?.role === "CUSTOMER" ? (
                      <div className="relative group">
                        <button
                          className={`${
                            isScrolled ? "text-gray-700" : "text-gray-700"
                          } hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium flex items-center hover:scale-105 transform transition-transform`}
                        >
                          <FiUser className="mr-1" size={20} />
                          {user.email}
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <Link
                            to="/account"
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600 flex items-center transition-colors"
                          >
                            <FiUser className="mr-2" />
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600 flex items-center transition-colors"
                          >
                            <FiLogOut className="mr-2" />
                            Logout
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Link
                          to="/signin"
                          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 hover:scale-105 transform transition-all duration-200"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/signup"
                          className="bg-orange-600 text-white hover:bg-orange-700 px-4 py-2 rounded-md text-sm font-medium hover:scale-105 transform transition-all duration-200"
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNavBar />
    </>
  );
}

export default NavBar;
