import React, { useEffect, useState } from "react";
import { useDriver } from "../../context/DriverContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaMotorcycle,
  FaMapMarkerAlt,
  FaToggleOn,
  FaToggleOff,
  FaBox,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUser,
} from "react-icons/fa";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  completeDelivery,
  getCurrentDriver,
  getDeliveryStatus,
  getOrderById,
  updateDriverLocation,
} from "../../utils/api";
import OrderDetailsModal from "../../components/OrderDetailsModal";

interface DeliveryDetails {
  orderId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  customerLocation: {
    type: string;
    coordinates: [number, number];
  };
  driverLocation: {
    type: string;
    coordinates: [number, number];
  };
}

interface OrderDetails {
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  restaurantId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

const DriverDashboard: React.FC = () => {
  const { driver, isAvailable, location, updateAvailability } = useDriver();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 1.3143, lng: 103.7093 });
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >([103.7093, 1.3143]);
  const [customerLocation, setCustomerLocation] = useState<
    [number, number] | null
  >(null);
  const [deliveryDetails, setDeliveryDetails] =
    useState<DeliveryDetails | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    if (user?.id) {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (location) {
      setMapCenter({
        lat: location[1],
        lng: location[0],
      });
    }
  }, [location]);

  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Store in MongoDB format [longitude, latitude]
            const dbLocation: [number, number] = [
              position.coords.longitude,
              position.coords.latitude,
            ];
            console.log("Setting location in MongoDB format:", dbLocation);

            setCurrentLocation(dbLocation);
            // Convert to Google Maps format for display
            setMapCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });

            // Update location in backend if driver exists
            if (driver?._id) {
              await updateDriverLocation(driver._id, dbLocation);
              toast.success("Location updated successfully");
            } else {
              toast.error("Driver ID not found");
            }
          } catch (error) {
            console.error("Failed to update location:", error);
            toast.error("Failed to update location");
          }
        },
        (error) => {
          toast.error("Failed to get location");
          console.error("Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    let watchId: number | null = null;

    if (driver?._id && isAvailable) {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            try {
              const dbLocation: [number, number] = [
                position.coords.longitude,
                position.coords.latitude,
              ];

              if (
                currentLocation &&
                (Math.abs(currentLocation[0] - dbLocation[0]) > 0.0001 ||
                  Math.abs(currentLocation[1] - dbLocation[1]) > 0.0001)
              ) {
                setCurrentLocation(dbLocation);
                setMapCenter({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                });

                await updateDriverLocation(driver._id, dbLocation);
                console.log("Location updated in backend");
              }
            } catch (error) {
              console.error("Failed to update location in backend:", error);
            }
          },
          (error) => {
            console.error("Geolocation watch error:", error);
            let errorMessage = "Failed to watch location";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "Location access denied";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information unavailable";
                break;
              case error.TIMEOUT:
                errorMessage = "Location request timed out";
                break;
            }
            toast.error(errorMessage);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      }
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [driver?._id, isAvailable, currentLocation]);

  const handleToggleAvailability = async () => {
    try {
      if (!driver) {
        toast.error("Please register as a driver first");
        return;
      }
      await updateAvailability(!isAvailable);
    } catch {
      toast.error("Failed to update availability");
    }
  };

  const handleCompleteDelivery = async () => {
    try {
      if (!driver?._id) {
        toast.error("Driver ID not found");
        return;
      }

      await completeDelivery(driver._id);
      toast.success("Delivery completed successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Complete delivery error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to complete delivery"
      );
    }
  };

  const fetchDriverData = async () => {
    try {
      if (!user?.id) return;

      const response = await getCurrentDriver(user.id);
      if (response.data) {
        console.log("Driver data updated:", response.data);

        if (driver?.currentDelivery !== response.data.currentDelivery) {
          if (response.data.currentDelivery) {
            toast.info("New delivery assigned!");
          } else {
            toast.success("Delivery completed!");
          }
        }

        if (driver?.isAvailable !== response.data.isAvailable) {
          toast.info(
            `You are now ${
              response.data.isAvailable ? "available" : "unavailable"
            } for deliveries`
          );
        }
      }
    } catch (error) {
      console.error("Error fetching driver data:", error);
    }
  };

  useEffect(() => {
    fetchDriverData();

    const intervalId = setInterval(fetchDriverData, 30000);

    return () => clearInterval(intervalId);
  }, [user?.id]);

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      if (driver?.currentDelivery) {
        try {
          const res = await getDeliveryStatus(driver.currentDelivery);
          if (res?.data) {
            setDeliveryDetails(res.data);
            if (res.data.customerLocation?.coordinates) {
              setCustomerLocation(res.data.customerLocation.coordinates);
            } else {
              setCustomerLocation(null);
            }
            if (res.data.driverLocation?.coordinates) {
              setCurrentLocation(res.data.driverLocation.coordinates);
              setMapCenter({
                lat: res.data.driverLocation.coordinates[1],
                lng: res.data.driverLocation.coordinates[0],
              });
            }
          } else {
            setDeliveryDetails(null);
            setCustomerLocation(null);
          }
        } catch {
          setDeliveryDetails(null);
          setCustomerLocation(null);
        }
      } else {
        setDeliveryDetails(null);
        setCustomerLocation(null);
      }
    };
    fetchDeliveryDetails();
  }, [driver?.currentDelivery]);

  const handleShowOrderDetails = async () => {
    console.log("handleShowOrderDetails called");
    if (deliveryDetails?.orderId) {
      console.log("Order ID:", deliveryDetails.orderId);
      try {
        const res = await getOrderById(deliveryDetails.orderId);
        console.log("Order details response:", res);
        if (res) {
          setOrderDetails(res);
          setShowOrderDetails(true);
          console.log("Modal should be open now");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Failed to fetch order details");
      }
    } else {
      console.log("No order ID found in deliveryDetails");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Driver Registration Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please register as a driver to access the dashboard.
          </p>
          <button
            onClick={() => (window.location.href = "/driver-registration")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Register as Driver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-20 mb-20 lg:max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-orange-100 rounded-full">
            <FaUser className="text-orange-500 text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Driver Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Name:</span> {user?.firstName}{" "}
                  {user?.lastName}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Driver ID:</span> {driver._id}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Vehicle Type:</span>{" "}
                  {driver.vehicleType}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Vehicle Number:</span>{" "}
                  {driver.vehicleNumber}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={isAvailable ? "text-green-600" : "text-red-600"}
                  >
                    {isAvailable ? "Available" : "Unavailable"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaMapMarkerAlt className="text-blue-500 text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Location Information</h2>
              <p className="text-gray-600">
                {currentLocation
                  ? `Current Location: Lat: ${currentLocation[1].toFixed(
                      4
                    )}, Long: ${currentLocation[0].toFixed(4)}`
                  : "Location not set"}
              </p>
            </div>
          </div>
          <button
            onClick={getCurrentLocation}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <FaMapMarkerAlt className="inline mr-2" />
            Update Location
          </button>
        </div>
        <div className="h-64 w-full rounded-lg overflow-hidden">
          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={["places"]}
          >
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={mapCenter}
              zoom={15}
            >
              {currentLocation && (
                <Marker
                  position={{
                    lat: currentLocation[1],
                    lng: currentLocation[0],
                  }}
                />
              )}
              {customerLocation && (
                <Marker
                  position={{
                    lat: customerLocation[1],
                    lng: customerLocation[0],
                  }}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <FaMotorcycle className="text-orange-500 text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Driver Status</h2>
              <p className="text-gray-600">
                Current Status:{" "}
                <span
                  className={isAvailable ? "text-green-600" : "text-red-600"}
                >
                  {isAvailable ? "Available" : "Unavailable"}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleAvailability}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isAvailable
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isAvailable ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
            <span>{isAvailable ? "Available" : "Unavailable"}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <FaBox className="text-purple-500 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold">Active Delivery</h2>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          {driver?.currentDelivery ? (
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Delivery ID:</span>{" "}
                {driver.currentDelivery}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={
                    driver.isAvailable ? "text-green-600" : "text-red-600"
                  }
                >
                  {driver.isAvailable ? "Available" : "On Delivery"}
                </span>
              </p>
              {deliveryDetails && (
                <div className="mt-4">
                  <p className="text-gray-600">
                    <span className="font-medium">Order ID:</span>{" "}
                    {deliveryDetails.orderId}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Created At:</span>{" "}
                    {new Date(deliveryDetails.createdAt).toLocaleString()}
                  </p>
                  <button
                    onClick={handleShowOrderDetails}
                    className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center space-x-2"
                  >
                    <FaBox />
                    <span>View Order Details</span>
                  </button>
                </div>
              )}
              {customerLocation && (
                <div className="mt-4">
                  <p className="text-gray-600">
                    <span className="font-medium">Customer Location:</span>{" "}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${customerLocation[1]},${customerLocation[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Navigate to Customer
                    </a>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600 text-center">
              No active deliveries at the moment
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {driver?.currentDelivery && (
          <button
            onClick={handleCompleteDelivery}
            className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors"
          >
            <div className="p-3 bg-green-100 rounded-full">
              <FaCheckCircle className="text-green-500 text-2xl" />
            </div>
            <span className="font-medium">Complete Delivery</span>
          </button>
        )}
        <button className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-yellow-100 rounded-full">
            <FaExclamationTriangle className="text-yellow-500 text-2xl" />
          </div>
          <span className="font-medium">Report Issue</span>
        </button>
      </div>

      {orderDetails && (
        <OrderDetailsModal
          isOpen={showOrderDetails}
          onClose={() => setShowOrderDetails(false)}
          title="Order Details"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Delivery Address</h3>
              <p>
                {orderDetails.deliveryAddress.street},{" "}
                {orderDetails.deliveryAddress.city},{" "}
                {orderDetails.deliveryAddress.state}{" "}
                {orderDetails.deliveryAddress.zipCode},{" "}
                {orderDetails.deliveryAddress.country}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Order Details</h3>
              <p>Status: {orderDetails.status}</p>
              <p>Total Amount: ${orderDetails.totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Items</h3>
              <ul className="list-disc list-inside">
                {orderDetails.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - ${item.price.toFixed(2)} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </OrderDetailsModal>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg">
        <div className="flex justify-around p-4">
          <button className="flex flex-col items-center space-y-1">
            <FaMotorcycle className="text-orange-500" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <FaBox className="text-gray-500" />
            <span className="text-xs">Deliveries</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <FaMapMarkerAlt className="text-gray-500" />
            <span className="text-xs">Location</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
