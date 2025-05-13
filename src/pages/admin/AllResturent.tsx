
import React, { useEffect, useState } from "react";
import AdminResturentTable from "../../components/admin/AdminResturentTable";
import ResturentTitle from "../../components/UI/ResturentTitle";
import { getAllRestaurants } from "../../utils/api";

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

// Table headers for restaurant details
const tableHeaders: string[] = [
  "Restaurant Name",
  "Contact Person",
  "Phone Number",
  "Business Type",
  "Cuisine Type",
  "Operating Hours",
  "Delivery Radius",
  "Tax ID",
  "Street Address",
  "City",
  "State",
  "Zip Code",
  "Country",
  "Email",
  "Business License",
  "Food Safety Certificate",
  "Exterior Photo",
  "Logo",
  "Status",
];

const RestaurantDetailsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  // Fetch restaurants on component mount or page change
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await getAllRestaurants(page, limit);
        const formattedRestaurants: Restaurant[] = response.data.map((item: any) => ({
          _id: item._id,
          restaurantName: item.restaurantName,
          contactPerson: item.contactPerson,
          phoneNumber: item.phoneNumber,
          businessType: item.businessType,
          cuisineType: item.cuisineType,
          operatingHours: item.operatingHours,
          deliveryRadius: item.deliveryRadius,
          taxId: item.taxId,
          address: {
            streetAddress: item.address.streetAddress,
            city: item.address.city,
            state: item.address.state,
            zipCode: item.address.zipCode,
            country: item.address.country,
          },
          email: item.email,
          businessLicense: item.businessLicense || null,
          foodSafetyCert: item.foodSafetyCert || null,
          exteriorPhoto: item.exteriorPhoto || null,
          logo: item.logo || null,
          status: item.status ? item.status.trim().toLowerCase() : "pending",
        }));
        setRestaurants(formattedRestaurants);
        setTotalPages(response.pagination.totalPages);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load restaurants. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [page]);

  // Handle delete action from table
  const handleDelete = (restaurantId: string) => {
    setRestaurants((prev) => prev.filter((restaurant) => restaurant._id !== restaurantId));
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-4">
      <ResturentTitle text="Restaurant Details" />
      {loading && <div className="text-center p-4 text-gray-600 dark:text-gray-300">Loading...</div>}
      {error && <div className="text-center p-4 text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          <AdminResturentTable headers={tableHeaders} data={restaurants} onDelete={handleDelete} />
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

export default RestaurantDetailsPage;
