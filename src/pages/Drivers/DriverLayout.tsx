import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FaMotorcycle, FaCar, FaTruck, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const DriverLayout: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-orange-600">
            Driver Dashboard
          </h2>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link
                to="/driver-dashboard"
                className={`flex items-center space-x-2 px-4 py-3 ${
                  isActive("/driver-dashboard")
                    ? "bg-orange-50 text-orange-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <FaMotorcycle className="text-orange-500" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/driver-dashboard/active-deliveries"
                className={`flex items-center space-x-2 px-4 py-3 ${
                  isActive("/driver-dashboard/active-deliveries")
                    ? "bg-orange-50 text-orange-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <FaCar className="text-orange-500" />
                <span>Active Deliveries</span>
              </Link>
            </li>
            <li>
              <Link
                to="/driver-dashboard/delivery-history"
                className={`flex items-center space-x-2 px-4 py-3 ${
                  isActive("/driver-dashboard/delivery-history")
                    ? "bg-orange-50 text-orange-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <FaTruck className="text-orange-500" />
                <span>Delivery History</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-red-500 hover:text-red-600 w-full px-4 py-2"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {location.pathname === "/driver-dashboard"
                ? "Dashboard"
                : location.pathname === "/driver-dashboard/active-deliveries"
                ? "Active Deliveries"
                : "Delivery History"}
            </h1>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DriverLayout;
