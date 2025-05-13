import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaMotorcycle,
  FaTrash,
  FaBan,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  getOrdersByUserId,
  getRestaurantById,
  deleteOrder,
  cancelOrder,
} from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../components/UI/DeleteConfirmationModal";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  _id?: string;
  menuItemId?: string;
}

interface Order {
  _id: string;
  restaurantId: string;
  restaurantName?: string;
  createdAt: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY_FOR_PICKUP"
    | "ON_THE_WAY"
    | "DELIVERED"
    | "CANCELLED"
    | "cancelled";
  totalAmount: number;
  items: OrderItem[];
}

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        console.log("No user ID found");
        return;
      }

      try {
        console.log("Fetching orders for user:", user.id);
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          toast.error("Please login to view orders");
          return;
        }

        setLoading(true);
        const data = await getOrdersByUserId(user.id);
        console.log("Fetched orders:", data);

        if (!Array.isArray(data)) {
          console.error("Invalid data format received:", data);
          toast.error("Failed to load orders: Invalid data format");
          return;
        }

        // Fetch restaurant names for each order
        const ordersWithRestaurantNames = await Promise.all(
          data.map(async (order) => {
            try {
              const restaurant = await getRestaurantById(order.restaurantId);
              return {
                ...order,
                restaurantName:
                  restaurant.restaurantName || "Unknown Restaurant",
              };
            } catch (error) {
              console.error("Error fetching restaurant:", error);
              return {
                ...order,
                restaurantName: "Unknown Restaurant",
              };
            }
          })
        );

        setOrders(ordersWithRestaurantNames);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;

    try {
      setDeletingOrderId(selectedOrder._id);
      await deleteOrder(selectedOrder._id);

      // Update the orders list immediately
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== selectedOrder._id)
      );

      // Show success message
      toast.success("Order deleted successfully");

      // Close modal and reset states
      setShowDeleteModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to delete order:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete order"
      );
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedOrder(null);
  };

  const handleCancelClick = (order: Order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedOrder) return;

    try {
      setCancellingOrderId(selectedOrder._id);
      await cancelOrder(selectedOrder._id);

      // Update the order in the list
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, status: "CANCELLED" }
            : order
        )
      );

      toast.success("Order cancelled successfully");
      setShowCancelModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to cancel order:", error);
      let errorMessage = "Failed to cancel order";

      if (error instanceof SyntaxError) {
        errorMessage = "Server error occurred. Please try again later.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "DELIVERED":
        return "text-green-500";
      case "ON_THE_WAY":
        return "text-blue-500";
      case "PREPARING":
      case "READY_FOR_PICKUP":
        return "text-yellow-500";
      case "CANCELLED":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "DELIVERED":
        return <FaCheckCircle className="w-5 h-5" />;
      case "ON_THE_WAY":
        return <FaMotorcycle className="w-5 h-5" />;
      case "CANCELLED":
        return <FaTimesCircle className="w-5 h-5" />;
      default:
        return <FaClock className="w-5 h-5" />;
    }
  };

  const canCancelOrder = (status: Order["status"]) => {
    return ["PENDING", "CONFIRMED", "PREPARING"].includes(status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">You haven't placed any orders yet.</p>
            <Link
              to="/restaurants"
              className="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden mb-4"
              >
                <div className="p-4 sm:p-6">
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div className="space-y-1">
                      <h2 className="text-lg sm:text-xl font-semibold break-words">
                        {order.restaurantName}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Order #{order._id}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div
                        className={`flex items-center gap-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="text-sm sm:text-base capitalize">
                          {order.status.toLowerCase().replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {canCancelOrder(order.status) && (
                          <button
                            onClick={() => handleCancelClick(order)}
                            disabled={cancellingOrderId === order._id}
                            className="text-yellow-500 hover:text-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Cancel Order"
                          >
                            {cancellingOrderId === order._id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-500"></div>
                            ) : (
                              <FaBan className="w-5 h-5" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(order)}
                          disabled={deletingOrderId === order._id}
                          className="text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Order"
                        >
                          {deletingOrderId === order._id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500"></div>
                          ) : (
                            <FaTrash className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Section */}
                  <div className="border-t border-b py-4 my-4">
                    <h3 className="font-medium mb-2 text-sm sm:text-base">
                      Order Items:
                    </h3>
                    <ul className="space-y-2 max-h-[150px] overflow-y-auto">
                      {order.items.map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between text-sm sm:text-base"
                        >
                          <span className="break-words pr-2">{item.name}</span>
                          <span className="text-gray-500 whitespace-nowrap">
                            x{item.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer Section */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="text-base sm:text-lg font-semibold">
                      Total: Rs. {(order.totalAmount || 0).toFixed(2)}
                    </div>
                    <Link
                      to={`/order/${order._id}`}
                      className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Order"
        message={`Are you sure you want to delete this order from ${selectedOrder?.restaurantName}? This action cannot be undone.`}
        isLoading={deletingOrderId === selectedOrder?._id}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <DeleteConfirmationModal
        isOpen={showCancelModal}
        onClose={handleCancelCancel}
        onConfirm={handleCancelConfirm}
        title="Cancel Order"
        message={`Are you sure you want to cancel this order from ${selectedOrder?.restaurantName}? This action cannot be undone.`}
        isLoading={cancellingOrderId === selectedOrder?._id}
        confirmText="Cancel Order"
        cancelText="Cancel"
      />
    </div>
  );
};

export default OrdersList;
