import React, { useState } from "react";
import { getUserById, updateUser, deleteUser } from "../../utils/api";
import ConfirmationModal from "../UI/ConfirmationModal";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CUSTOMER" | "RESTAURANT" | "DELIVERY" | "ADMIN";
  isActive: boolean;
  isVerified: boolean;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UserSettingTableProps {
  headers: string[];
  data: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserSettingTable: React.FC<UserSettingTableProps> = ({ headers, data, setUsers }) => {
  const [users, setLocalUsers] = useState<User[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Open edit modal and fetch user data
  const openEditModal = async (userId: string) => {
    try {
      const response = await getUserById(userId);
      console.log("getUserById response:", response); // Log response for debugging
      const user = response.data.user; // Access nested user object
      setSelectedUser(user);
      setFormData({
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "",
        },
      });
      setIsEditModalOpen(true);
      setFormError(null);
    } catch (error: any) {
      alert(`Failed to fetch user: ${error.message}`);
      console.error("Fetch user error:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await updateUser(selectedUser._id, formData);
      console.log("updateUser response:", response); // Log response for debugging
      const updatedUser: User = response.data.user; // Access nested user object
      const updateUsers = (prev: User[]): User[] =>
        prev.map((user) =>
          user._id === selectedUser._id
            ? {
                ...user,
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                address: updatedUser.address || {
                  street: "",
                  city: "",
                  state: "",
                  zipCode: "",
                  country: "",
                },
              }
            : user
        );
      setLocalUsers(updateUsers);
      setUsers(updateUsers);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setFormError(null);
    } catch (error: any) {
      setFormError(error.message || "Failed to update user");
      console.error("Update user error:", error);
    }
  };

  // Handle delete user
  const handleDeleteUser = (userId: string, userEmail: string) => {
    openDeleteModal(
      "Confirm Delete User",
      `Are you sure you want to delete ${userEmail}?`,
      async () => {
        try {
          await deleteUser(userId);
          const updateUsers = (prev: User[]): User[] =>
            prev.filter((user) => user._id !== userId);
          setLocalUsers(updateUsers);
          setUsers(updateUsers);
          setIsDeleteModalOpen(false);
        } catch (error: any) {
          alert(`Failed to delete user: ${error.message}`);
          console.error("Delete user error:", error);
        }
      }
    );
  };

  // Open delete confirmation modal
  const openDeleteModal = (title: string, message: string, onConfirm: () => void) => {
    setIsDeleteModalOpen(true);
    setModalConfig({ title, message, onConfirm });
  };

  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ title: "", message: "", onConfirm: () => {} });

  // Map headers to data fields
  const getFieldValue = (user: User, header: string) => {
    switch (header.toLowerCase()) {
      case "email":
        return user.email;
      case "first name":
        return user.firstName;
      case "last name":
        return user.lastName;
      case "role":
        return user.role;
      case "active status":
        return (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-lg ${
              user.isActive
                ? "bg-green-100 text-green-600 dark:bg-green-700 dark:text-green-200"
                : "bg-red-100 text-red-600 dark:bg-red-700 dark:text-red-200"
            }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </span>
        );
      case "verification status":
        return (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-lg ${
              user.isVerified
                ? "bg-green-100 text-green-600 dark:bg-green-700 dark:text-green-200"
                : "bg-red-100 text-red-600 dark:bg-red-700 dark:text-red-200"
            }`}
          >
            {user.isVerified ? "Verified" : "Unverified"}
          </span>
        );
      case "actions":
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => openEditModal(user._id)}
              className="px-2 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteUser(user._id, user.email)}
              className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        );
      default:
        return "";
    }
  };

  // Filter users by search term
  const filteredUsers = users.filter((user) =>
    [user.email, user.firstName, user.lastName].some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort users by email
  const sortedUsers = [...filteredUsers].sort((a, b) =>
    a.email.toLowerCase().localeCompare(b.email.toLowerCase())
  );

  return (
    <>
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Edit User
            </h2>
            {formError && (
              <div className="text-red-500 mb-4">{formError}</div>
            )}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Street
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  City
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  State
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country
                </label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                    setFormError(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-5 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block p-5 w-full text-sm rounded-md overflow-x-auto bg-white dark:bg-gray-700">
        <table className="min-w-[1000px] w-full">
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
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user, index) => (
              <tr
                key={user._id}
                className={`border-b border-gray-200 dark:border-gray-500 ${
                  index % 2 === 0 ? "bg-gray-50 dark:bg-gray-600" : "bg-gray-100 dark:bg-gray-700"
                } hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors`}
              >
                {headers.map((header, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-800 dark:text-white">
                    {getFieldValue(user, header)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid View */}
      <div className="lg:hidden p-5 space-y-4 overflow-y-scroll h-full">
        {sortedUsers.map((user) => (
          <div
            key={user._id}
            className="border rounded-md p-4 shadow-md hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-500 bg-gray-100 dark:bg-gray-600"
          >
            <div className="space-y-2">
              {headers.map((header, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-800 dark:text-white">{header}:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {getFieldValue(user, header)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {sortedUsers.length === 0 && (
        <div className="p-5 text-center text-gray-600 dark:text-gray-300">
          No users found.
        </div>
      )}
    </>
  );
};

export default UserSettingTable;