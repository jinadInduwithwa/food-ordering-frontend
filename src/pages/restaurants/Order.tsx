import React, { useState, useEffect } from 'react';
import ResturentOrderTable from "../../components/restaurants/ResturentOrderTable";
import ResturentTitle from "../../components/UI/ResturentTitle";
import { getOrdersByRestaurantId } from '../../utils/api';

// Define Order interface
export interface Order {
  orderId: string; // Maps to _id
  items: string; // Formatted item list
  totalAmount: string; // Formatted as currency
  orderTime: string; // Formatted date-time
  deliveryAddress: string; // Combined address
  status: string; // Backend status
  action: string; // UI placeholder
}

// Table headers
const tableHeaders: string[] = [
  "Order ID",
  "Items",
  "Total Amount",
  "Order Time",
  "Delivery Address",
  "Status",
  "Action"
];

interface OrderPageProps {
  defaultStatus?: string; // Status to filter orders (e.g., 'PENDING')
  title: string; // Page title (e.g., 'Pending Orders')
}

const Order: React.FC<OrderPageProps> = ({ defaultStatus, title }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const apiOrders = await getOrdersByRestaurantId();
        
        // Transform API data
        const transformedOrders: Order[] = apiOrders.map((order: any) => ({
          orderId: order._id,
          items: order.items
            .map((item: any) => `${item.name} x${item.quantity}`)
            .join(", "),
          totalAmount: `RS.${order.totalAmount.toFixed(2)}`,
          orderTime: new Date(order.createdAt).toLocaleString(),
          deliveryAddress: [
            order.deliveryAddress.street,
            order.deliveryAddress.city,
            order.deliveryAddress.state,
            order.deliveryAddress.zipCode,
            order.deliveryAddress.country
          ].filter(Boolean).join(", "),
          status: order.status,
          action: "Change Status"
        }));
        
        setOrders(transformedOrders);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <ResturentTitle text={title} />
      {loading && <p className="text-gray-600 dark:text-gray-300">Loading orders...</p>}
      {error && <p className="text-red-600 dark:text-red-300">{error}</p>}
      {!loading && !error && (
        <ResturentOrderTable headers={tableHeaders} data={orders} defaultStatus={defaultStatus} />
      )}
    </div>
  );
};

export default Order;