import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaMotorcycle,
  FaStore,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaArrowLeft,
  FaCheckCircle,
  FaStar,
  FaBox,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  getOrderById,
  getDriverDetails,
  getDeliveryStatusbyOrderId,
} from "../utils/api";
import { toast } from "react-toastify";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface DeliveryStatus {
  status: string;
  data: {
    customerLocation: {
      type: string;
      coordinates: [number, number];
    };
    driverLocation: {
      type: string;
      coordinates: [number, number];
    };
    _id: string;
    orderId: string;
    driverId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    actualDeliveryTime?: string;
  };
}

interface DriverDetails {
  _id: string;
  userId: string;
  isAvailable: boolean;
  currentDelivery: string;
  vehicleType: string;
  vehicleNumber: string;
  rating: number;
  totalDeliveries: number;
  location: {
    type: string;
    coordinates: [number, number];
  };
  createdAt: string;
  updatedAt: string;
}

interface OrderStatus {
  id: number;
  status: string;
  description: string;
  time: string;
  completed: boolean;
}

interface Order {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: string;
  estimatedDeliveryTime: string;
  driverName?: string;
  driverPhone?: string;
  driverLocation?: {
    lat: number;
    lng: number;
  };
  orderDate: string;
  paymentMethod: string;
  deliveryFee: number;
  discount: number;
}

const Order: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | null>(
    null
  );
  const [currentStatus, setCurrentStatus] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 5.9765, lng: 80.5188 });
  const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(
    null
  );
  const [isTracking, setIsTracking] = useState(false);
  const [driverMarker, setDriverMarker] = useState<google.maps.Marker | null>(
    null
  );
  const [path, setPath] = useState<google.maps.Polyline | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const fetchOrderAndDeliveryDetails = async () => {
      try {
        if (!orderId) {
          toast.error("Order ID not found");
          return;
        }

        // Fetch order details
        const orderData = await getOrderById(orderId);
        if (orderData) {
          const orderWithDefaults: Order = {
            id: orderData.id || orderId,
            restaurantName:
              orderData.restaurantName || "Restaurant Name Not Available",
            restaurantAddress:
              orderData.restaurantAddress || "Address Not Available",
            deliveryAddress: orderData.deliveryAddress || {
              street: "Street Not Available",
              city: "City Not Available",
              state: "State Not Available",
              zipCode: "Zip Code Not Available",
              country: "Country Not Available",
            },
            items: orderData.items || [],
            total: orderData.total || 0,
            status: orderData.status || "PENDING",
            estimatedDeliveryTime:
              orderData.estimatedDeliveryTime || "Not Available",
            driverName: orderData.driverName,
            driverPhone: orderData.driverPhone,
            driverLocation: orderData.driverLocation,
            orderDate: orderData.orderDate || new Date().toISOString(),
            paymentMethod: orderData.paymentMethod || "Not Specified",
            deliveryFee: orderData.deliveryFee || 0,
            discount: orderData.discount || 0,
          };
          setOrder(orderWithDefaults);
        }

        // Fetch delivery status using the new endpoint
        const deliveryData = await getDeliveryStatusbyOrderId(orderId);

        console.log("deliveryData", deliveryData);

        if (deliveryData) {
          setDeliveryStatus(deliveryData);
          // Update map center to driver's location
          if (deliveryData.data?.driverLocation?.coordinates) {
            setMapCenter({
              lat: deliveryData.data.driverLocation.coordinates[0],
              lng: deliveryData.data.driverLocation.coordinates[1],
            });
          }
        }

        // Fetch driver details
        const driverDetailsData = await getDriverDetails(
          deliveryData.data.driverId
        );
        console.log("driverDetailsData", driverDetailsData);
        if (driverDetailsData?.data) {
          setDriverDetails(driverDetailsData.data);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        toast.error("Failed to fetch order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderAndDeliveryDetails();
  }, [orderId]);

  const statuses: OrderStatus[] = [
    {
      id: 1,
      status: "Order Placed",
      description: "Your order has been received",
      time: order?.orderDate
        ? new Date(order.orderDate).toLocaleTimeString()
        : "",
      completed: true,
    },
    {
      id: 2,
      status: "Preparing",
      description: "Restaurant is preparing your food",
      time: "",
      completed:
        order?.status === "PREPARING" ||
        order?.status === "READY" ||
        order?.status === "ON_DELIVERY" ||
        order?.status === "DELIVERED",
    },
    {
      id: 3,
      status: "Ready for Pickup",
      description: "Your order is ready for delivery",
      time: "",
      completed:
        order?.status === "READY" ||
        order?.status === "ON_DELIVERY" ||
        order?.status === "DELIVERED",
    },
    {
      id: 4,
      status: "On the Way",
      description: "Your order is being delivered",
      time: "",
      completed:
        order?.status === "ON_DELIVERY" || order?.status === "DELIVERED",
    },
    {
      id: 5,
      status: "Delivered",
      description: "Your order has been delivered",
      time: "",
      completed: order?.status === "DELIVERED",
    },
  ];

  // Simulate status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus((prev) => {
        if (deliveryStatus?.data?.status === "PICKED_UP") {
          return 3; // Stop at "Ready for Pickup" step
        }
        if (prev === 4 && deliveryStatus?.data?.status === "DELIVERED") {
          return statuses.length - 1;
        }
        return prev < statuses.length - 1 ? prev + 1 : prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [deliveryStatus?.data?.status]);

  // Function to handle track order button click
  const handleTrackOrder = () => {
    setIsTracking(true);
    if (deliveryStatus?.data?.driverLocation?.coordinates) {
      setMapCenter({
        lat: deliveryStatus.data.driverLocation.coordinates[0],
        lng: deliveryStatus.data.driverLocation.coordinates[1],
      });
    }
  };

  // Function to create bike icon
  const getBikeIcon = () => {
    if (!window.google) return undefined;
    return {
      url: "https://maps.google.com/mapfiles/ms/micons/motorcycling.png",
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16),
    };
  };

  // Function to update driver location on map
  const updateDriverLocation = () => {
    if (deliveryStatus?.data?.driverLocation?.coordinates) {
      const newLocation = {
        lat: deliveryStatus.data.driverLocation.coordinates[0],
        lng: deliveryStatus.data.driverLocation.coordinates[1],
      };

      setMapCenter(newLocation);

      if (driverMarker) {
        driverMarker.setPosition(newLocation);
      }

      // Update path if tracking is active
      if (
        isTracking &&
        deliveryStatus.data.customerLocation?.coordinates &&
        mapInstance
      ) {
        const pathCoordinates = [
          newLocation,
          {
            lat: deliveryStatus.data.customerLocation.coordinates[0],
            lng: deliveryStatus.data.customerLocation.coordinates[1],
          },
        ];

        if (path) {
          path.setPath(pathCoordinates);
        } else {
          const newPath = new window.google.maps.Polyline({
            path: pathCoordinates,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });
          newPath.setMap(mapInstance);
          setPath(newPath);
        }
      }
    }
  };

  // Set up interval to update driver location when tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      updateDriverLocation();
      interval = setInterval(updateDriverLocation, 5000); // Update every 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, deliveryStatus?.data?.driverLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-4">
            The order you're looking for doesn't exist.
          </p>
          <Link
            to="/orders"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/orders"
          className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Orders
        </Link>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Status</h2>
          <div className="relative">
            {statuses.map((status, index) => (
              <div key={status.id} className="flex items-start mb-6">
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStatus
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index <= currentStatus ? (
                      <FaMotorcycle className="w-4 h-4" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                    )}
                  </div>
                  {index < statuses.length - 1 && (
                    <div
                      className={`h-16 w-0.5 mx-auto ${
                        index < currentStatus ? "bg-orange-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">{status.status}</h3>
                  <p className="text-sm text-gray-500">{status.description}</p>
                  <p className="text-xs text-gray-400">{status.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Restaurant Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Restaurant Details</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <FaStore className="text-orange-500 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium">{order.restaurantName}</h3>
                  <p className="text-sm text-gray-500">
                    {order.restaurantAddress}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-orange-500 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium">Delivery Address</h3>
                  <p className="text-sm text-gray-500">
                    {`${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zipCode}, ${order.deliveryAddress.country}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Status Card */}
          {deliveryStatus?.data && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Status</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaMotorcycle className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Status</h3>
                    <p
                      className={`text-sm ${
                        deliveryStatus.data.status === "DELIVERED"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {deliveryStatus.data.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaClock className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Created At</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(deliveryStatus.data.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaClock className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Updated At</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(deliveryStatus.data.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {deliveryStatus.data.actualDeliveryTime && (
                  <div className="flex items-start">
                    <FaCheckCircle className="text-orange-500 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Actual Delivery Time</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(
                          deliveryStatus.data.actualDeliveryTime
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start">
                  <FaUser className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Driver ID</h3>
                    <p className="text-sm text-gray-500">
                      {deliveryStatus.data.driverId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Driver Information Card */}
          {driverDetails && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Driver Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaUser className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Driver ID</h3>
                    <p className="text-sm text-gray-500">{driverDetails._id}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaMotorcycle className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Vehicle Type</h3>
                    <p className="text-sm text-gray-500">
                      {driverDetails.vehicleType}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaMotorcycle className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Vehicle Number</h3>
                    <p className="text-sm text-gray-500">
                      {driverDetails.vehicleNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaStar className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Rating</h3>
                    <p className="text-sm text-gray-500">
                      {driverDetails.rating || "Not rated yet"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaBox className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Total Deliveries</h3>
                    <p className="text-sm text-gray-500">
                      {driverDetails.totalDeliveries}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Items and Payment Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Order Items</h3>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">Rs. {item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>
                  Rs.{" "}
                  {order.items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>Rs. {(order.deliveryFee || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-500">
                  -Rs. {(order.discount || 0).toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    Rs.{" "}
                    {(
                      order.items.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      ) +
                      (order.deliveryFee || 0) -
                      (order.discount || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date</span>
                <span>{new Date(order.orderDate).toLocaleString()}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Payment Method</span>
                <span>{order.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Delivery Time */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaClock className="text-orange-500 mr-3" />
    <div>
                <h3 className="font-medium">Estimated Delivery Time</h3>
                <p className="text-sm text-gray-500">
                  {order.estimatedDeliveryTime}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg ${
                isTracking
                  ? "bg-green-500 text-white"
                  : "bg-orange-500 text-white"
              }`}
              onClick={handleTrackOrder}
            >
              {isTracking ? "Tracking Active" : "Track Order"}
            </motion.button>
          </div>
        </div>

        {/* Map View */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Route</h2>
          <div className="h-96 rounded-lg overflow-hidden">
            <LoadScript
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            >
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={mapCenter}
                zoom={15}
                options={{
                  disableDefaultUI: false,
                  zoomControl: true,
                  mapTypeControl: true,
                  streetViewControl: true,
                  fullscreenControl: true,
                }}
                onLoad={(map) => {
                  setMapInstance(map);
                  if (deliveryStatus?.data?.driverLocation?.coordinates) {
                    setMapCenter({
                      lat: deliveryStatus.data.driverLocation.coordinates[0],
                      lng: deliveryStatus.data.driverLocation.coordinates[1],
                    });
                  }
                }}
              >
                {deliveryStatus?.data?.driverLocation?.coordinates && (
                  <Marker
                    position={{
                      lat: deliveryStatus.data.driverLocation.coordinates[0],
                      lng: deliveryStatus.data.driverLocation.coordinates[1],
                    }}
                    icon={getBikeIcon()}
                    title="Driver Location"
                    onLoad={(marker) => setDriverMarker(marker)}
                  />
                )}
                {deliveryStatus?.data?.customerLocation?.coordinates && (
                  <Marker
                    position={{
                      lat: deliveryStatus.data.customerLocation.coordinates[0],
                      lng: deliveryStatus.data.customerLocation.coordinates[1],
                    }}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    }}
                    title="Customer Location"
                  />
                )}
              </GoogleMap>
            </LoadScript>
          </div>
          {isTracking && (
            <div className="mt-4 text-center text-sm text-gray-600">
              <FaClock className="inline-block mr-2" />
              Tracking driver location...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
