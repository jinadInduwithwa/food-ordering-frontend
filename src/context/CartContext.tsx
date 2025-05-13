import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  createCart,
  getMenuItemById,
} from "../utils/api";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

interface User {
  id: string;
  email: string;
  role: "CUSTOMER" | "RESTAURANT" | "ADMIN";
}

interface CartItem {
  _id: string;
  menuItemId: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
  mainImage?: string;
  thumbnailImage?: string;
  size?: string;
  pieces?: number;
  description?: string;
  category?: string;
}

interface CartContextType {
  cartId: string | null; // Added cartId
  cartItems: CartItem[];
  cartTotal: number;
  isCartOpen: boolean;
  toggleCart: () => void;
  addItemToCart: (
    menuItemId: string,
    quantity: number,
    restaurantId: string
  ) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItemFromCart: (itemId: string) => Promise<void>;
  clearCartItems: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartId, setCartId] = useState<string | null>(null); // Added cartId state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth() as { user: User | null };

  useEffect(() => {
    if (user?.id) {
      console.log("User ID found, fetching cart:", user.id);
      fetchCart();
    } else {
      console.log("No user ID found");
      setCartId(null);
      setCartItems([]);
      setCartTotal(0);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      if (!user?.id) {
        console.log("No user ID in fetchCart");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found in fetchCart");
        return;
      }

      console.log("Fetching cart for user:", user.id);
      const cart = await getCart(user.id);
      console.log("Fetched cart data:", cart);

      if (cart && Array.isArray(cart.items)) {
        console.log("Raw cart items:", cart.items);
        // Validate cart items before setting them
        const validItems = cart.items.filter((item: CartItem) => {
          console.log("Validating item:", item);
          const isValid =
            item &&
            item.menuItemId &&
            item.restaurantId &&
            item.name &&
            typeof item.price === "number" &&
            typeof item.quantity === "number";
          console.log("Item validation result:", isValid);
          return isValid;
        });

        console.log("Valid cart items:", validItems);
        setCartId(cart._id); // Save cartId
        setCartItems(validItems);
        calculateTotal(validItems);
      } else {
        console.log("No valid items in cart, creating new cart");
        const newCart = await createCart(user.id);
        if (newCart && Array.isArray(newCart.items)) {
          const validItems = newCart.items.filter((item: CartItem) => {
            console.log("Validating new cart item:", item);
            const isValid =
              item &&
              item.menuItemId &&
              item.restaurantId &&
              item.name &&
              typeof item.price === "number" &&
              typeof item.quantity === "number";
            console.log("New item validation result:", isValid);
            return isValid;
          });

          console.log("New cart created with valid items:", validItems);
          setCartId(newCart._id); // Save cartId
          setCartItems(validItems);
          calculateTotal(validItems);
        } else {
          console.log("No valid items in new cart");
          setCartId(null);
          setCartItems([]);
          setCartTotal(0);
        }
      }
    } catch (error) {
      console.error("Error in fetchCart:", error);
      setCartId(null);
      setCartItems([]);
      setCartTotal(0);
    }
  };

  const calculateTotal = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => {
      if (typeof item.price !== "number" || typeof item.quantity !== "number") {
        console.warn("Invalid item data:", item);
        return sum;
      }
      return sum + item.price * item.quantity;
    }, 0);

    console.log("Calculated total:", total);
    setCartTotal(total);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const addItemToCart = async (
    menuItemId: string,
    quantity: number,
    restaurantId: string
  ) => {
    try {
      if (!user?.id) {
        console.log("No user found, user:", user);
        toast.error("Please login to add items to cart");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        toast.error("Please login to add items to cart");
        return;
      }

      // Get menu item details
      const menuItem = await getMenuItemById(restaurantId, menuItemId);
      if (!menuItem) {
        throw new Error("Menu item not found");
      }

      console.log("Menu item details:", menuItem);

      const cartItem = {
        menuItemId: menuItem._id,
        restaurantId: restaurantId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: quantity,
        mainImage: menuItem.mainImage
          ? menuItem.mainImage
          : "https://via.placeholder.com/500",
        thumbnailImage: menuItem.thumbnailImage
          ? menuItem.thumbnailImage
          : "https://via.placeholder.com/200",
      };

      console.log("Adding item to cart:", {
        ...cartItem,
        userId: user.id,
        token: token.substring(0, 10) + "...",
      });

      await addToCart(user.id, cartItem);
      await fetchCart();
      toast.success("Item added to cart successfully!");
    } catch (error) {
      console.error("Add to cart error:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to add item to cart");
      } else {
        toast.error("Failed to add item to cart");
      }
    }
  };

  const updateItemQuantity = async (menuItemId: string, quantity: number) => {
    try {
      if (!user?.id) {
        console.log("No user found");
        toast.error("Please login to update cart");
        return;
      }

      console.log("Updating item quantity:", {
        userId: user.id,
        menuItemId: menuItemId,
        quantity: quantity,
      });

      await updateCartItem(user.id, menuItemId, quantity);
      await fetchCart();
      toast.success("Cart updated successfully");
    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update item quantity"
      );
    }
  };

  const removeItemFromCart = async (menuItemId: string) => {
    try {
      if (!user?.id) {
        console.log("No user found");
        toast.error("Please login to remove items from cart");
        return;
      }

      await removeCartItem(user.id, menuItemId);
      await fetchCart();
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Remove item error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to remove item from cart"
      );
    }
  };

  const clearCartItems = async () => {
    try {
      if (!user?.id) {
        console.log("No user found");
        toast.error("Please login to clear cart");
        return;
      }

      await clearCart(user.id);
      setCartId(null);
      setCartItems([]);
      setCartTotal(0);
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Clear cart error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to clear cart"
      );
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartId, // Expose cartId
        cartItems,
        cartTotal,
        isCartOpen,
        toggleCart,
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        clearCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};