import React, { useEffect, useState } from "react";
import CategoryTable from "../../components/restaurants/CategoryTable";
import RestaurantTitle from "../../components/UI/ResturentTitle";
import { getCategories, getProfile } from "../../utils/api";

export interface Category {
  _id: string;
  name: string;
  description: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

// Define table headers
const TABLE_HEADERS: string[] = [
  "Name",
  "Description",
];

const CategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Fetch restaurantId from user profile
        const profile = await getProfile();
        const fetchedRestaurantId = profile._id;
        const response = await getCategories(fetchedRestaurantId);
        const formattedCategories: Category[] = response.map((item: any) => ({
          _id: item._id,
          name: item.name,
          description: item.description || "",
          restaurantId: item.restaurantId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));
        setCategories(formattedCategories);
        setRestaurantId(fetchedRestaurantId);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load categories. Please try again.");
        console.error("Fetch categories error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-4">
      <RestaurantTitle text="Create New Category" />
      {loading && <div className="text-center p-4 text-gray-600 dark:text-gray-300">Loading...</div>}
      {error && <div className="text-center p-4 text-red-500">{error}</div>}
      {!loading && !error && (
        <CategoryTable
          headers={TABLE_HEADERS}
          data={categories}
          setCategories={setCategories}
          restaurantId={restaurantId}
        />
      )}
    </div>
  );
};

export default CategoryManagementPage;