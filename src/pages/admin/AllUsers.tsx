import React, { useEffect, useState } from "react";
import AdminAllUserTable from "../../components/admin/AdminAllUsersTable";
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

// Table headers for user details
const tableHeaders: string[] = [
  "Email",
  "First Name",
  "Last Name",
  "Role",
  "Active Status",
  "Verification Status",
  "Street",
  "City",
  "State",
  "Zip Code",
  "Country",
  "Created At",
  "Updated At",
];

const AllUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch users on component mount or page change
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers(); // Add page/limit if API supports
        const formattedUsers: User[] = response.data.users.map((item: any) => ({
          _id: item._id,
          email: item.email,
          firstName: item.firstName,
          lastName: item.lastName,
          role: item.role,
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
        setTotalPages(1); // Update if API returns pagination data
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load users. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-4">
      <ResturentTitle text="User Details" /> {/* Consider renaming component */}
      {loading && <div className="text-center p-4 text-gray-600 dark:text-gray-300">Loading...</div>}
      {error && <div className="text-center p-4 text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          <AdminAllUserTable headers={tableHeaders} data={users} />
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg ${
                page === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-800 dark:text-gray-200">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg ${
                page === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllUsersPage;