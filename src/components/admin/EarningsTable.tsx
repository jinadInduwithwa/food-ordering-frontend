import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { refundPayment } from "../../utils/api";

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
  restaurantName?: string;
}

interface EarningsTableProps {
  headers: string[];
  data: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
}

const EarningsTable: React.FC<EarningsTableProps> = ({ headers, data, setPayments }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleRefund = async (paymentId: string) => {
    try {
      const reason = prompt("Enter refund reason:");
      if (!reason) return;

      // Optimistic update
      setPayments((prev) =>
        prev.map((payment) =>
          payment._id === paymentId
            ? {
                ...payment,
                paymentStatus: "REFUNDED",
                refundedAt: new Date().toISOString(),
                refundReason: reason,
              }
            : payment
        )
      );

      await refundPayment({ paymentId, reason });
    } catch (err) {
      console.error("Refund error:", err);
      alert("Failed to process refund");
    }
  };

  const filteredData = data.filter((payment) =>
    payment.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Map headers to payment fields for mobile view
  const getFieldValue = (payment: Payment, header: string) => {
    switch (header.toLowerCase()) {
      case "date":
        return new Date(payment.createdAt).toLocaleDateString();
      case "amount":
        return `LKR ${payment.totalAmount.toFixed(2)}`;
      case "order id":
        return payment.orderId;
      case "resturent id":
        return payment.restaurantId;
      case "resturent name":
        return payment.restaurantName || "Unknown";
      case "method":
        return payment.paymentMethod.replace("_", " ");
      case "status":
        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              payment.paymentStatus === "COMPLETED"
                ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200"
                : payment.paymentStatus === "PENDING"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200"
                : payment.paymentStatus === "REFUNDED"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200"
                : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200"
            }`}
          >
            {payment.paymentStatus}
          </span>
        );
      case "transaction id":
        return payment.payhereTransactionId || "-";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Search Input */}
      <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by Order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-900">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData.map((payment) => (
              <tr
                key={payment._id}
                className="hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  LKR {payment.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  ORD#{payment.orderId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  RES#{payment.restaurantId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {payment.restaurantName || "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {payment.paymentMethod.replace("_", " ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.paymentStatus === "COMPLETED"
                        ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200"
                        : payment.paymentStatus === "PENDING"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200"
                        : payment.paymentStatus === "REFUNDED"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200"
                        : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200"
                    }`}
                  >
                    {payment.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {payment.payhereTransactionId || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {payment.paymentStatus === "COMPLETED" && (
                    <button
                      onClick={() => handleRefund(payment._id)}
                      className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-indigo-200"
                    >
                      Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid View */}
      <div className="lg:hidden p-4 space-y-4 overflow-y-scroll">
        {filteredData.map((payment) => (
          <div
            key={payment._id}
            className="border rounded-md p-4 bg-white dark:bg-gray-600 shadow-md hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-500"
          >
            <div className="space-y-2">
              {headers.map((header) =>
                header.toLowerCase() !== "actions" ? (
                  <div key={header} className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-800 dark:text-white">{header}:</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {getFieldValue(payment, header)}
                    </span>
                  </div>
                ) : null
              )}
            </div>
            {/* Actions */}
            {payment.paymentStatus === "COMPLETED" && (
              <div className="mt-4">
                <button
                  onClick={() => handleRefund(payment._id)}
                  className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
                >
                  Refund
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredData.length === 0 && (
        <div className="p-4 text-center text-gray-600 dark:text-gray-300">
          No payments found.
        </div>
      )}
    </div>
  );
};

export default EarningsTable;