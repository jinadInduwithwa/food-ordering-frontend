import { useState } from 'react';

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

interface MenuItemsTableProps {
  data: MenuItem[];
  categories?: Category[];
}

const MenuItemsTable: React.FC<MenuItemsTableProps> = ({ data, categories = [] }) => {
  const [menuItems] = useState<MenuItem[]>(data);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Table headers
  const headers: string[] = ['Image', 'Thumbnail Image', 'Name', 'Description', 'Price', 'Category', 'Availability'];

  // Dynamic categories from data
  const dynamicCategories = ['all', ...Array.from(new Set(menuItems.map(item => item.category))).sort()];

  // Map category _id to name
  const categoryMap = new Map<string, string>(categories.map(cat => [cat._id, cat.name]));

  // Map headers to data fields
  const getFieldValue = (item: MenuItem, header: string) => {
    switch (header.toLowerCase()) {
      case 'image':
        return (
          <img
            src={item.imageUrl || 'https://via.placeholder.com/50x50'}
            alt={item.name}
            className="w-12 h-12 object-cover rounded"
          />
        );
      case 'thumbnail image':
        return (
          <img
            src={item.thumbnailImage || 'https://via.placeholder.com/50x50'}
            alt={`${item.name} thumbnail`}
            className="w-12 h-12 object-cover rounded"
          />
        );
      case 'name':
        return item.name;
      case 'description':
        return <span className="line-clamp-2">{item.description}</span>;
      case 'price':
        return `$${item.price.toFixed(2)}`;
      case 'category':
        return categoryMap.get(item.category) || `Category ${item.category}`; // Fallback to _id
      case 'availability':
        return (
          <span className={getStatusStyles(item.isAvailable)}>
            {item.isAvailable ? 'Available' : 'Not Available'}
          </span>
        );
      default:
        return '';
    }
  };

  // Filter items by category
  const filteredItems = menuItems.filter((item) => {
    return categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  // Sort items by name
  const sortedItems = [...filteredItems].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Get status color styles
  const getStatusStyles = (status: boolean) => {
    const baseStyles = 'px-2 py-1 text-xs font-semibold rounded-lg';
    return status
      ? `${baseStyles} bg-green-100 text-green-600 dark:bg-green-700 dark:text-green-200`
      : `${baseStyles} bg-red-100 text-red-600 dark:bg-red-700 dark:text-red-200`;
  };

  return (
    <>
      {/* Category Filter Controls */}
      <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-40 px-3 py-2 rounded-full bg-gray-100 border border-gray-300 dark:border-gray-500  dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {dynamicCategories.map((category) => (
            <option key={category} value={category.toLowerCase()}>
              {category === 'all' ? 'All' : categoryMap.get(category) || `Category ${category}`}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Table View with Horizontal Scroll */}
      <div className="hidden lg:block p-5 w-full text-sm rounded-md overflow-x-auto bg-white dark:bg-gray-700">
        <table className="min-w-[1000px] w-full">
          <thead className="bg-gray-300 border-gray-200 dark:bg-gray-800 dark:border-gray-500">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="text-start py-4 px-6 font-semibold text-gray-700 dark:text-gray-200"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-gray-200 dark:border-gray-500 ${
                  index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-600' : 'bg-gray-100 dark:bg-gray-700'
                } hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors`}
              >
                {headers.map((header, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-800 dark:text-white">
                    {getFieldValue(item, header)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid View */}
      <div className="lg:hidden p-5 space-y-4 overflow-y-scroll h-full">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            className="border rounded-md p-4 shadow-md hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-500 bg-white dark:bg-gray-600"
          >
            <div className="space-y-2">
              {headers.map((header, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-800 dark:text-white">{header}:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {getFieldValue(item, header)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {sortedItems.length === 0 && (
        <div className="p-5 text-center text-gray-600 dark:text-gray-300">
          No menu items found.
        </div>
      )}
    </>
  );
};

export default MenuItemsTable;