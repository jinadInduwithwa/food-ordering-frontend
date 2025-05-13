import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { getRestaurantByUserId, updateRestaurant } from '@/utils/api';
import { IoCamera } from 'react-icons/io5';

interface Restaurant {
  _id: string;
  userId: string;
  restaurantName: string;
  contactPerson: string;
  phoneNumber: string;
  businessType: string;
  cuisineType: string;
  operatingHours: string;
  deliveryRadius: string;
  taxId: string;
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  email: string;
  status: string;
  logo?: string;
  businessLicense?: string;
  foodSafetyCert?: string;
  exteriorPhoto?: string;
}

const validationSchema = Yup.object({
  restaurantName: Yup.string().required('Restaurant name is required'),
  contactPerson: Yup.string().required('Contact person is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  businessType: Yup.string().required('Business type is required'),
  cuisineType: Yup.string().required('Cuisine type is required'),
  operatingHours: Yup.string().required('Operating hours are required'),
  deliveryRadius: Yup.string().required('Delivery radius is required'),
  taxId: Yup.string().required('Tax ID is required'),
  address: Yup.object({
    streetAddress: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('Zip code is required'),
    country: Yup.string().required('Country is required'),
  }),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const ResturentProfile: React.FC = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState<Partial<Restaurant>>({
    address: {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    logo: null,
    businessLicense: null,
    foodSafetyCert: null,
    exteriorPhoto: null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const restaurantData = await getRestaurantByUserId();
        setRestaurant(restaurantData);
        setFormData(restaurantData);
      } catch (error: any) {
        if (error.message === 'No token found. Please log in.') {
          toast.error('Please log in to view your profile');
          navigate('/signin');
        } else {
          toast.error(error.message || 'Failed to fetch restaurant details');
          console.error('Error fetching restaurant:', error);
        }
      }
    };

    fetchRestaurant();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const field = name.split('.')[1] as keyof Restaurant['address'];
      setFormData({
        ...formData,
        address: { ...formData.address!, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: inputFiles } = e.target;
    if (inputFiles && inputFiles.length > 0) {
      setFiles((prev) => ({ ...prev, [name]: inputFiles[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const { _id, userId, status, ...dataToSend } = formData;
      const updatedRestaurant = await updateRestaurant(restaurant!._id, dataToSend, files);
      setRestaurant(updatedRestaurant.restaurant);
      setFiles({ logo: null, businessLicense: null, foodSafetyCert: null, exteriorPhoto: null });
      toast.success('Restaurant updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setErrors(validationErrors);
      } else {
        toast.error(error.message || 'Failed to update restaurant');
        console.error('Update error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };



  if (!restaurant) {
    return <div className="text-gray-900 dark:text-gray-100">Loading...</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col p-4 sm:p-6 md:p-8 lg:p-12 bg-gray-50 dark:bg-gray-700 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex w-full flex-col px-2 sm:px-4 md:px-6 lg:px-8">
        

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              <img
                src={restaurant.logo || '/Home/avatar1.png'}
                alt="Restaurant Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150';
                }}
              />
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-colors cursor-pointer">
                <IoCamera size={18} />
                <input
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            )}
          </div>

          {/* Restaurant Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formData.restaurantName}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{formData.email}</p>
            <div className="mt-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs sm:text-sm px-3 py-1.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Restaurant Information */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Restaurant Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
                {errors.restaurantName && (
                  <p className="text-red-500 text-xs sm:text-sm">{errors.restaurantName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
                {errors.contactPerson && (
                  <p className="text-red-500 text-xs sm:text-sm">{errors.contactPerson}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs sm:text-sm">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  disabled
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
                {errors.email && <p className="text-red-500 text-xs sm:text-sm">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Business Type
                  </label>
                  <input
                    type="text"
                    name="businessType"
                    value={formData.businessType || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                  {errors.businessType && (
                    <p className="text-red-500 text-xs sm:text-sm">{errors.businessType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Cuisine Type
                  </label>
                  <input
                    type="text"
                    name="cuisineType"
                    value={formData.cuisineType || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                  {errors.cuisineType && (
                    <p className="text-red-500 text-xs sm:text-sm">{errors.cuisineType}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    name="operatingHours"
                    value={formData.operatingHours || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                  {errors.operatingHours && (
                    <p className="text-red-500 text-xs sm:text-sm">{errors.operatingHours}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Delivery Radius
                  </label>
                  <input
                    type="text"
                    name="deliveryRadius"
                    value={formData.deliveryRadius || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                  {errors.deliveryRadius && (
                    <p className="text-red-500 text-xs sm:text-sm">{errors.deliveryRadius}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Tax ID
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
                {errors.taxId && <p className="text-red-500 text-xs sm:text-sm">{errors.taxId}</p>}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Address Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address.streetAddress"
                  value={formData.address!.streetAddress || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
                {errors['address.streetAddress'] && (
                  <p className="text-red-500 text-xs sm:text-sm">{errors['address.streetAddress']}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address!.city || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                  {errors['address.city'] && (
                    <p className="text-red-500 text-xs sm:text-sm">{errors['address.city']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address!.state || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                  {errors['address.state'] && (
                    <p className="text-red-500 text-xs sm:text-sm">{errors['address.state']}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address!.zipCode || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                  {errors['address.zipCode'] && (
                    <p className="text-red-500 text-xs sm:text-sm">{errors['address.zipCode']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address!.country || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                  {errors['address.country'] && (
                    <p className="text-red-500 text-xs sm:text-sm">{errors['address.country']}</p>
                  )}
                </div>
              </div>
            </div>
          </div>


        </div>

        {isEditing && (
          <div className="mt-4 sm:mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResturentProfile;