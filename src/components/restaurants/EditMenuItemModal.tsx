import { useState } from 'react';
import { updateMenuItem } from '../../utils/api';
import CategorySelect from '../UI/CategorySelect';
import ErrorMessage from '../UI/FormErrorMessage';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // Category _id
  imageUrl?: string;
  isAvailable: boolean;
}

interface EditMenuItemModalProps {
  item: MenuItem;
  restaurantId: string;
  onClose: () => void;
  onSave: (updatedItem: MenuItem) => void;
}

const EditMenuItemModal = ({ item, restaurantId, onClose, onSave }: EditMenuItemModalProps) => {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    isAvailable: item.isAvailable,
  });
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData | 'mainImage' | 'thumbnailImage', string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        break;
      case 'description':
        if (!value.trim()) return 'Description is required';
        break;
      case 'price':
        if (value === '' || isNaN(value) || value < 0) return 'Price must be a positive number';
        break;
      case 'category':
        if (!value) return 'Category is required';
        break;
      case 'mainImage':
        if (value) {
          const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
          if (!validTypes.includes(value.type)) return 'Main image must be a PNG, JPEG, or JPG';
          if (value.size > 5242880) return 'Main image must be less than 5MB';
        }
        break;
      case 'thumbnailImage':
        if (value) {
          const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
          if (!validTypes.includes(value.type)) return 'Thumbnail image must be a PNG, JPEG, or JPG';
          if (value.size > 5242880) return 'Thumbnail image must be less than 5MB';
        }
        break;
      default:
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof typeof formData | 'mainImage' | 'thumbnailImage', string>> = {};

    // Validate text fields
    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);
      if (error) newErrors[name as keyof typeof formData] = error;
    });

    // Validate file fields
    if (mainImage) {
      const error = validateField('mainImage', mainImage);
      if (error) newErrors.mainImage = error;
    }
    if (thumbnailImage) {
      const error = validateField('thumbnailImage', thumbnailImage);
      if (error) newErrors.thumbnailImage = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change and clear error if valid
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'mainImage' | 'thumbnailImage') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'mainImage') setMainImage(file);
      else setThumbnailImage(file);

      // Validate file and update errors
      const error = validateField(type, file);
      setErrors((prev) => ({
        ...prev,
        [type]: error,
      }));
    } else {
      // Clear file and error if no file is selected
      if (type === 'mainImage') setMainImage(null);
      else setThumbnailImage(null);
      setErrors((prev) => ({
        ...prev,
        [type]: undefined,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitError('Please fix the errors in the form.');
      return;
    }

    try {
      const updatedData = await updateMenuItem(restaurantId, item.id, formData, {
        mainImage: mainImage || undefined,
        thumbnailImage: thumbnailImage || undefined,
      });

      const updatedItem: MenuItem = {
        id: updatedData.menuItem._id,
        name: updatedData.menuItem.name,
        description: updatedData.menuItem.description,
        price: updatedData.menuItem.price,
        category: updatedData.menuItem.category,
        imageUrl: updatedData.menuItem.mainImage || 'https://via.placeholder.com/300x200',
        isAvailable: updatedData.menuItem.isAvailable,
      };

      onSave(updatedItem);
      onClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to update menu item');
    }
  };

  const handleCloseKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full relative">
        {/* Cancel Icon */}
        <div
          role="button"
          aria-label="Close modal"
          tabIndex={0}
          className="absolute top-4 right-4 text-orange-500 dark:text-gray-300 hover:text-orange-700 dark:hover:text-gray-100 cursor-pointer"
          onClick={onClose}
          onKeyDown={handleCloseKeyDown}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Update Your: <span className='text-orange-500'>{formData.name}</span> </h2>
        {submitError && <div className="text-red-600 mb-4">{submitError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-white ${errors.name ? 'border-red-500' : ''}`}
              required
            />
            <ErrorMessage error={errors.name} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-gray-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-white ${errors.description ? 'border-red-500' : ''}`}
              required
            />
            <ErrorMessage error={errors.description} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-gray-300">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-white ${errors.price ? 'border-red-500' : ''}`}
              step="0.01"
              required
            />
            <ErrorMessage error={errors.price} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-gray-300">Category</label>
            <CategorySelect
              restaurantId={restaurantId}
              value={formData.category}
              onChange={handleInputChange}
              required
            />
            <ErrorMessage error={errors.category} />
          </div>
          <div className="mb-4 flex flex-row">
            
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-orange-600"
            /> <label className="block text-sm font-medium dark:text-gray-300 ml-3">Available</label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-gray-300">Main Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'mainImage')}
              className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-white ${errors.mainImage ? 'border-red-500' : ''}`}
            />
            <ErrorMessage error={errors.mainImage} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-gray-300">Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'thumbnailImage')}
              className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-white ${errors.thumbnailImage ? 'border-red-500' : ''}`}
            />
            <ErrorMessage error={errors.thumbnailImage} />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuItemModal;