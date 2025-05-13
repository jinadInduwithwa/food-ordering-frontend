import React, { useState } from 'react';
import { addCategory } from '../../utils/api';
import Message from '../UI/FormSuccessMessage';
import FormErrorMessage from '../UI/FormErrorMessage';

export interface Category {
  _id: string;
  name: string;
  description: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryTableProps {
  headers: string[];
  data: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  restaurantId: string;
}

const AddCategories: React.FC<CategoryTableProps> = ({ headers, data, setCategories, restaurantId }) => {
  const [categories, setLocalCategories] = useState<Category[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Handle new category input changes
  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newCategory.name.trim()) {
      errors.name = 'Name is required';
    }
    if (newCategory.description && !newCategory.description.trim()) {
      errors.description = 'Description cannot be empty';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle adding a new category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await addCategory(restaurantId, newCategory);
      const addedCategory: Category = {
        _id: response.category._id,
        name: response.category.name,
        description: response.category.description || '',
        restaurantId: response.category.restaurantId,
        createdAt: response.category.createdAt,
        updatedAt: response.category.updatedAt,
      };
      const updateCategories = (prev: Category[]) => [...prev, addedCategory];
      setLocalCategories(updateCategories);
      setCategories(updateCategories);
      setNewCategory({ name: '', description: '' });
      setFormErrors({});
      setSubmitError(null);
    } catch (error: any) {
      if (error.response?.status === 400 && error.response.data.errors) {
        const backendErrors: Record<string, string> = {};
        error.response.data.errors.forEach(({ param, msg }: { param: string; msg: string }) => {
          backendErrors[param] = msg;
        });
        setFormErrors(backendErrors);
        setSubmitError('Please correct the errors in the form.');
      } else {
        setSubmitError(error.message || 'Failed to add category');
        console.error('Add category error:', error);
      }
    }
  };

  // Map headers to data fields
  const getFieldValue = (category: Category, header: string) => {
    switch (header.toLowerCase()) {
      case 'name':
        return category.name;
      case 'description':
        return category.description || '-';
      default:
        return '';
    }
  };

  // Filter categories by search term
  const filteredCategories = categories.filter((category) =>
    [category.name, category.description].some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort categories by name
  const sortedCategories = [...filteredCategories].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  return (
    <>
      {/* Add Category Form */}
      <div className="p-5 max-w-lg mx-auto">
        {submitError && (
          <Message
            type="error"
            message={submitError}
            onClose={() => setSubmitError(null)}
          />
        )}
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={newCategory.name}
              onChange={handleNewCategoryChange}
              required
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'
              }`}
            />
            <FormErrorMessage error={formErrors.name} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={newCategory.description}
              onChange={handleNewCategoryChange}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                formErrors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'
              }`}
              rows={4}
            />
            <FormErrorMessage error={formErrors.description} />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>

      {/* Search Bar */}
      <div className="p-5 flex justify-between items-center">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block p-5 w-full text-sm rounded-md overflow-x-auto bg-white dark:bg-gray-700">
        <table className="min-w-[1000px] w-full">
          <thead className="bg-gray-200 border-gray-200 dark:bg-gray-700 dark:border-gray-500">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="text-start py-4 px-6 font-semibold text-gray-600 dark:text-gray-200"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedCategories.map((category, index) => (
              <tr
                key={category._id}
                className={`border-b border-gray-200 dark:border-gray-500 ${
                  index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-600' : 'bg-gray-100 dark:bg-gray-700'
                } hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors`}
              >
                {headers.map((header, idx) => (
                  <td key={idx} className="py-4 px-6 text-gray-800 dark:text-white">
                    {getFieldValue(category, header)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid View */}
      <div className="lg:hidden p-5 space-y-4 overflow-y-scroll h-full">
        {sortedCategories.map((category) => (
          <div
            key={category._id}
            className="border rounded-md p-4 shadow-md hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-500 bg-white dark:bg-gray-600"
          >
            <div className="space-y-2">
              {headers.map((header, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-800 dark:text-white">{header}:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {getFieldValue(category, header)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {sortedCategories.length === 0 && (
        <div className="p-5 text-center text-gray-600 dark:text-gray-300">
          No categories found.
        </div>
      )}
    </>
  );
};

export default AddCategories;