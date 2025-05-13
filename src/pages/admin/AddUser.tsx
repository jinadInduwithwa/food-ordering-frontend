import { useState, useEffect } from "react";
import RestaurantTitle from "../../components/UI/ResturentTitle"; // Adjusted to RestaurantTitle
import { register } from "../../utils/api";

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "RESTAURANT" | "DELIVERY" | "ADMIN" | "";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  agreeTerms: boolean;
}

const AddUser = () => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    agreeTerms: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Options for role dropdown
  const roleOptions = ["CUSTOMER", "RESTAURANT", "DELIVERY", "ADMIN"];

  // Generate random password
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  // Set initial password on component mount
  useEffect(() => {
    setFormData((prev) => ({ ...prev, password: generatePassword() }));
  }, []);

  // Handle input changes for text, select, and checkbox
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "role",
      "street",
      "city",
      "state",
      "zipCode",
      "country",
    ];
    for (const field of requiredFields) {
      if (!formData[field as keyof UserFormData]) {
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
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Prepare data for register API
    const registerData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role as "CUSTOMER" | "RESTAURANT" | "DELIVERY" | "ADMIN",
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
    };

    // Log formData for debugging
    console.log("Submitting Form Data:", registerData);

    setLoading(true);
    try {
      // Register user
      await register(registerData);

    //   // Send welcome email
    //   await sendWelcomeEmail({
    //     email: formData.email,
    //     password: formData.password,
    //   });

      setSuccess("User registered successfully! A welcome email has been sent.");
      // Reset form with new password
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: generatePassword(),
        role: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        agreeTerms: false,
      });
    } catch (err: any) {
      // Extract error message from response
      let errorMessage = "Failed to register user. Please try again.";
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
        <RestaurantTitle text="Add New User" />
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
              {/* First Name */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter first name"
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

              {/* Role */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select role</option>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Street */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
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
              {/* Last Name */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter last name"
                />
              </div>

              {/* Password (Display Only) */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  Generated Password
                </label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  readOnly
                  className="w-full py-2 px-3 border rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 focus:outline-none"
                  placeholder="Generated password"
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
            {loading ? "Submitting..." : "Add User"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddUser;