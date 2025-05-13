import React, { useEffect, useState } from "react";
import AdminUserPermission from "../../components/admin/AdminUserPermissionTable";
import ResturentTitle from "../../components/UI/ResturentTitle"; // Consider renaming to Title
import { getAllUsers } from "../../utils/api";

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

// Define table headers
const TABLE_HEADERS: string[] = [
  "Email",
  "First Name",
  "Last Name",
  "Role",
  "Active Status",
  "Verification Status",
  "Actions",
];

const UserPermissions: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        const formattedUsers: User[] = response.data.users.map((item: any) => ({
          _id: item._id,
          email: item.email,
          firstName: item.firstName,
          lastName: item.lastName,
          role: item.role as "CUSTOMER" | "RESTAURANT" | "DELIVERY" | "ADMIN",
          isActive: item.isActive,
          isVerified: item.isVerified,
          address: {
            street: item.address.street,
            city: item.address.city,
            state: item.address.state,
            zipCode: item.address.zipCode,
            country: item.address.country,
          },
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));
        setUsers(formattedUsers);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load users. Please try again.");
        console.error("Fetch users error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <ResturentTitle text="User Permissions" />
      {loading && <div className="text-center p-4 text-gray-600 dark:text-gray-300">Loading...</div>}
      {error && <div className="text-center p-4 text-red-500">{error}</div>}
      {!loading && !error && (
        <AdminUserPermission headers={TABLE_HEADERS} data={users} setUsers={setUsers} />
      )}
    </div>
  );
};

export default UserPermissions;