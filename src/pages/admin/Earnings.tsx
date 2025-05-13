import React, { useState, useEffect } from "react";
import EarningsTable from "../../components/admin/EarningsTable";
import RestaurantTitle from "../../components/UI/ResturentTitle";
import { getAllPayments, getAllRestaurants } from "../../utils/api";

export interface Payment {
  _id: string;
  orderId: string;
  totalAmount: number;
  paymentMethod: "CREDIT_CARD" | "DEBIT_CARD";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  payhereTransactionId?: string;
  cardDetails: {
    maskedCardNumber?: string;
    cardHolderName?: string;
  };
  createdAt: string;
  refundedAt?: string;
  refundReason?: string;
  restaurantId: string;
  restaurantName?: string; // Added for display
}

interface Restaurant {
  _id: string;
  restaurantName: string;
}

interface RestaurantTotal {
  restaurantId: string;
  restaurantName: string;
  total: number;
}

const TABLE_HEADERS: string[] = [
  "Date",
  "Amount",
  "Order ID",
  "Resturent ID",
  "Resturent Name",
  "Method",
  "Status",
  "Transaction ID",
  "Actions",
];

const Earnings: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantNameMap, setRestaurantNameMap] = useState<Map<string, string>>(new Map());
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  const [view, setView] = useState<"ALL" | "COMPLETED" | "REFUNDED" | "FAILED">("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurantTotals, setRestaurantTotals] = useState<RestaurantTotal[]>([]);

  // Fetch restaurants and create name map on mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await getAllRestaurants();
        const restaurantList: Restaurant[] = response.data;
        setRestaurants(restaurantList);
        // Create restaurant name map
        const nameMap = new Map<string, string>();
        restaurantList.forEach((restaurant) => {
          nameMap.set(restaurant._id, restaurant.restaurantName);
        });
        setRestaurantNameMap(nameMap);
      } catch (err) {
        console.error("Fetch restaurants error:", err);
        setError("Failed to fetch restaurants");
      }
    };
    fetchRestaurants();
  }, []);

  // Fetch payments and map restaurant names using cache
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const params: {
          status?: string;
          restaurantId?: string;
          startDate?: string;
          endDate?: string;
          page: number;
          limit: number;
        } = {
          status: view === "ALL" ? undefined : view,
          restaurantId: selectedRestaurantId || undefined,
          page: 1,
          limit: 50,
        };
        if (startDate && !isNaN(new Date(startDate).getTime())) {
          params.startDate = startDate;
        }
        if (endDate && !isNaN(new Date(endDate).getTime())) {
          params.endDate = endDate;
        }
        const response = await getAllPayments(params);
        const fetchedPayments: Payment[] = response.data.payments;

        // Map restaurant names using cache
        const paymentsWithNames = fetchedPayments.map((payment) => ({
          ...payment,
          restaurantName: restaurantNameMap.get(payment.restaurantId) || "Unknown",
        }));

        setPayments(paymentsWithNames);
        setError(null);

        // Calculate restaurant totals
        const totalsByRestaurant = paymentsWithNames.reduce((acc, payment) => {
          const { restaurantId, restaurantName = "Unknown", totalAmount } = payment;
          if (!acc[restaurantId]) {
            acc[restaurantId] = { restaurantId, restaurantName, total: 0 };
          }
          acc[restaurantId].total += totalAmount;
          return acc;
        }, {} as Record<string, RestaurantTotal>);

        setRestaurantTotals(Object.values(totalsByRestaurant));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch payments");
        } else {
          setError("Failed to fetch payments");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [view, selectedRestaurantId, startDate, endDate, restaurantNameMap]);

  // Calculate total amounts by status
  const totals = payments.reduce(
    (acc, payment) => {
      acc[payment.paymentStatus] = (acc[payment.paymentStatus] || 0) + payment.totalAmount;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="p-4">
      <RestaurantTitle text="Payment Earnings" />
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
        <div className="flex space-x-2 mb-2 sm:mb-0">
          <button
            onClick={() => setView("ALL")}
            className={`px-4 py-2 rounded-lg ${
              view === "ALL"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
            }`}
          >
            All Payments
          </button>
          <button
            onClick={() => setView("COMPLETED")}
            className={`px-4 py-2 rounded-lg ${
              view === "COMPLETED"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
            }`}
          >
            Completed Payments
          </button>
          <button
            onClick={() => setView("REFUNDED")}
            className={`px-4 py-2 rounded-lg ${
              view === "REFUNDED"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
            }`}
          >
            Refunded Payments
          </button>
          <button
            onClick={() => setView("FAILED")}
            className={`px-4 py-2 rounded-lg ${
              view === "FAILED"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
            }`}
          >
            Failed Payments
          </button>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <select
            value={selectedRestaurantId}
            onChange={(e) => setSelectedRestaurantId(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Restaurants</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.restaurantName}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="End Date"
          />
        </div>
      </div>
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-green-100 dark:bg-green-700 rounded-lg">
          <h3 className="text-sm font-semibold text-green-600 dark:text-green-200">Completed</h3>
          <p className="text-lg font-bold text-green-800 dark:text-green-100">
            LKR {(totals.COMPLETED || 0).toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-yellow-100 dark:bg-yellow-700 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-600 dark:text-yellow-200">Pending</h3>
          <p className="text-lg font-bold text-yellow-800 dark:text-yellow-100">
            LKR {(totals.PENDING || 0).toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-blue-100 dark:bg-blue-700 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-200">Refunded</h3>
          <p className="text-lg font-bold text-blue-800 dark:text-blue-100">
            LKR {(totals.REFUNDED || 0).toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-red-100 dark:bg-red-700 rounded-lg">
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-200">Failed</h3>
          <p className="text-lg font-bold text-red-800 dark:text-red-100">
            LKR {(totals.FAILED || 0).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Restaurant Transaction Totals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurantTotals.map((total) => (
            <div
              key={total.restaurantId}
              className="p-4 bg-indigo-100 dark:bg-indigo-700 rounded-lg"
            >
              <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-200">
                {total.restaurantName}
              </h3>
              <p className="text-lg font-bold text-indigo-800 dark:text-indigo-100">
                LKR {total.total.toFixed(2)}
              </p>
            </div>
          ))}
          {restaurantTotals.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
          )}
        </div>
      </div>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {!loading && !error && (
        <EarningsTable
          headers={TABLE_HEADERS}
          data={payments}
          setPayments={setPayments}
        />
      )}
    </div>
  );
};

export default Earnings;