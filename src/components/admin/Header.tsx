import { FaMoon, FaSun } from "react-icons/fa";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust path as needed
import toast, { Toaster } from "react-hot-toast";

interface HeaderProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
  toggleSidebar: () => void;
}

const Header = ({ toggleDarkMode, darkMode, toggleSidebar }: HeaderProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    setTimeout(() => setIsDropdownOpen(false), 200); // Delay to allow click on dropdown items
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
              
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="dark:bg-slate-50 dark:text-slate-700 rounded-full p-2"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <FaSun /> : <FaMoon className="text-gray-500" />}
              </button>
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    onBlur={handleBlur}
                    className="flex items-center space-x-2 p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full focus:outline-none"
                    aria-label="User menu"
                  >
                    <FiUser className="text-xl" />
                    <span className="hidden sm:inline text-sm font-medium dark:text-white">
                      {user?.email || "Admin"}
                    </span>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                      <Link
                        to="/admin-dashboard/profile"
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