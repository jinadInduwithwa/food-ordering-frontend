const BASE_URL = "http://localhost:3010/api";
import { jwtDecode } from "jwt-decode";

//------------------------ Auth APIs ----------------------

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
interface UserStatusData {
  isActive?: boolean;
  isVerified?: boolean;
}

interface UserRoleData {
  role: "CUSTOMER" | "RESTAURANT" | "DELIVERY" | "ADMIN";
}

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (userData: FormData) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw response;
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw response;
    }

    return await response.json();
  } catch (error) {
    console.error("Profile fetch error:", error);
    throw error;
  }
};

export const updateProfile = async (userData: Partial<FormData>) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw response;
    }

    return await response.json();
  } catch (error) {
    console.error("Profile update error:", error);
    throw error;
  }
};

// get all users (for admin)
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/auth/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch users");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch all users error:", error);
    throw error;
  }
};
// get user by id (for admin)
export const getUserById = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/auth/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch user by ID error:", error);
    throw error;
  }
};
// update user (for admin)
export const updateUser = async (
  userId: string,
  userData: Partial<FormData & { password?: string; confirmPassword?: string }>
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/auth/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user");
    }

    return await response.json();
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
};
// delete user (for admin)
export const deleteUser = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/auth/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete user");
    }

    return await response.json();
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};
// get update user status (for admin)
export const updateUserStatus = async (userId: string, statusData: UserStatusData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/auth/users/${userId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(statusData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user status");
    }

    return await response.json();
  } catch (error) {
    console.error("Update user status error:", error);
    throw error;
  }
};
// update user role (for admin)
export const updateUserRole = async (userId: string, roleData: UserRoleData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/auth/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user role");
    }

    return await response.json();
  } catch (error) {
    console.error("Update user role error:", error);
    throw error;
  }
};

//------------------------ Restaurant APIs ----------------------

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

// Register restaurant
export const registerRestaurant = async (restaurantData: RestaurantFormData) => {
  try {
    const formData = new FormData();
    formData.append("restaurantName", restaurantData.restaurantName);
    formData.append("contactPerson", restaurantData.contactPerson);
    formData.append("phoneNumber", restaurantData.phoneNumber);
    formData.append("businessType", restaurantData.businessType);
    formData.append("cuisineType", restaurantData.cuisineType);
    formData.append("operatingHours", restaurantData.operatingHours);
    formData.append("deliveryRadius", restaurantData.deliveryRadius);
    formData.append("taxId", restaurantData.taxId);
    // Send address fields individually instead of nesting
    formData.append("streetAddress", restaurantData.streetAddress);
    formData.append("city", restaurantData.city);
    formData.append("state", restaurantData.state);
    formData.append("zipCode", restaurantData.zipCode);
    formData.append("country", restaurantData.country);
    formData.append("email", restaurantData.email);
    if (restaurantData.password) {
      formData.append("password", restaurantData.password);
    }
    if (typeof restaurantData.agreeTerms !== "undefined") {
      formData.append("agreeTerms", String(restaurantData.agreeTerms));
    }
    if (restaurantData.businessLicense) {
      formData.append("businessLicense", restaurantData.businessLicense);
    }
    if (restaurantData.foodSafetyCert) {
      formData.append("foodSafetyCert", restaurantData.foodSafetyCert);
    }
    if (restaurantData.exteriorPhoto) {
      formData.append("exteriorPhoto", restaurantData.exteriorPhoto);
    }
    if (restaurantData.logo) {
      formData.append("logo", restaurantData.logo);
    }

    const response = await fetch(`${BASE_URL}/restaurants/register`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw response;
    }

    return await response.json();
  } catch (error) {
    console.error("Restaurant registration error:", error);
    throw error;
  }
};

