import { useState } from 'react';
import { deleteMenuItem } from '../../utils/api';
import ConfirmationModal from '../../components/UI/ConfirmationModal';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
}

interface ResturentItemCardProps {
  data: MenuItem;
  restaurantId: string;
  categoryName: string;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

const ResturentItemCard = ({ data, restaurantId, categoryName, onEdit, onDelete }: ResturentItemCardProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMenuItem(restaurantId, data.id);
      onDelete(data.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Delete menu item error:', error);
      alert('Failed to delete menu item');
    }
  };

  return (
    <>
      <div className="bg-white shadow-md dark:bg-gray-800 rounded-md overflow-hidden transition-transform hover:scale-105">
        <img
          src={data.imageUrl || 'https://via.placeholder.com/300x200'}
          alt={data.name}
          className="w-full h-48 object-cover rounded-t-xl p-2"
        />
        <div className="p-4">
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">{data.name}</h2>
          <div className="mt-1">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-300">Category: </span>
            <span className="inline-block bg-blue-100 text-gray-800 dark:bg-gray-500 dark:text-blue-100 px-2 py-0.5 rounded-full text-xs font-medium">
              {categoryName}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
            {data.description}
          </p>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              Rs. {data.price.toFixed(2)}
            </span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-md ${
                data.isAvailable
                  ? 'bg-green-100 text-green-600 dark:bg-green-400 dark:text-green-100'
                  : 'bg-red-100 text-red-600 dark:bg-red-500 dark:text-red-100'
              }`}
            >
              {data.isAvailable ? 'Available' : 'Not Available'}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              className="flex-1 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 transition-colors"
              onClick={() => onEdit(data)}
            >
              Edit
            </button>
            <button
              className="flex-1 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 transition-colors"
              onClick={handleOpenDeleteModal}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${data.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default ResturentItemCard;