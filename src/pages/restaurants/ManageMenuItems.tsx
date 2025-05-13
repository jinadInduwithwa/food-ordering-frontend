import { useState, useEffect } from 'react';
import ResturentItemCard from '../../components/restaurants/ResturentItemCard';
import ResturentTitle from '../../components/UI/ResturentTitle';
import EditMenuItemModal from '../../components/restaurants/EditMenuItemModal';
import { getProfile, getMenuItemsByRestaurantId, getCategories } from '../../utils/api';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string; // Category _id
    imageUrl?: string;
    isAvailable: boolean;
}

interface Category {
    _id: string;
    name: string;
}

const ManageMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user profile to get restaurantId
        const profile = await getProfile();
        const fetchedRestaurantId = profile._id;
        setRestaurantId(fetchedRestaurantId);

        // Fetch menu items
        const items = await getMenuItemsByRestaurantId(fetchedRestaurantId, true);
        const formattedItems: MenuItem[] = items.map((item: any) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          imageUrl: item.mainImage || 'https://via.placeholder.com/300x200',
          isAvailable: item.isAvailable,
        }));

        // Fetch categories
        try {
          const categoryData = await getCategories(fetchedRestaurantId);
          setCategories(categoryData);
        } catch (catErr: any) {
          console.error('Failed to fetch categories:', catErr);
        }

        setMenuItems(formattedItems);
        setFilteredItems(formattedItems);
      } catch (err: any) {
        setError(err.message || 'Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search and category filtering
  useEffect(() => {
    let filtered = menuItems;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, menuItems]);

  const handleEdit = (item: MenuItem) => {
    setEditItem(item);
  };

  const handleDelete = (id: string) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setFilteredItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleSaveEdit = (updatedItem: MenuItem) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setFilteredItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditItem(null);
  };

  const handleCloseModal = () => {
    setEditItem(null);
  };

  // Dynamic categories for dropdown
  const dynamicCategories = [
    { _id: 'all', name: 'All' },
    ...categories.map((cat) => ({ _id: cat._id, name: cat.name })),
  ];

  // Map category _id to name for ResturentItemCard
  const categoryMap = new Map<string, string>(categories.map(cat => [cat._id, cat.name]));

  if (loading) {
    return (
      <div className="p-4">
        <ResturentTitle text="All Menu Items" />
        <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ResturentTitle text="All Menu Items" />
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <ResturentTitle text="Menu Items Management" />
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-40 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {dynamicCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <ResturentItemCard
              key={item.id}
              data={item}
              restaurantId={restaurantId || ''}
              categoryName={categoryMap.get(item.category) || `Category ${item.category}`}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600 dark:text-gray-300">
            No menu items found.
          </div>
        )}
      </div>
      {editItem && (
        <EditMenuItemModal
          item={editItem}
          restaurantId={restaurantId || ''}
          onClose={handleCloseModal}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

export default ManageMenuItems;