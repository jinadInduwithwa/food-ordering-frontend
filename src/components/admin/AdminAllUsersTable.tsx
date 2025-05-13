import React, { useState } from "react";

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

interface AdminAllUserTableProps {
  headers: string[];
  data: User[];
}

const AdminAllUserTable: React.FC<AdminAllUserTableProps> = ({ headers, data }) => {
  const [users] = useState<User[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

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
          <span className={getStatusStyles(user.isActive)}>
            {user.isActive ? "Active" : "Inactive"}
          </span>
        );
      case "verification status":
        return (
          <span className={getStatusStyles(user.isVerified)}>
            {user.isVerified ? "Verified" : "Unverified"}
          </span>
        );
      case "street":
        return user.address.street;
      case "city":
        return user.address.city;
      case "state":
        return user.address.state;
      case "zip code":
        return user.address.zipCode;
      case "country":
        return user.address.country;
      case "created at":
        return new Date(user.createdAt).toLocaleDateString();
      case "updated at":
        return new Date(user.updatedAt).toLocaleDateString();
      default:
        return "";
    }
  };

  // Filter users by search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch = [
      user.email,
      user.firstName,
      user.lastName,
      user.role,
      user.address.street,
      user.address.city,
      user.address.state,
      user.address.country,
    ].some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  // Sort users by email
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const emailA = a.email.toLowerCase();
    const emailB = b.email.toLowerCase();
    return emailA.localeCompare(emailB);
  });

  // Get status color styles
  const getStatusStyles = (status: boolean) => {
    const baseStyles = "px-2 py-1 text-xs font-semibold rounded-lg";
    return status
      ? `${baseStyles} bg-green-100 text-green-600 dark:bg-green-700 dark:text-green-200`
      : `${baseStyles} bg-red-100 text-red-600 dark:bg-red-700 dark:text-red-200`;
  };

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customer</option>
          <option value="restaurant">Restaurant</option>
          <option value="delivery">Delivery</option>
          <option value="admin">Admin</option>
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

export default AdminAllUserTable;