import React, { useState } from "react";
import { deleteRestaurant, updateRestaurantStatus } from "../../utils/api";
import ConfirmationModal from "../UI/ConfirmationModal";

export interface Restaurant {
  _id: string;
  restaurantName: string;
  contactPerson: string;
  phoneNumber: string;
  businessType: string;
  cuisineType: string;
  operatingHours: string;
  deliveryRadius: string;
  taxId: string;
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  email: string;
  businessLicense?: string | null;
  foodSafetyCert?: string | null;
  exteriorPhoto?: string | null;
  logo?: string | null;
  status?: string;
}

interface AdminResturentTableProps {
  headers: string[];
  data: Restaurant[];
  onDelete: (restaurantId: string) => void;
}

const AdminResturentTable: React.FC<AdminResturentTableProps> = ({ headers, data, onDelete }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(
    data.map((restaurant) => ({
      ...restaurant,
      status: restaurant.status ? restaurant.status.trim().toLowerCase() : "pending",
    }))
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ title: "", message: "", onConfirm: () => {} });

  // Determine if restaurant is blocked
  const isRestaurantBlocked = (restaurant: Restaurant) =>
    restaurant.status?.toLowerCase() === "blocked";

  // Open confirmation modal
  const openConfirmationModal = (title: string, message: string, onConfirm: () => void) => {
    setModalConfig({ title, message, onConfirm });
    setIsModalOpen(true);
  };

  // Handle delete action
  const handleDelete = (restaurantId: string, restaurantName: string) => {
    openConfirmationModal(
      "Confirm Delete",
      `Are you sure you want to delete ${restaurantName}? This action cannot be undone.`,
      async () => {
        try {
          await deleteRestaurant(restaurantId);
          setRestaurants((prev) => prev.filter((restaurant) => restaurant._id !== restaurantId));
          onDelete(restaurantId);
          setIsModalOpen(false);
        } catch (error: any) {
          alert(`Failed to delete restaurant: ${error.message}`);
          console.error("Delete error:", error);
        }
      }
    );
  };

  // Handle block/unblock action
  const handleBlockToggle = (restaurantId: string, restaurantName: string, isBlocked: boolean) => {
    const newStatus = isBlocked ? "approved" : "blocked";
    openConfirmationModal(
      isBlocked ? "Confirm Unblock" : "Confirm Block",
      `Are you sure you want to ${isBlocked ? "unblock" : "block"} ${restaurantName}?`,
      async () => {
        try {
          await updateRestaurantStatus(restaurantId, newStatus);
          setRestaurants((prev) =>
            prev.map((restaurant) =>
              restaurant._id === restaurantId
                ? {
                    ...restaurant,
                    status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
                  }
                : restaurant
            )
          );
          setIsModalOpen(false);
        } catch (error: any) {
          alert(`Failed to ${isBlocked ? "unblock" : "block"} restaurant: ${error.message}`);
          console.error("Block toggle error:", error);
        }
      }
    );
  };

  // Map headers to data fields
  const getFieldValue = (restaurant: Restaurant, header: string) => {
    switch (header.toLowerCase()) {
      case "restaurant name":
        return restaurant.restaurantName;
      case "contact person":
        return restaurant.contactPerson;
      case "phone number":
        return restaurant.phoneNumber;
      case "business type":
        return restaurant.businessType;
      case "cuisine type":
        return restaurant.cuisineType;
      case "operating hours":
        return restaurant.operatingHours;
      case "delivery radius":
        return restaurant.deliveryRadius;
      case "tax id":
        return restaurant.taxId;
      case "street address":
        return restaurant.address.streetAddress;
      case "city":
        return restaurant.address.city;
      case "state":
        return restaurant.address.state;
      case "zip code":
        return restaurant.address.zipCode;
      case "country":
        return restaurant.address.country;
      case "email":
        return restaurant.email;
      case "business license":
        return restaurant.businessLicense ? (
          <a
            href={restaurant.businessLicense}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            License
          </a>
        ) : (
          "N/A"
        );
      case "food safety certificate":
        return restaurant.foodSafetyCert ? (
          <a
            href={restaurant.foodSafetyCert}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Cert
          </a>
        ) : (
          "N/A"
        );
      case "exterior photo":
        return restaurant.exteriorPhoto ? (
          <a
            href={restaurant.exteriorPhoto}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Photo
          </a>
        ) : (
          "N/A"
        );
      case "logo":
        return restaurant.logo ? (
          <a
            href={restaurant.logo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Logo
          </a>
        ) : (
          "N/A"
        );
      case "status":
        return (
          <span className={getStatusStyles(restaurant.status || "Pending")}>
            {restaurant.status || "Pending"}
          </span>
        );
      default:
        return "";
    }
  };

  // Filter restaurants by search term and status
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = [
      restaurant.restaurantName,
      restaurant.contactPerson,
      restaurant.email,
      restaurant.cuisineType,
      restaurant.address.streetAddress,
      restaurant.address.city,
      restaurant.address.state,
      restaurant.address.country,
    ].some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      restaurant.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Sort restaurants by restaurantName
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    const nameA = a.restaurantName.toLowerCase();
    const nameB = b.restaurantName.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Get status color styles
  const getStatusStyles = (status: string) => {
    const baseStyles = "px-2 py-1 text-xs font-semibold rounded-lg";
    switch (status.toLowerCase()) {
      case "approved":
        return `${baseStyles} bg-green-100 text-green-600 dark:bg-green-700 dark:text-green-200`;
      case "blocked":
        return `${baseStyles} bg-red-100 text-red-600 dark:bg-red-700 dark:text-red-200`;
      case "pending":
        return `${baseStyles} bg-yellow-100 text-yellow-600 dark:bg-yellow-700 dark:text-yellow-200`;
      case "rejected":
        return `${baseStyles} bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200`;
    }
  };

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText="Confirm"
        cancelText="Cancel"
      />

      {/* Search and Filter Controls */}
      <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="blocked">Blocked</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Desktop Table View with Horizontal Scroll */}
      <div className="hidden lg:block p-5 w-full text-sm rounded-md overflow-x-auto bg-white dark:bg-gray-700">
        <table className="min-w-[1200px] w-full">
          <thead className="bg-gray-200 border-gray-200 dark:bg-gray-700 dark:border-gray-500">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="text-start py-4 px-6 font-semibold text-gray-600 dark:text-gray-200"
                >
                  {header}
                </th>
              ))}
              <th className="text-start py-4 px-6 font-semibold text-gray-600 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRestaurants.map((restaurant, index) => (
              <tr
                key={restaurant._id}
                className={`border-b border-gray-200 dark:border-gray-500 ${
                  isRestaurantBlocked(restaurant)
                    ? "bg-red-100 dark:bg-red-900"
                    : index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-600"
                    : "bg-gray-100 dark:bg-gray-700"
                } hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors`}
              >
                {headers.map((header, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-800 dark:text-white">
                    {getFieldValue(restaurant, header)}
                  </td>
                ))}
                <td className="py-4 px-6 flex space-x-2">
                  <button
                    onClick={() =>
                      handleBlockToggle(
                        restaurant._id,
                        restaurant.restaurantName,
                        isRestaurantBlocked(restaurant)
                      )
                    }
                    className={`px-3 py-1 text-white rounded-lg transition-colors ${
                      isRestaurantBlocked(restaurant)
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                    disabled={restaurant.status?.toLowerCase() === "rejected"}
                  >
                    {isRestaurantBlocked(restaurant) ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant._id, restaurant.restaurantName)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid View */}
      <div className="lg:hidden p-5 space-y-4 overflow-y-scroll h-full">
        {sortedRestaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className={`border rounded-md p-4 bg-white shadow-md hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-500 ${
              isRestaurantBlocked(restaurant)
                ? "bg-red-100 dark:bg-red-900"
                : "bg-gray-100 dark:bg-gray-600"
            }`}
          >
            <div className="space-y-2">
              {headers.map((header, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-800 dark:text-white">{header}:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {getFieldValue(restaurant, header)}
                  </span>
                </div>
              ))}
            </div>
            {/* Actions */}
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() =>
                  handleBlockToggle(
                    restaurant._id,
                    restaurant.restaurantName,
                    isRestaurantBlocked(restaurant)
                  )
                }
                className={`px-3 py-1 text-white rounded-lg transition-colors ${
                  isRestaurantBlocked(restaurant)
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
                disabled={restaurant.status?.toLowerCase() === "rejected"}
              >
                {isRestaurantBlocked(restaurant) ? "Unblock" : "Block"}
              </button>
              <button
                onClick={() => handleDelete(restaurant._id, restaurant.restaurantName)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {sortedRestaurants.length === 0 && (
        <div className="p-5 text-center text-gray-600 dark:text-gray-300">
          No restaurants found.
        </div>
      )}
    </>
  );
};

export default AdminResturentTable;