// Fetch restaurant by userId
export const getRestaurantByUserId = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    const response = await fetch(`${BASE_URL}/restaurants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch restaurant');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch restaurant by userId error:', error);
    throw error;
  }
};

// Update restaurant
export const updateRestaurant = async (restaurantId: string, data: { [key: string]: any }, files?: { [key: string]: File | null }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    const formData = new FormData();

    // Append text fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'address') {
        // Handle nested address object
        Object.entries(value as { [key: string]: string }).forEach(([addrKey, addrValue]) => {
          formData.append(`address[${addrKey}]`, addrValue);
        });
      } else {
        formData.append(key, value as string);
      }
    });

    // Append files if provided
    if (files) {
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });
    }

    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type; fetch will set it automatically for multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update restaurant');
    }

    return await response.json();
  } catch (error) {
    console.error('Update restaurant error:', error);
    throw error;
  }
};

// Get all resturents
export const getAllRestaurants = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`${BASE_URL}/restaurants/all?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch restaurants');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch all restaurants error:', error);
    throw error;
  }
};

// get restaurant details by id
export const getRestaurantById = async (restaurantId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch restaurant details');
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch restaurant details error:', error);
    throw error;
  }
};

// Delete a restaurant by ID
export const deleteRestaurant = async (restaurantId: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete restaurant');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete restaurant error:', error);
    throw error;
  }
};

// Update restaurant status
export const updateRestaurantStatus = async (restaurantId: string, status: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update restaurant status');
    }

    return await response.json();
  } catch (error) {
    console.error('Update restaurant status error:', error);
    throw error;
  }
};

//Update restaurant availability
export const updateRestaurantAvailability = async (availability: boolean) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${BASE_URL}/restaurants/availability`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ availability }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update restaurant availability');
    }

    return await response.json();
  } catch (error) {
    console.error('Update restaurant availability error:', error);
    throw error;
  }
}

//--------------------------- Menu items api's -------------------

// Get menu items by restaurant ID (public or authenticated)
export const getMenuItemsByRestaurantId = async (restaurantId: string, isAuthenticated: boolean = false) => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/menu-items`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch menu items');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch menu items error:', error);
    throw error;
  }
};

// Fetch a specific menu item by ID
export const getMenuItemById = async (restaurantId: string, menuItemId: string) => {
  try {
   

    const response = await fetch(
      `${BASE_URL}/restaurants/${restaurantId}/menu-items/${menuItemId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch menu item');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch menu item error:', error);
    throw error;
  }
};

// Update a menu item
export const updateMenuItem = async (
  restaurantId: string,
  menuItemId: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
  }>,
  files?: { mainImage?: File; thumbnailImage?: File }
) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    // Append text fields
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.category) formData.append('category', data.category);
    if (data.isAvailable !== undefined) formData.append('isAvailable', data.isAvailable.toString());

    // Append files if provided
    if (files?.mainImage) formData.append('mainImage', files.mainImage);
    if (files?.thumbnailImage) formData.append('thumbnailImage', files.thumbnailImage);

    const response = await fetch(
      `${BASE_URL}/restaurants/${restaurantId}/menu-items/${menuItemId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type; fetch sets it automatically for FormData
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update menu item');
    }

    return await response.json();
  } catch (error) {
    console.error('Update menu item error:', error);
    throw error;
  }
};

// Delete a menu item
export const deleteMenuItem = async (restaurantId: string, menuItemId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${BASE_URL}/restaurants/${restaurantId}/menu-items/${menuItemId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete menu item');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete menu item error:', error);
    throw error;
  }
};

