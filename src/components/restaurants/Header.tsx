import { FaMoon, FaSun, FaPowerOff } from "react-icons/fa";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { getRestaurantById, updateRestaurantAvailability } from "@/utils/api";

interface HeaderProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
  toggleSidebar: () => void;
}

const Header = ({ toggleDarkMode, darkMode, toggleSidebar }: HeaderProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logo, setRestaurantLogo] = useState<string | null>(null);
  const [availability, setAvailability] = useState<boolean>(true);
  const [isToggling, setIsToggling] = useState<boolean>(false);

  // Fetch restaurant logo and availability
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        if (!user || !user.id) {
          throw new Error("User not authenticated or missing ID");
        }
        const response = await getRestaurantById(user.id);
        if (!response) {
          throw new Error("Restaurant data not found in response");
        }
        setRestaurantLogo(response.logo || null);
        setAvailability(response.availability ?? true);
      } catch (error: any) {
        console.error('Failed to fetch restaurant data:', error);
        toast.error(error.message || 'Failed to fetch restaurant data');
        setRestaurantLogo(null);
        setAvailability(true); // Fallback to default availability
      }
    };
    if (isAuthenticated && user) {
      fetchRestaurant();
    }
  }, [isAuthenticated, user]);

  // Handle availability toggle with optimistic update
  const handleToggleAvailability = async () => {
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to update availability.");
      return;
    }

    setIsToggling(true);
    // Optimistically update the UI
    const previousAvailability = availability;
    const newAvailability = !availability;
    setAvailability(newAvailability);

    try {
      const response = await updateRestaurantAvailability(newAvailability);
      if (!response) {
        throw new Error("Restaurant data not found in response");
      }
      // Confirm server state (optional, since UI is already updated)
      setAvailability(response.availability);
      toast.success(`Restaurant is now ${newAvailability ? 'available' : 'unavailable'}.`);
    } catch (error: any) {
      // Revert to previous state on error
      setAvailability(previousAvailability);
      console.error('Toggle availability error:', error);
      toast.error(error.message || 'Failed to update availability');
    } finally {
      setIsToggling(false);
    }
  };

  const handleLogout = async () => {
    if (!isAuthenticated) {
      toast.error("You are not logged in.");
      return;
    }

    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsDropdownOpen(false);
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  const handleBlur = () => {
    setTimeout(() => setIsDropdownOpen(false), 200);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:ring-gray-200 focus:outline-none focus:ring-2 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
              >
                <HiOutlineMenuAlt2 className="text-2xl" />
              </button>
              <Link to="/resturent-dashboard/overview" className="flex items-center ms-2 md:me-24">
                <img
                  src={logo || '/images/default-logo.png'}
                  alt="Restaurant Logo"
                  className="h-8 w-8 rounded-full object-cover mr-2 shrink-0 border border-gray-200 dark:border-gray-600"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Availability Toggle Button */}
              {isAuthenticated && user && (
                <button
                  onClick={handleToggleAvailability}
                  disabled={isToggling}
                  className={`flex items-center space-x-2 p-2 rounded-full ${
                    availability
                      ? 'bg-green-100 text-green-600 dark:bg-green-700 dark:text-green-200'
                      : 'bg-red-100 text-red-600 dark:bg-red-700 dark:text-red-200'
                  } ${isToggling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  aria-label={availability ? 'Set restaurant unavailable' : 'Set restaurant available'}
                >
                  <FaPowerOff className="text-lg" />
                  <span className="text-sm font-medium">
                    {isToggling ? 'Updating...' : availability ? 'Available' : 'Unavailable'}
                  </span>
                </button>
              )}
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="dark:bg-slate-50 dark:text-slate-700 rounded-full p-2"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <FaSun /> : <FaMoon className="text-gray-500" />}
              </button>
              {/* User Dropdown */}
              {isAuthenticated && user && (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    onBlur={handleBlur}
                    className="flex items-center space-x-2 p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full focus:outline-none"
                    aria-label="User menu"
                  >
                    <FiUser className="text-xl" />
                    <span className="hidden sm:inline text-sm font-medium dark:text-white">
                      {user.email || "User"}
                    </span>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                      <Link
                        to="/resturent-dashboard/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FiUser className="mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MdOutlinePowerSettingsNew className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;