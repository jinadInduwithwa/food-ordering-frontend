import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '@/components/UI/RestaurantCard';
import { getAllRestaurants } from '@/utils/api';

interface RestaurantData {
  id: string;
  name: string;
  cuisine: string;
  city: string;
  operatingHours: string;
  phoneNumber: string;
  imageUrl: string;
  deliveryDistance: string;
  giftDineIn: boolean;
  isAvailable: boolean; // Added
}

interface PaginationData {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

const Restaurant: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('10KM');
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const fetchRestaurants = async (page: number) => {
    try {
      const response = await getAllRestaurants(page, pagination.pageSize);
      const mappedRestaurants = response.data.map((restaurant: any) => ({
        id: restaurant._id,
        name: restaurant.restaurantName,
        cuisine: restaurant.cuisineType,
        city: restaurant.address.city,
        operatingHours: restaurant.operatingHours,
        phoneNumber: restaurant.phoneNumber,
        imageUrl: restaurant.exteriorPhoto || 'https://via.placeholder.com/300x200',
        deliveryDistance: `< ${restaurant.deliveryRadius}`,
        giftDineIn: Math.random() > 0.5, // Random; update if backend provides
        isAvailable: restaurant.availability ?? true, // Default to true if undefined
      }));
      setRestaurants(mappedRestaurants);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  useEffect(() => {
    fetchRestaurants(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchRestaurants(newPage);
    }
  };

  const handleViewMenu = (id: string) => {
    console.log(`Viewing menu for restaurant ID: ${id}`);
    navigate(`/restaurant/${id}/menu`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 mt-12">
      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto mb-8">
        {/* Search Bar and Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter delivery location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 text-sm border items-center rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <select
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="5KM">5KM</option>
            <option value="10KM">10KM</option>
            <option value="15KM">15KM</option>
            <option value="ALL">ALL</option>
          </select>
          <button className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
            Search
          </button>
        </div>

        {/* Breadcrumb and Title */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            Find Your Favorite Restaurants
          </h1>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 text-justify">
          Surprise your loved ones in Sri Lanka with delicious meals delivered straight from their favorite restaurants. <br /><br />
          With FoodyX, sending freshly-prepared food to friends and family is just a few clicks away. Choose from a handpicked selection of top restaurants and mouth-watering cuisines—perfect for any occasion.<br /><br />
          Enjoy a seamless ordering experience, fast delivery, and the joy of sharing great food. Make someone’s day extra special—order now and let EatLanka deliver happiness to your loved ones’ doorstep!
        </p>
      </div>

      {/* Restaurant Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onViewMenu={handleViewMenu}
              />
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400 col-span-full text-center">
              No restaurants found.
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 bg-orange-600 text-white rounded-md disabled:bg-gray-400 hover:bg-orange-700 transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-900 dark:text-gray-100">
            Page {pagination.currentPage} of {pagination.totalPages} (Total: {pagination.totalCount})
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 bg-orange-600 text-white rounded-md disabled:bg-gray-400 hover:bg-orange-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;