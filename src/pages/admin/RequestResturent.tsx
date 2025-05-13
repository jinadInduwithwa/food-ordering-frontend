import { useEffect, useState } from "react";
import AdminResturentRequestTable from "../../components/admin/AdminResturentRequestTable";
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

const tableHeaders = [
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
  "Actions",
];

const RequestRestaurant = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await getAllRestaurants(page, limit);
        setRestaurants(
          response.data.map((restaurant: Restaurant) => ({
            ...restaurant,
            status: restaurant.status ? restaurant.status.trim().toLowerCase() : "pending",
          }))
        );
        setTotalPages(response.pagination.totalPages);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch restaurants");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-4">
      <ResturentTitle text="Restaurant Requests" />
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && (
        <>
          <AdminResturentRequestTable headers={tableHeaders} data={restaurants} />
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

export default RequestRestaurant;
