import { Outlet } from "react-router-dom";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import { useState, useEffect } from "react";

const AdminLayout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="font-sans min-h-screen">
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <main
        className={`transition-all duration-300 ease-in-out pt-20 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } sm:ml-64 bg-white dark:bg-gray-700  text-gray-900 dark:text-gray-100 min-h-screen`}
      >
        <Outlet /> {/* This renders Profile, Overview, etc. */}
      </main>
    </div>
  );
};

export default AdminLayout;