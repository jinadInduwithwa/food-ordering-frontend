import { useState } from "react";
import ResturentTitle from "../../components/UI/ResturentTitle";
import { registerRestaurant } from "../../utils/api";

interface RestaurantFormData {
  restaurantName: string;
  contactPerson: string;
  phoneNumber: string;
  businessType: string;
  cuisineType: string;
  operatingHours: string;
  deliveryRadius: string;
  taxId: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  password?: string;
  agreeTerms?: boolean;
  businessLicense: File | null;
  foodSafetyCert: File | null;
  exteriorPhoto: File | null;
  logo: File | null;
}

const AddResturent = () => {
  const [formData, setFormData] = useState<RestaurantFormData>({
    restaurantName: "",
    contactPerson: "",
    phoneNumber: "",
    businessType: "",
    cuisineType: "",
    operatingHours: "",
    deliveryRadius: "",
    taxId: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    email: "",
    password: "",
    agreeTerms: false,
    businessLicense: null,
    foodSafetyCert: null,
    exteriorPhoto: null,
    logo: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Options for dropdowns
  const businessTypes = ["Restaurant", "Fast Food Chain", "Cafe", "Food Truck", "Catering"];
  const cuisineTypes = ["Italian", "American", "Mexican", "Chinese", "Indian", "Other"];

  // Handle input changes for text, select, and checkbox
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      // Validate file type (e.g., PDF or image)
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!validTypes.includes(files[0].type)) {
        setError("Please upload a PDF or image (JPEG/PNG) file.");
        return;
      }
      // Validate file size (e.g., max 5MB)
      if (files[0].size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      // Allow clearing file input
      setFormData((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate required fields
    const requiredFields = [
      "restaurantName",
      "contactPerson",
      "phoneNumber",
      "businessType",
      "cuisineType",
      "operatingHours",
      "deliveryRadius",
      "taxId",
      "streetAddress",
      "city",
      "state",
      "zipCode",
      "country",
      "email",
      "password",
    ];
    for (const field of requiredFields) {
      if (!formData[field as keyof RestaurantFormData]) {
        setError(`Please fill in the ${field} field.`);
        return;
      }
    }
    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate password length
    if (formData.password && formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Log formData for debugging
    console.log("Submitting Form Data:", {
      ...formData,
      businessLicense: formData.businessLicense ? formData.businessLicense.name : null,
      foodSafetyCert: formData.foodSafetyCert ? formData.foodSafetyCert.name : null,
      exteriorPhoto: formData.exteriorPhoto ? formData.exteriorPhoto.name : null,
      logo: formData.logo ? formData.logo.name : null,
    });

    setLoading(true);
    try {
      await registerRestaurant(formData);
      setSuccess("Restaurant registered successfully!");
      // Reset form
      setFormData({
        restaurantName: "",
        contactPerson: "",
        phoneNumber: "",
        businessType: "",
        cuisineType: "",
        operatingHours: "",
        deliveryRadius: "",
        taxId: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        email: "",
        password: "",
        agreeTerms: false,
        businessLicense: null,
        foodSafetyCert: null,
        exteriorPhoto: null,
        logo: null,
      });
    } catch (err: any) {
      // Extract error message from response
      let errorMessage = "Failed to register restaurant. Please try again.";
      if (err instanceof Response) {
        try {
          const errorData = await err.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Error parsing response:", jsonError);
        }
      } else {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
      console.error("Registration error details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-4">
        <ResturentTitle text="Add New Restaurant" />
      </div>

      <div className="mx-auto w-full max-w-full sm:max-w-4xl lg:max-w-6xl">
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-200 rounded-md">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-white dark:bg-gray-700 p-4 sm:p-6 rounded-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              {/* Restaurant Name */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter restaurant name"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="+1-123-456-7890"
                />
              </div>

              {/* Business Type */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Business Type
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select business type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Operating Hours */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Operating Hours
                </label>
                <input
                  type="text"
                  name="operatingHours"
                  value={formData.operatingHours}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 10 AM - 10 PM"
                />
              </div>

              {/* Tax ID */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Tax ID
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter tax ID"
                />
              </div>

              {/* Street Address */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Street Address
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter street address"
                />
              </div>

              {/* State */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter state"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              {/* Contact Person */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter contact person"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter email"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter password"
                />
              </div>

              {/* Cuisine Type */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Cuisine Type
                </label>
                <select
                  name="cuisineType"
                  value={formData.cuisineType}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select cuisine type</option>
                  {cuisineTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Radius */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Delivery Radius
                </label>
                <input
                  type="text"
                  name="deliveryRadius"
                  value={formData.deliveryRadius}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 5 miles"
                />
              </div>

              {/* City */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter city"
                />
              </div>

              {/* Zip Code */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  pattern="\d{5}(-\d{4})?"
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter zip code"
                />
              </div>

              {/* Country */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                Business License (PDF/Image)
              </label>
              <input
                type="file"
                name="businessLicense"
                onChange={handleFileChange}
                accept=".pdf,image/jpeg,image/png"
                className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                Food Safety Certificate (PDF/Image)
              </label>
              <input
                type="file"
                name="foodSafetyCert"
                onChange={handleFileChange}
                accept=".pdf,image/jpeg,image/png"
                className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                Exterior Photo (Image)
              </label>
              <input
                type="file"
                name="exteriorPhoto"
                onChange={handleFileChange}
                accept="image/jpeg,image/png"
                className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                Logo (Image)
              </label>
              <input
                type="file"
                name="logo"
                onChange={handleFileChange}
                accept="image/jpeg,image/png"
                className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Agree Terms */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label className="text-sm text-gray-700 dark:text-gray-200">
              I agree to the{" "}
              <a href="/terms" className="text-orange-600 underline">
                terms and conditions
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-6 text-white rounded-md transition-colors text-center ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
            }`}
          >
            {loading ? "Submitting..." : "Add Restaurant"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddResturent;