// add menu item
export const addMenuItem = async (
  restaurantId: string,
  data: {
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
  },
  files?: {
    mainImage?: File;
    thumbnailImage?: File;
  }
) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  
  // Append text fields
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('price', data.price.toString());
  formData.append('category', data.category);
  formData.append('isAvailable', data.isAvailable.toString());

  // Append files if provided
  if (files?.mainImage) {
    formData.append('mainImage', files.mainImage);
  }
  if (files?.thumbnailImage) {
    formData.append('thumbnailImage', files.thumbnailImage);
  }

  const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/menu-items`, {
    method: 'POST',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      // Do not set Content-Type for FormData; browser sets it with boundary
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add menu item');
  }

  return response.json();
};

//--------------------------- Category APIs -------------------

interface CategoryData {
  name: string;
  description?: string;
}

// Get all categories for a restaurant
export const getCategories = async (restaurantId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch categories");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch categories error:", error);
    throw error;
  }
};

// Add a new category
export const addCategory = async (restaurantId: string, data: CategoryData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add category");
    }

    return await response.json();
  } catch (error) {
    console.error("Add category error:", error);
    throw error;
  }
};

// Update an existing category
export const updateCategory = async (
  restaurantId: string,
  categoryId: string,
  data: Partial<CategoryData>
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/categories/${categoryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update category");
    }

    return await response.json();
  } catch (error) {
    console.error("Update category error:", error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (restaurantId: string, categoryId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete category");
    }

    return await response.json();
  } catch (error) {
    console.error("Delete category error:", error);
    throw error;
  }
};

// Get category by ID (public)
// Get category by ID (public)
export const getCategoryById = async (restaurantId: string, categoryId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}/categories/${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch category");
    }

    const data = await response.json();
    return data.data; // Extract data field
  } catch (error) {
    console.error("Fetch category by ID error:", error);
    throw error;
  }
};

//--------------------------- Cart APIs -------------------

interface CartItem {
  _id?: string;
  menuItemId: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
  mainImage?: string;
  thumbnailImage?: string;
}

// Get cart
export const getCart = async (cartId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/carts/${cartId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }

    return await response.json();
  } catch (error) {
    console.error("Get cart error:", error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (cartId: string, item: CartItem) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const requestBody = {
      menuItemId: item.menuItemId,
      restaurantId: item.restaurantId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      mainImage: item.mainImage
        ? item.mainImage
        : "https://via.placeholder.com/500",
      thumbnailImage: item.thumbnailImage
        ? item.thumbnailImage
        : "https://via.placeholder.com/200",
    };

    console.log("Sending cart request:", {
      url: `${BASE_URL}/carts/${cartId}/items`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.substring(0, 10) + "...",
      },
      body: requestBody,
    });

    const response = await fetch(`${BASE_URL}/carts/${cartId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log("Raw response:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      console.error("Cart API error:", {
        status: response.status,
        statusText: response.statusText,
        error: data,
        requestBody: requestBody,
      });
      throw new Error(data.message || "Failed to add item to cart");
    }

    console.log("Cart API success:", data);
    return data;
  } catch (error) {
    console.error("Add to cart error:", error);
    throw error;
  }
};

// Update cart item
export const updateCartItem = async (
  userId: string,
  menuItemId: string,
  quantity: number
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // First, get the cart to verify the item exists
    const cartResponse = await fetch(`${BASE_URL}/carts/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!cartResponse.ok) {
      throw new Error("Cart not found");
    }

    const cart = await cartResponse.json();
    const itemExists = cart.items.some(
      (item: CartItem) => item.menuItemId === menuItemId
    );

    if (!itemExists) {
      throw new Error("Item not found in cart");
    }

    const response = await fetch(
      `${BASE_URL}/carts/${userId}/items/${menuItemId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update cart item");
    }

    return await response.json();
  } catch (error) {
    console.error("Update cart item error:", error);
    throw error;
  }
};

// Remove cart item
export const removeCartItem = async (userId: string, menuItemId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${BASE_URL}/carts/${userId}/items/${menuItemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to remove cart item");
    }

    return await response.json();
  } catch (error) {
    console.error("Remove cart item error:", error);
    throw error;
  }
};

// Clear cart
export const clearCart = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/carts/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to clear cart");
    }

    return await response.json();
  } catch (error) {
    console.error("Clear cart error:", error);
    throw error;
  }
};

// Create a new cart
export const createCart = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("Creating cart for user:", userId);

    const response = await fetch(`${BASE_URL}/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    // Log the raw response for debugging
    const responseText = await response.text();
    console.log("Raw create cart response:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      console.error("Create cart error:", {
        status: response.status,
        statusText: response.statusText,
        error: data,
      });
      throw new Error(data.message || "Failed to create cart");
    }

    console.log("Cart created successfully:", data);
    return data;
  } catch (error) {
    console.error("Create cart error:", error);
    throw error;
  }
};
//------------------- order api's ------------------
interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CreateOrderData {
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: "CREDIT_CARD" | "CASH" | "ONLINE";
}

interface OrderStatus {
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY_FOR_PICKUP"
    | "ON_THE_WAY"
    | "DELIVERED"
    | "CANCELLED";
}

export const createOrder = async (orderData: CreateOrderData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create order");
    }

    return await response.json();
  } catch (error) {
    console.error("Create order error:", error);
    throw error;
  }
};

// Get orders by restaurant ID
// Fetches orders for the restaurant ID derived from the JWT token's userId
export const getOrdersByRestaurantId = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Decode JWT token to extract userId (used as restaurantId)
    const decoded: { userId: string } = jwtDecode(token);
    const restaurantId = decoded.userId;
    if (!restaurantId) {
      throw new Error("Restaurant ID not found in token");
    }
    console.log("resturent id eka thamai apu meka ",restaurantId)

    const response = await fetch(`${BASE_URL}/orders/restaurant/${restaurantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch restaurant orders");
    }

    return await response.json();
  } catch (error) {
    console.error("Get restaurant orders error:", error);
    throw error;
  }
};


// Get orders by user ID
export const getOrdersByUserId = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/orders/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch orders");
    }

    return await response.json();
  } catch (error) {
    console.error("Get orders error:", error);
    throw error;
  }
};


// Get order by ID
export const getOrderById = async (orderId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch order");
    }

    return await response.json();
  } catch (error) {
    console.error("Get order error:", error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus["status"]
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update order status");
    }

    return await response.json();
  } catch (error) {
    console.error("Update order status error:", error);
    throw error;
  }
};

// Delete order by ID
export const deleteOrder = async (orderId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete order");
    }

    // For 204 No Content, we don't need to parse JSON
    if (response.status === 204) {
      return null;
    }

    // For other success statuses, parse JSON
    return await response.json();
  } catch (error) {
    console.error("Delete order error:", error);
    throw error;
  }
};

// Cancel order by ID
export const cancelOrder = async (orderId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "CANCELLED" }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to cancel order";

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use the raw text
        console.log("Error parsing JSON:", e);
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Cancel order error:", error);
    throw error;
  }
};

//--------------------------- Payment APIs -------------------

interface PaymentData {
  userId: string;
  cartId: string;
  orderId: string;
  restaurantId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "CREDIT_CARD" | "DEBIT_CARD";
  cardDetails: {
    cardNumber: string;
    cardHolderName: string;
  };
}

/**
 * Initiates a payment process by calling the payment service's /process endpoint.
 * Returns the PayHere payload and hash for redirecting to the PayHere payment page.
 * @param paymentData - Data required to initiate the payment
 * @returns Promise resolving to the payment initiation response
 * @throws Error if the request fails or token is missing
 */
export const initiatePayment = async (paymentData: PaymentData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/payments/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to initiate payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Initiate payment error:", error);
    throw error;
  }
};
// get all payments
export const getAllPayments = async (params: {
  status?: string;
  restaurantId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.restaurantId) query.set("restaurantId", params.restaurantId);
    if (params.startDate) query.set("startDate", params.startDate);
    if (params.endDate) query.set("endDate", params.endDate);
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/payments/all?${query.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch payments");
    }

    return await response.json();
  } catch (error) {
    console.error("Get all payments error:", error);
    throw error;
  }
};
// refund payments
export const refundPayment = async ({ paymentId, reason }: { paymentId: string; reason: string }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/payments/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentId, reason }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Refund payment failed:", { status: response.status, data });
      throw new Error(data.message || "Failed to refund payment");
    }

    // Normalize response to match frontend expectation
    return {
      success: data.success,
      data: {
        paymentId: data.paymentId,
        paymentStatus: data.paymentStatus,
        refundReason: reason,
      },
      message: data.message || "Payment refunded successfully",
    };
  } catch (error) {
    console.error("Refund payment error:", error);
    throw error;
  }
};


//------------------------ Driver APIs ----------------------

interface DriverFormData {
  userId: string;
  vehicleType: "BIKE" | "CAR" | "VAN";
  vehicleNumber: string;
  location: [number, number];
}

// Register driver
export const registerDriver = async (driverData: DriverFormData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/drivers/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(driverData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register driver");
    }

    return await response.json();
  } catch (error) {
    console.error("Register driver error:", error);
    throw error;
  }
};

// Update driver location
export const updateDriverLocation = async (
  driverId: string,
  location: [number, number]
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/drivers/${driverId}/location`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ location }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update location");
    }

    return await response.json();
  } catch (error) {
    console.error("Update location error:", error);
    throw error;
  }
};

// Update driver availability
export const updateDriverAvailability = async (
  driverId: string,
  isAvailable: boolean
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    if (!driverId) {
      throw new Error("Driver ID is required");
    }

    const response = await fetch(
      `${BASE_URL}/drivers/${driverId}/availability`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isAvailable,
          driverId, // Add driverId to the request body
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update availability");
    }

    return await response.json();
  } catch (error) {
    console.error("Update availability error:", error);
    throw error;
  }
};

// Get available drivers
export const getAvailableDrivers = async (
  latitude: number,
  longitude: number,
  maxDistance: number = 5000
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/drivers/available?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch available drivers");
    }

    return await response.json();
  } catch (error) {
    console.error("Get available drivers error:", error);
    throw error;
  }
};

// Get driver details
export const getDriverDetails = async (driverId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await fetch(`${BASE_URL}/drivers/${driverId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch driver details");
    }

    return await response.json();
  } catch (error) {
    console.error("Get driver details error:", error);
    throw error;
  }
};

// Get current driver details
export const getCurrentDriver = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("userId", userId);

    const response = await fetch(`${BASE_URL}/drivers/me?userId=${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch driver details");
    }

    return await response.json();
  } catch (error) {
    console.error("Get current driver error:", error);
    throw error;
  }
};

// Assign delivery to driver
export const assignDelivery = async (driverId: string, deliveryId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/drivers/${driverId}/assign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ deliveryId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to assign delivery");
    }

    return await response.json();
  } catch (error) {
    console.error("Assign delivery error:", error);
    throw error;
  }
};


// Complete delivery
export const completeDelivery = async (driverId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }


    const response = await fetch(`${BASE_URL}/drivers/${driverId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to complete delivery");
    }

    return await response.json();
  } catch (error) {
    console.error("Complete delivery error:", error);
    throw error;
  }
};

// Delivery Service API
export const assignDeliveryDriver = async (
  orderId: string,
  customerLocation: [number, number]
): Promise<{ status: string; message?: string }> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Send the actual customer location coordinates [longitude, latitude]
    const requestBody = {
      orderId,
      customerLocation,
    };

    console.log("Assigning delivery driver with data:", requestBody);

    const response = await fetch(`${BASE_URL}/delivery/assign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log("Delivery assignment response:", data);

    if (response.status === 404) {
      return {
        status: "error",
        message: "No available drivers found in the area",
      };
    }

    if (!response.ok) {
      throw new Error(data.message || "Failed to assign delivery driver");
    }

    return {
      status: "success",
      message: data.message,
    };
  } catch (error) {
    console.error("Delivery assignment error:", error);
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to assign delivery driver",
    };
  }
};

export const updateDeliveryStatus = async (
  deliveryId: string,
  status: string,
  location: [number, number]
) => {
  const response = await fetch(`${BASE_URL}/delivery/${deliveryId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
      location,
    }),
  });
  return response.json();
};

export const getDeliveryStatus = async (deliveryId: string) => {
  const response = await fetch(`${BASE_URL}/delivery/${deliveryId}/status`);
  return response.json();
};

export const getDriverLocation = async (deliveryId: string) => {
  const response = await fetch(`${BASE_URL}/delivery/${deliveryId}/location`);
  return response.json();
};

export const getDeliveryStatusbyOrderId = async (orderId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/delivery/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch delivery status");
    }

    return response.json();
  } catch (error) {
    console.error("Get delivery status error:", error);
    throw error;
  }
};

