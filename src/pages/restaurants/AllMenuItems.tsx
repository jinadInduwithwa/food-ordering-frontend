import { useState, useEffect } from 'react';
import RestaurantTitle from '../../components/UI/ResturentTitle'; // Fixed typo
import MenuItemsTable from '../../components/restaurants/MenuItemsTable';
import { getProfile, getMenuItemsByRestaurantId, getCategories } from '../../utils/api';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string; // Category _id
    imageUrl?: string;
    thumbnailImage?: string;
    isAvailable: boolean;
}

interface Category {
    _id: string;
    name: string;
}

const AllMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user profile to get restaurantId
        const profile = await getProfile();
        const restaurantId = profile._id;

        // Fetch menu items
        const items = await getMenuItemsByRestaurantId(restaurantId, true);
        const formattedItems: MenuItem[] = items.map((item: any) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          imageUrl: item.mainImage || 'https://via.placeholder.com/300x200',
          thumbnailImage: item.thumbnailImage || 'https://via.placeholder.com/50x50',
          isAvailable: item.isAvailable,
        }));

        // Fetch categories
        try {
          const categoryData = await getCategories(restaurantId);
          setCategories(categoryData);
        } catch (catErr: any) {
          console.error('Failed to fetch categories:', catErr);
          // Continue without categories; MenuItemsTable will use _id
        }

        setMenuItems(formattedItems);
        setTotalPages(1); // Update if API supports pagination
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load menu items. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-4">
      <RestaurantTitle text="Menu Items" />
      {loading && <div className="text-center p-4 text-gray-600 dark:text-gray-300">Loading...</div>}
      {error && <div className="text-center p-4 text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          <MenuItemsTable data={menuItems} categories={categories} />
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg ${
                page === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-500 text-white hover:bg-orange-600'
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
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
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

export default AllMenuItems;