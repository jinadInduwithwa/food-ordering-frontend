import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  registerDriver,
  updateDriverLocation,
  updateDriverAvailability,
  getCurrentDriver,
  assignDelivery,
  completeDelivery,
} from "../utils/api";
import { useAuth } from "./AuthContext";

interface Driver {
  _id: string;
  userId: string;
  vehicleType: "BIKE" | "CAR" | "VAN";
  vehicleNumber: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  isAvailable: boolean;
  currentDelivery: string;
  rating: number;
  totalDeliveries: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Delivery {
  _id: string;
  orderId: string;
  status: "PENDING" | "ASSIGNED" | "PICKED_UP" | "DELIVERED" | "CANCELLED";
  pickupLocation: [number, number];
  deliveryLocation: [number, number];
  customerName: string;
  customerPhone: string;
  restaurantName: string;
  restaurantAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface DriverContextType {
  driver: Driver | null;
  currentDelivery: Delivery | null;
  isAvailable: boolean;
  location: [number, number] | null;
  registerDriver: (data: {
    vehicleType: "BIKE" | "CAR" | "VAN";
    vehicleNumber: string;
    location: [number, number];
  }) => Promise<void>;
  updateLocation: (location: [number, number]) => Promise<void>;
  updateAvailability: (isAvailable: boolean) => Promise<void>;
  acceptDelivery: (deliveryId: string) => Promise<void>;
  completeDelivery: () => Promise<void>;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [currentDelivery, setCurrentDelivery] = useState<Delivery | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (user?.role === "DELIVERY") {
      fetchDriverDetails();
    } else if (user?.role) {
      console.warn(
        `User role ${user.role} is not authorized to access driver features`
      );
    }
  }, [user]);

  const fetchDriverDetails = async () => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const response = await getCurrentDriver(user.id);
      const driverData = response.data;

      if (!driverData) {
        throw new Error("Driver data not found");
      }

      setDriver(driverData);
      setIsAvailable(driverData.isAvailable);

      if (driverData.location?.coordinates) {
        setLocation(driverData.location.coordinates);
      } else {
        console.warn("Driver location not found in response");
        setLocation(null);
      }
    } catch (error) {
      console.error("Fetch driver details error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch driver details"
      );
    }
  };

  const registerDriverHandler = async (data: {
    vehicleType: "BIKE" | "CAR" | "VAN";
    vehicleNumber: string;
    location: [number, number];
  }) => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const driverData = await registerDriver({
        userId: user.id,
        ...data,
      });

      setDriver(driverData);
      setIsAvailable(driverData.isAvailable);
      setLocation(driverData.location.coordinates);
      toast.success("Driver registered successfully!");
    } catch (error) {
      console.error("Register driver error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to register driver"
      );
      throw error;
    }
  };

  const updateLocationHandler = async (newLocation: [number, number]) => {
    try {
      if (!driver) {
        throw new Error("Driver not registered");
      }

      await updateDriverLocation(driver._id, newLocation);
      setLocation(newLocation);
      toast.success("Location updated successfully!");
    } catch (error) {
      console.error("Update location error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update location"
      );
      throw error;
    }
  };

  const updateAvailabilityHandler = async (newAvailability: boolean) => {
    try {
      if (!driver) {
        throw new Error("Driver not registered");
      }

      if (!driver._id) {
        throw new Error("Driver ID is missing");
      }

      await updateDriverAvailability(driver._id, newAvailability);
      setIsAvailable(newAvailability);
      toast.success(
        `You are now ${
          newAvailability ? "available" : "unavailable"
        } for deliveries`
      );
    } catch (error) {
      console.error("Update availability error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update availability"
      );
      throw error;
    }
  };

  const acceptDeliveryHandler = async (deliveryId: string) => {
    try {
      if (!driver) {
        throw new Error("Driver not registered");
      }

      const delivery = await assignDelivery(driver._id, deliveryId);
      setCurrentDelivery(delivery);
      setIsAvailable(false);
      toast.success("Delivery accepted successfully!");
    } catch (error) {
      console.error("Accept delivery error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to accept delivery"
      );
      throw error;
    }
  };

  const completeDeliveryHandler = async () => {
    try {
      if (!driver || !currentDelivery) {
        throw new Error("No active delivery");
      }

      await completeDelivery(driver._id);
      setCurrentDelivery(null);
      setIsAvailable(true);
      toast.success("Delivery completed successfully!");
    } catch (error) {
      console.error("Complete delivery error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to complete delivery"
      );
      throw error;
    }
  };

  return (
    <DriverContext.Provider
      value={{
        driver,
        currentDelivery,
        isAvailable,
        location,
        registerDriver: registerDriverHandler,
        updateLocation: updateLocationHandler,
        updateAvailability: updateAvailabilityHandler,
        acceptDelivery: acceptDeliveryHandler,
        completeDelivery: completeDeliveryHandler,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (context === undefined) {
    throw new Error("useDriver must be used within a DriverProvider");
  }
  return context;
};
