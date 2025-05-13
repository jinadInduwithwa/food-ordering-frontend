import { Link, useLocation } from "react-router-dom";
import { 
  FiCalendar, 
  FiSettings, 
  FiPieChart, 
  FiUser, 
  FiDivide, 
  FiUsers, 
  FiHome, 
  FiSunset 
} from "react-icons/fi";
import { MdPayments } from "react-icons/md";
import { useState, useMemo } from "react";

interface SubMenuItem {
  path: string;
  title: string;
}

interface MenuItem {
  path: string;
  title: string;
  icon: JSX.Element;
  subItems?: SubMenuItem[];
}

const Sidebar = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const menuItems: MenuItem[] = useMemo(() => [
    { path: "/admin-dashboard-overview", title: "Overview", icon: <FiPieChart /> },
    {
      path: "/admin-dashboard/restaurant",
      title: "Restaurant Management",
      icon: <FiSunset />,
      subItems: [
        { path: "/admin-dashboard/resturent", title: "All Restaurants" },
        { path: "/admin-dashboard/resturent/request", title: "Requests" },
        { path: "/admin-dashboard/resturent/add", title: "Create Resturent" },
      ],
    },
    {
      path: "/admin-dashboard/user-management",
      title: "User Management",
      icon: <FiUser />,
      subItems: [
        { path: "/admin-dashboard/user-management/all", title: "All Users" },
        { path: "/admin-dashboard/user-management/add", title: "Add New User" },
        { path: "/admin-dashboard/user-management/roles", title: "Roles & Permissions" },
        { path: "/admin-dashboard/user-management/settings", title: "User Settings" }
      ],
    },
    {
      path: "/admin-dashboard/earnings",
      title: "Earnings & Payments",
      icon: <MdPayments />,
      subItems: [
        { path: "/admin-dashboard/earnings/earan", title: "Daily/Weekly Earnings" },
        { path: "/admin-dashboard/earnings/payouts", title: "Payouts" },
      ],
    },
    {
      path: "/admin-dashboard/promotions",
      title: "Promotions & Discounts",
      icon: <FiDivide />,
      subItems: [
        { path: "/admin-dashboard/promotions/create", title: "Create Promotion" },
        { path: "/admin-dashboard/promotions/active", title: "Active Promotions" },
      ],
    },
    {
      path: "/admin-dashboard/customers",
      title: "Customers",
      icon: <FiUsers />,
      subItems: [
        { path: "/admin-dashboard/customers/feedback", title: "Customer Feedback" },
        { path: "/admin-dashboard/customers/loyalty", title: "Loyalty Programs" },
      ],
    },
   
    {
      path: "/admin-dashboard/settings",
      title: "Business Settings",
      icon: <FiHome />,
      subItems: [
        { path: "/admin-dashboard/settings/profile", title: "Profile & Store Info" },
        { path: "/admin-dashboard/settings/delivery", title: "Delivery Settings" },
        { path: "/admin-dashboard/settings/staff", title: "Staff Management" },
      ],
    },
    {
      path: "/admin-dashboard/reports",
      title: "Reports & Analytics",
      icon: <FiCalendar />,
      subItems: [
        { path: "/admin-dashboard/reports/sales", title: "Sales Reports" },
        { path: "/admin-dashboard/reports/behavior", title: "Customer Behavior" },
      ],
    },
    {
      path: "/admin-dashboard/support",
      title: "Help & Support",
      icon: <FiSettings />,
      subItems: [
        { path: "/admin-dashboard/support/contact", title: "Contact Uber Eats Support" },
        { path: "/admin-dashboard/support/faq", title: "FAQs & Guides" },
      ],
    },
    { path: "/admin-dashboard/profile", title: "Profile", icon: <FiUser /> },
  ], []);

  const toggleMenu = (path: string) => {
    setOpenMenus((prev) =>
      prev.includes(path) ? prev.filter((item) => item !== path) : [...prev, path]
    );
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 transition-transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Sidebar navigation"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-1 font-medium">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              item.subItems?.some((sub) => location.pathname === sub.path);
            
            return (
              <li key={item.path}>
                {item.subItems ? (
                  <button
                    className={`flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`}
                    onClick={() => toggleMenu(item.path)}
                    aria-expanded={openMenus.includes(item.path)}
                    aria-controls={`submenu-${item.path}`}
                  >
                    <span
                      className="mr-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      title={item.title}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.title}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        openMenus.includes(item.path) ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className="mr-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      title={item.title}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.title}</span>
                  </Link>
                )}
                {item.subItems && openMenus.includes(item.path) && (
                  <ul id={`submenu-${item.path}`} className="pl-6 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.path}>
                        <Link
                          to={subItem.path}
                          className={`flex items-center p-2 text-sm text-gray-700 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            location.pathname === subItem.path ? "bg-gray-100 dark:bg-gray-700" : ""
                          }`}
                          aria-current={location.pathname === subItem.path ? "page" : undefined}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;