import { Link, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiBook,
  FiSettings,
  FiPieChart,
  FiUser,
  FiDivide,
  FiUsers,
  FiHome,
  FiSunset,
} from "react-icons/fi";
import { MdPayments, MdOutlinePowerSettingsNew, MdOutlineRestaurantMenu  } from "react-icons/md";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

interface SubMenuItem {
  path: string;
  title: string;
}

interface MenuItem {
  path?: string; // Made optional since Logout doesn't need a path
  title: string;
  icon: JSX.Element;
  subItems?: SubMenuItem[];
  onClick?: () => void; // Added for actions like logout
}

const menuItems: MenuItem[] = [
  { path: "/resturent-dashboard/overview", title: "Overview", icon: <FiPieChart /> },
  {
    path: "/resturent-dashboard/orders",
    title: "Orders",
    icon: <FiSunset />,
    subItems: [
      { path: "/resturent-dashboard/orders/new", title: "New Orders" },
      { path: "/resturent-dashboard/orders/confirme", title: "Confirme Order" },
      { path: "/resturent-dashboard/orders/preparing", title: "Preparing Orders" },
      { path: "/resturent-dashboard/orders/ready", title: "Ready Orders" },   
      { path: "/resturent-dashboard/orders/out-for-delivery", title: "Out For Delivery" },
      { path: "/resturent-dashboard/orders/completed", title: "Complete Orders" },
      { path: "/resturent-dashboard/orders/canceled", title: "Canceled Orders" },   
    ],
  },
  {
    path: "/resturent-dashboard/menu-management",
    title: "Menu Management",
    icon: <FiBook />,
    subItems: [
      { path: "/resturent-dashboard/menu-management/all", title: "All Menu Item" },
      { path: "/resturent-dashboard/menu-management/manage", title: "Manage Menu Item" },
      { path: "/resturent-dashboard/menu-management/add", title: "Add New Menu Item" },
    ],
  },
  {
    path: "/resturent-dashboard/category",
    title: "Menu Category Management",
    icon: <MdOutlineRestaurantMenu  />,
    subItems: [
      { path: "/resturent-dashboard/category/manage", title: "Manage Category" },
      { path: "/resturent-dashboard/category/add", title: "Add New Category" },
    ],
  },
  {
    path: "/resturent-dashboard/promotions",
    title: "Promotions & Discounts",
    icon: <FiDivide />,
    subItems: [
      { path: "/resturent-dashboard/promotions/create", title: "Create Promotion" },
      { path: "/resturent-dashboard/promotions/active", title: "Active Promotions" },
    ],
  },
  {
    path: "/resturent-dashboard/customers",
    title: "Customers",
    icon: <FiUsers />,
    subItems: [
      { path: "/resturent-dashboard/customers/feedback", title: "Customer Feedback" },
      { path: "/resturent-dashboard/customers/loyalty", title: "Loyalty Programs" },
    ],
  },
  {
    path: "/resturent-dashboard/earnings",
    title: "Earnings & Payments",
    icon: <MdPayments />,
    subItems: [
      { path: "/resturent-dashboard/earnings/daily", title: "Daily/Weekly Earnings" },
      { path: "/resturent-dashboard/earnings/payouts", title: "Payouts" },
    ],
  },
  {
    path: "/resturent-dashboard/settings",
    title: "Business Settings",
    icon: <FiHome />,
    subItems: [
      { path: "/resturent-dashboard/settings/profile", title: "Profile & Store Info" },
      { path: "/resturent-dashboard/settings/delivery", title: "Delivery Settings" },
      { path: "/resturent-dashboard/settings/staff", title: "Staff Management" },
    ],
  },
  {
    path: "/resturent-dashboard/reports",
    title: "Reports & Analytics",
    icon: <FiCalendar />,
    subItems: [
      { path: "/resturent-dashboard/reports/sales", title: "Sales Reports" },
      { path: "/resturent-dashboard/reports/behavior", title: "Customer Behavior" },
    ],
  },
  {
    path: "/resturent-dashboard/support",
    title: "Help & Support",
    icon: <FiSettings />,
    subItems: [
      { path: "/resturent-dashboard/support/contact", title: "Contact Uber Eats Support" },
      { path: "/resturent-dashboard/support/faq", title: "FAQs & Guides" },
    ],
  },
  { path: "/resturent-dashboard/profile", title: "Profile", icon: <FiUser /> },
  {
    title: "Logout", // Removed path since it's an action, not a route
    icon: <MdOutlinePowerSettingsNew />,
    onClick: () => {}, // Placeholder, will be set in the component
  },
];

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar = ({ isSidebarOpen }: SidebarProps) => {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!isAuthenticated) {
      toast.error("You are not logged in.");
      return;
    }

    try {
      await logout(); // Call the logout function from AuthContext
      toast.success("Logged out successfully!");
      navigate("/"); // Redirect to home page using useNavigate
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const toggleMenu = (path: string) => {
    setOpenMenus((prev) =>
      prev.includes(path) ? prev.filter((item) => item !== path) : [...prev, path]
    );
  };

  // Update the Logout menu item with the handleLogout function
  const updatedMenuItems = menuItems.map((item) =>
    item.title === "Logout" ? { ...item, onClick: handleLogout } : item
  );

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {updatedMenuItems.map((item) => (
              <li key={item.title}>
                {item.subItems ? (
                  <div
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                    onClick={() => toggleMenu(item.path!)}
                  >
                    <span className="mr-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.title}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        openMenus.includes(item.path!) ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                ) : (
                  <div
                    onClick={item.onClick} // Handle clicks for items with onClick (e.g., Logout)
                    className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      item.onClick ? "cursor-pointer" : ""
                    }`}
                  >
                    {item.path ? (
                      <Link
                        to={item.path}
                        className="flex items-center w-full"
                      >
                        <span className="mr-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.title}</span>
                      </Link>
                    ) : (
                      <>
                        <span className="mr-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.title}</span>
                      </>
                    )}
                  </div>
                )}
                {item.subItems && openMenus.includes(item.path!) && (
                  <ul className="pl-6 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.path}>
                        <Link
                          to={subItem.path}
                          className="flex items-center p-2 text-sm text-gray-700 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;