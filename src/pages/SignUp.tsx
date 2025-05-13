import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline, IoLogoApple } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";
import CustomButton from "@/components/UI/CustomButton";
import { useAuth } from "@/context/AuthContext";
import { register } from "@/utils/api";

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface FormErrors {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

function SignUp() {
  const navigate = useNavigate();
  useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationPin, setVerificationPin] = useState("");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "CUSTOMER",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = () => {
    window.location.href = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/auth/google`;
  };

  const handleAppleSignIn = () => {
    window.location.href = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/auth/facebook`;
  };

  const validateEmail = (email: string) => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return false;
    }
    if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const validateForm = () => {
    let isValid = true;
    if (!formData.firstName.trim()) {
      setErrors((prev) => ({ ...prev, firstName: "First name is required" }));
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      setErrors((prev) => ({ ...prev, lastName: "Last name is required" }));
      isValid = false;
    }
    if (!formData.address.street.trim()) {
      setErrors((prev) => ({
        ...prev,
        address: { ...prev.address, street: "Street is required" },
      }));
      isValid = false;
    }
    if (!formData.address.city.trim()) {
      setErrors((prev) => ({
        ...prev,
        address: { ...prev.address, city: "City is required" },
      }));
      isValid = false;
    }
    if (!formData.address.state.trim()) {
      setErrors((prev) => ({
        ...prev,
        address: { ...prev.address, state: "State is required" },
      }));
      isValid = false;
    }
    if (!formData.address.zipCode.trim()) {
      setErrors((prev) => ({
        ...prev,
        address: { ...prev.address, zipCode: "Zip code is required" },
      }));
      isValid = false;
    }
    if (!formData.address.country.trim()) {
      setErrors((prev) => ({
        ...prev,
        address: { ...prev.address, country: "Country is required" },
      }));
      isValid = false;
    } else if (formData.address.country.toLowerCase() !== "sri lanka") {
      setErrors((prev) => ({
        ...prev,
        address: { ...prev.address, country: "Only Sri Lanka is allowed" },
      }));
      isValid = false;
    }
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as Record<string, string>),
          [child]: value,
        },
      }));
      // Clear address field errors
      setErrors((prev) => ({
        ...prev,
        address: { ...prev.address, [child]: "" },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear field errors
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFormSubmit = async () => {
    if (
      !validateEmail(formData.email) ||
      !validatePassword(formData.password) ||
      !validateForm()
    ) {
      return;
    }

    // Ensure country is Sri Lanka
    const submitData = {
      ...formData,
      address: {
        ...formData.address,
        country: "Sri Lanka",
      },
    };

    setIsLoading(true);
    try {
      await register(submitData);
      setIsVerificationStep(true);
      toast.success("Please check your email for verification code");
    } catch (error: unknown) {
      if (error instanceof Response) {
        const data = await error.json();
        if (data.errors) {
          // Handle field validation errors
          data.errors.forEach((err: { path: string; msg: string }) => {
            if (err.path === "lastName") {
              setErrors((prev) => ({ ...prev, lastName: err.msg }));
            } else if (err.path === "firstName") {
              setErrors((prev) => ({ ...prev, firstName: err.msg }));
            } else if (err.path === "password") {
              setErrors((prev) => ({ ...prev, password: err.msg }));
            } else if (err.path.startsWith("address.")) {
              const field = err.path.split(".")[1];
              setErrors((prev) => ({
                ...prev,
                address: { ...prev.address, [field]: err.msg },
              }));
            }
          });
        } else if (data.message) {
          // Handle general error messages
          toast.error(data.message);
        }
      } else {
        toast.error("Failed to create account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async () => {
    if (!verificationPin) {
      toast.error("Please enter verification code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3010/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          pin: verificationPin,
        }),
      });

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      toast.success("Account verified successfully!");
      navigate("/signin");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to verify account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerificationStep) {
    return (
      <div className="mx-auto flex w-full mt-20 lg:mt-0 max-w-[1920px] flex-col lg:flex-row min-h-screen">
        <Toaster position="top-right" reverseOrder={false} />

        {/* Background Image */}
        <div className="hidden lg:block lg:w-[55%] h-screen sticky top-0">
          <img
            src="./Signup/Signupbg.webp"
            alt="Laptop Background"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex w-full flex-col px-[20px] pt-[20px] sm:px-[30px] sm:pt-[30px] md:px-20 lg:w-[45%] lg:px-[60px] lg:pt-[80px] 2xl:px-[165px] 2xl:pt-[154px] min-h-screen">
          <div className="w-full mb-4 hidden lg:block">
            <span className="text-4xl font-bold text-orange-600">FoodyX</span>
          </div>
          <div className="flex w-full flex-col lg:mt-10">
            <h2 className="font-PlusSans text-[24px] font-bold leading-[32px] text-[#000] lg:text-[36px]">
              Verify Your Email
            </h2>
            <span className="mt-5 font-PlusSans text-sm font-medium leading-6 text-black lg:text-base lg:leading-8">
              Please enter the verification code sent to your email.
            </span>
            <div className="mt-[32px] flex gap-2 justify-center">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={verificationPin[index] || ""}
                  onChange={(e) => {
                    const newPin = [...verificationPin];
                    newPin[index] = e.target.value;
                    setVerificationPin(newPin.join(""));
                    // Auto-focus next input
                    if (e.target.value && index < 5) {
                      const nextInput = document.querySelector(
                        `input[name="otp-${index + 1}"]`
                      ) as HTMLInputElement;
                      nextInput?.focus();
                    }
                  }}
                  name={`otp-${index}`}
                  className="w-12 h-12 text-center font-PlusSans text-[14px] font-normal leading-[24px] text-black border-b-2 border-[#000] focus:outline-none focus:border-orange-600"
                />
              ))}
            </div>
            <div className="mt-[32px] w-full">
              <CustomButton
                title={isLoading ? "Verifying..." : "Verify Account"}
                bgColor="bg-orange-600"
                textColor="text-white"
                onClick={handleVerificationSubmit}
                style="hover:bg-orange-700"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full mt-20 lg:mt-0 max-w-[1920px] flex-col lg:flex-row min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Laptop Image */}
      <div className="hidden lg:block lg:w-[55%] h-screen sticky top-0">
        <img
          src="./Signup/Signupbg.webp"
          alt="Laptop Background"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="flex w-full flex-col px-[20px] pt-[20px] sm:px-[30px] sm:pt-[30px] md:px-20 lg:w-[45%] lg:px-[60px] lg:pt-[80px] 2xl:px-[165px] 2xl:pt-[154px] min-h-screen">
        {/* Logo */}
        <div className="w-full mb-4 hidden lg:block">
          <span className="text-4xl font-bold text-orange-600">FoodyX</span>
        </div>

        {/* Sign Up Section */}
        <div className="flex w-full flex-col lg:mt-10">
          <h2 className="font-PlusSans text-[24px] font-bold leading-[32px] text-[#000] lg:text-[36px]">
            Create Account
          </h2>
          <span className="mt-5 font-PlusSans text-sm font-medium leading-6 text-black lg:text-base lg:leading-8">
            Create your account to start ordering delicious food.
          </span>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4 mt-[32px]">
            <div className="space-y-1">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className={`w-full font-PlusSans text-[14px] font-normal leading-[24px] text-black placeholder:text-[#646464] focus:outline-none ${
                  errors.firstName ? "text-red-500" : ""
                }`}
              />
              <div
                className={`h-[1px] w-full ${
                  errors.firstName ? "bg-red-500" : "bg-[#000]"
                }`}
              ></div>
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-1">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className={`w-full font-PlusSans text-[14px] font-normal leading-[24px] text-black placeholder:text-[#646464] focus:outline-none ${
                  errors.lastName ? "text-red-500" : ""
                }`}
              />
              <div
                className={`h-[1px] w-full ${
                  errors.lastName ? "bg-red-500" : "bg-[#000]"
                }`}
              ></div>
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email Input */}
          <div className="mt-[24px] space-y-1">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Username@example.com"
              className={`w-full font-PlusSans text-[14px] font-normal leading-[24px] text-black placeholder:text-[#646464] focus:outline-none ${
                errors.email ? "text-red-500" : ""
              }`}
            />
            <div
              className={`h-[1px] w-full ${
                errors.email ? "bg-red-500" : "bg-[#000]"
              }`}
            ></div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="mt-[24px] space-y-1">
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create Password"
                className={`w-full font-PlusSans text-[14px] font-normal leading-[24px] text-black placeholder:text-[#646464] focus:outline-none ${
                  errors.password ? "text-red-500" : ""
                }`}
              />
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <IoEyeOutline
                    size={20}
                    color={errors.password ? "#EF4444" : "#646464"}
                  />
                ) : (
                  <IoEyeOffOutline
                    size={20}
                    color={errors.password ? "#EF4444" : "#646464"}
                  />
                )}
              </div>
            </div>
            <div
              className={`h-[1px] w-full ${
                errors.password ? "bg-red-500" : "bg-[#000]"
              }`}
            ></div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Address Fields */}
          <div className="mt-[24px] space-y-4">
            <div className="space-y-1">
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                placeholder="Street Address"
                className={`w-full font-PlusSans text-[14px] font-normal leading-[24px] text-black placeholder:text-[#646464] focus:outline-none ${
                  errors.address.street ? "text-red-500" : ""
                }`}
              />
              <div
                className={`h-[1px] w-full ${
                  errors.address.street ? "bg-red-500" : "bg-[#000]"
                }`}
              ></div>
              {errors.address.street && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.address.street}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className={`w-full font-PlusSans text-[14px] font-normal leading-[24px] text-black placeholder:text-[#646464] focus:outline-none ${
                    errors.address.city ? "text-red-500" : ""
                  }`}
                />
                <div
                  className={`h-[1px] w-full ${
                    errors.address.city ? "bg-red-500" : "bg-[#000]"
                  }`}
                ></div>
                {errors.address.city && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.address.city}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className={`w-full font-PlusSans text-[14px] font-normal leading-[24px] text-black placeholder:text-[#646464] focus:outline-none ${
                    errors.address.state ? "text-red-500" : ""
                  }`}
                />
                <div
                  className={`h-[1px] w-full ${
                    errors.address.state ? "bg-red-500" : "bg-[#000]"
                  }`}
                ></div>
                {errors.address.state && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.address.state}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleInputChange}
                  placeholder="Zip Code"
                  className={`w-full font-PlusSans text-[14px] font-normal leading-[24px] text-black placeholder:text-[#646464] focus:outline-none ${
                    errors.address.zipCode ? "text-red-500" : ""
                  }`}
                />
                <div
                  className={`h-[1px] w-full ${
                    errors.address.zipCode ? "bg-red-500" : "bg-[#000]"
                  }`}
                ></div>
                {errors.address.zipCode && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.address.zipCode}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className={`w-full font-PlusSans text-[14px] font-normal leading-[24px] text-black placeholder:text-[#646464] focus:outline-none ${
                    errors.address.country ? "text-red-500" : ""
                  }`}
                />
                <div
                  className={`h-[1px] w-full ${
                    errors.address.country ? "bg-red-500" : "bg-[#000]"
                  }`}
                ></div>
                {errors.address.country && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.address.country}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sign Up Button */}
          <div className="mt-[32px] w-full">
            <CustomButton
              title={isLoading ? "Creating Account..." : "Create Account"}
              bgColor="bg-orange-600"
              textColor="text-white"
              onClick={handleFormSubmit}
              style="hover:bg-orange-700"
              disabled={isLoading}
            />
          </div>

          <div className="mt-[23px] flex items-center justify-center font-PlusSans text-sm leading-6 text-black">
            or continue with
          </div>

          {/* Social Login Buttons */}
          <div className="mt-[24px] flex items-center justify-center space-x-[9px] lg:mt-[46px]">
            <div
              className="flex h-[46px] w-[105px] cursor-pointer items-center justify-center border-[1px] border-[#00000033] bg-white hover:border-2 hover:border-orange-600"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle size={24} />
            </div>
            <div
              className="flex h-[46px] w-[105px] cursor-pointer items-center justify-center border-[1px] border-[#00000033] bg-white hover:border-2 hover:border-orange-600"
              onClick={handleAppleSignIn}
            >
              <IoLogoApple size={24} />
            </div>
          </div>

          {/* Sign In Link */}
          <h1 className="mt-[12px] flex items-center justify-center font-PlusSans text-sm leading-6 text-[#646464]">
            Already have an account?{" "}
            <span
              className="ml-2.5 cursor-pointer font-semibold text-orange-600 hover:text-orange-700 hover:underline"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </h1>

           {/* Sign In Link */}
           <h1 className="mt-[12px] flex items-center justify-center font-PlusSans text-sm leading-6 text-[#646464]">
            If you want join us?{" "}
            <span
              className="ml-2.5 cursor-pointer font-semibold text-orange-600 hover:text-orange-700 hover:underline"
              onClick={() => navigate("/resturent-signup")}
            >
              Join As Resturent
            </span>
          </h1>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-center py-3 font-PlusSans text-xs leading-6 text-black lg:py-7">
          2025 © All rights reserved. FoodyX
        </div>
      </div>
    </div>
  );
}

export default SignUp;
