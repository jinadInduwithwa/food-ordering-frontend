import { useState, useEffect } from 'react';
import { getCategories } from '../../utils/api';

interface Category {
  _id: string;
  name: string;
  description: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

interface CategorySelectProps {
  restaurantId: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ restaurantId, value, onChange, required }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories(restaurantId);
        setCategories(response);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load categories.");
        console.error("Fetch categories error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchCategories();
    }
  }, [restaurantId]);

  return (
    <select
      name="category"
      value={value}
      onChange={onChange}
      required={required}
      disabled={loading || !!error}
      className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">{loading ? 'Loading...' : error ? 'Error' : 'Select a category'}</option>
      {!loading && !error && categories.map(category => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;