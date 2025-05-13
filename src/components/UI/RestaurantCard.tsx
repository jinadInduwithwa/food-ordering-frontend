import React from 'react';
import CustomButton from './CustomButton';

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

interface RestaurantCardProps {
  restaurant: RestaurantData;
  onViewMenu: (id: string) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onViewMenu }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden transition-transform transform hover:scale-105 ${
        restaurant.isAvailable ? 'shadow-md' : 'shadow-lg opacity-75'
      }`}
    >
      {/* Restaurant Image */}
      <img
        src={restaurant.imageUrl}
        alt={restaurant.name}
        className="w-full h-40 object-cover"
      />

      {/* Restaurant Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {restaurant.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{restaurant.cuisine}</p>

        {/* City and Operating Hours */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              {restaurant.city}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{restaurant.operatingHours}</p>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{restaurant.phoneNumber}</span>
          <span>{restaurant.deliveryDistance}</span>
          {restaurant.giftDineIn && <span className="text-orange-600">Gift Dine In</span>}
        </div>

        {/* Availability Message */}
        {!restaurant.isAvailable && (
          <p className="mt-2 text-sm text-red-600 font-medium">Currently Unavailable</p>
        )}

        {/* View Menu Button */}
        <div className="mt-4">
          <CustomButton
            title="View Menu"
            bgColor="bg-orange-600"
            textColor="text-white"
            onClick={() => onViewMenu(restaurant.id)}
            style="hover:bg-orange-700"
            disabled={!restaurant.isAvailable} // Added
          />
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;