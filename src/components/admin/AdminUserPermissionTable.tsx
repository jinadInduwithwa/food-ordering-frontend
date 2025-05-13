import React, { useState } from "react";
import { updateUserRole, updateUserStatus } from "../../utils/api";
import ConfirmationModal from "../UI/ConfirmationModal";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CUSTOMER" | "RESTAURANT" | "DELIVERY" | "ADMIN";
  isActive: boolean;
  isVerified: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AdminUserPermissionProps {
  headers: string[];
  data: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

// Define role options
const ROLE_OPTIONS: { value: "CUSTOMER" | "RESTAURANT" | "DELIVERY" | "ADMIN"; label: string }[] = [
  { value: "CUSTOMER", label: "Customer" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "DELIVERY", label: "Delivery" },
  { value: "ADMIN", label: "Admin" },
];

// Define status options
const STATUS_OPTIONS: { value: boolean; label: string }[] = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];

// Define verification options
const VERIFICATION_OPTIONS: { value: boolean; label: string }[] = [
  { value: true, label: "Verified" },
  { value: false, label: "Unverified" },
];

// Define filter options for active and verification status
const ACTIVE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Active Status" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const VERIFICATION_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Verification Status" },
  { value: "true", label: "Verified" },
  { value: "false", label: "Unverified" },
];

const AdminUserPermissionTable: React.FC<AdminUserPermissionProps> = ({ headers, data, setUsers }) => {
  const [users, setLocalUsers] = useState<User[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("all");
  const [verificationStatusFilter, setVerificationStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ title: "", message: "", onConfirm: () => {} });

  // Open confirmation modal
  const openConfirmationModal = (title: string, message: string, onConfirm: () => void) => {
    setModalConfig({ title, message, onConfirm });
    setIsModalOpen(true);
  };

  // Handle role change
  const handleRoleChange = (
    userId: string,
    userEmail: string,
    newRole: "CUSTOMER" | "RESTAURANT" | "DELIVERY" | "ADMIN"
  ) => {
    openConfirmationModal(
      "Confirm Role Change",
      `Are you sure you want to change the role of ${userEmail} to ${newRole}?`,
      async () => {
        try {
          await updateUserRole(userId, { role: newRole });
          const updateUser = (prev: User[]): User[] =>
            prev.map((user) => (user._id === userId ? { ...user, role: newRole } : user));
          setLocalUsers(updateUser);
          setUsers(updateUser);
          setIsModalOpen(false);
        } catch (error: any) {
          alert(`Failed to update role: ${error.message}`);
          console.error("Role change error:", error);
        }
      }
    );
  };

  // Handle active status change
  const handleActiveStatusChange = (userId: string, userEmail: string, isActive: boolean) => {
    openConfirmationModal(
      `Confirm ${isActive ? "Activate" : "Deactivate"} User`,
      `Are you sure you want to ${isActive ? "activate" : "deactivate"} ${userEmail}?`,
      async () => {
        try {
          await updateUserStatus(userId, { isActive });
          const updateUser = (prev: User[]): User[] =>
            prev.map((user) => (user._id === userId ? { ...user, isActive } : user));
          setLocalUsers(updateUser);
          setUsers(updateUser);
          setIsModalOpen(false);
        } catch (error: any) {
          alert(`Failed to update active status: ${error.message}`);
          console.error("Active status change error:", error);
        }
      }
    );
  };

  // Handle verification status change
  const handleVerificationStatusChange = (userId: string, userEmail: string, isVerified: boolean) => {
    openConfirmationModal(
      `Confirm ${isVerified ? "Verify" : "Unverify"} User`,
      `Are you sure you want to ${isVerified ? "verify" : "unverify"} ${userEmail}?`,
      async () => {
        try {
          await updateUserStatus(userId, { isVerified });
          const updateUser = (prev: User[]): User[] =>
            prev.map((user) => (user._id === userId ? { ...user, isVerified } : user));
          setLocalUsers(updateUser);
          setUsers(updateUser);
          setIsModalOpen(false);
        } catch (error: any) {
          alert(`Failed to update verification status: ${error.message}`);
          console.error("Verification status change error:", error);
        }
      }
    );
  };

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
            <select
              value={user.role}
              onChange={(e) =>
                handleRoleChange(
                  user._id,
                  user.email,
                  e.target.value as "CUSTOMER" | "RESTAURANT" | "DELIVERY" | "ADMIN"
                )
              }
              className="px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={user.isActive.toString()}
              onChange={(e) => handleActiveStatusChange(user._id, user.email, e.target.value === "true")}
              className="px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value.toString()} value={option.value.toString()}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={user.isVerified.toString()}
              onChange={(e) =>
                handleVerificationStatusChange(user._id, user.email, e.target.value === "true")
              }
              className="px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {VERIFICATION_OPTIONS.map((option) => (
                <option key={option.value.toString()} value={option.value.toString()}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return "";
    }
  };

  // Filter users by search term, role, active status, and verification status
  const filteredUsers = users.filter((user) => {
    const matchesSearch = [user.email, user.firstName, user.lastName].some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();

    const matchesActiveStatus =
      activeStatusFilter === "all" || user.isActive.toString() === activeStatusFilter;

    const matchesVerificationStatus =
      verificationStatusFilter === "all" || user.isVerified.toString() === verificationStatusFilter;

    return matchesSearch && matchesRole && matchesActiveStatus && matchesVerificationStatus;
  });

  // Sort users by email
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const emailA = a.email.toLowerCase();
    const emailB = b.email.toLowerCase();
    return emailA.localeCompare(emailB);
  });

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
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Roles</option>
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value.toLowerCase()}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={activeStatusFilter}
            onChange={(e) => setActiveStatusFilter(e.target.value)}
            className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {ACTIVE_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={verificationStatusFilter}
            onChange={(e) => setVerificationStatusFilter(e.target.value)}
            className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {VERIFICATION_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Table View with Horizontal Scroll */}
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

export default AdminUserPermissionTable;