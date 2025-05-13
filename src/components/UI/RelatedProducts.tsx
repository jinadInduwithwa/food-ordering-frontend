import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMenuItemsByRestaurantId } from '../../utils/api';
import MenuCard from './MenuCard';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  mainImage?: string;
  thumbnailImage?: string;
  description?: string;
  category?: string;
  isAvailable?: boolean;
  size?: string;
  pieces?: number;
  orderHours?: string;
}

interface RelatedProductsProps {
  restaurantId: string;
  currentMenuItemId: string;
  category: string | undefined;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ restaurantId, currentMenuItemId, category }) => {
  const [relatedItems, setRelatedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedItems = async () => {
      try {
        setLoading(true);
        // Fetch all menu items for the restaurant
        const allItems = await getMenuItemsByRestaurantId(restaurantId);
        // Filter items by category, exclude the current item, and limit to 4 items
        const filteredItems = allItems
          .filter(
            (item: MenuItem) =>
              item._id !== currentMenuItemId && // Exclude the current menu item
              item.category === category && // Match the category
              item.isAvailable // Only show available items
          )
          .slice(0, 3); // Limit to 4 related items
        setRelatedItems(filteredItems);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load related items');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedItems();
  }, [restaurantId, currentMenuItemId, category]);

  // Animation variants for the related items section
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-600">Loading related items...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (relatedItems.length === 0) {
    return <div className="text-center py-4 text-gray-600">No related items found.</div>;
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedItems.map((item, index) => (
          <MenuCard
            key={item._id}
            item={item}
            index={index}
            restaurantId={restaurantId}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedProducts;