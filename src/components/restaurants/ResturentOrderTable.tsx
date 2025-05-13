import { Order } from '@/pages/restaurants/Order';
import React, { useState } from 'react';
import { updateOrderStatus } from '../../utils/api';
import ConfirmationModal from '../../components/UI/ConfirmationModal';

interface ResturentTableProps {
  headers: string[];
  data: Order[];
  defaultStatus?: string; // Optional status filter
}

const ResturentOrderTable: React.FC<ResturentTableProps> = ({ headers, data, defaultStatus }) => {
  const [orders, setOrders] = useState<Order[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    orderId: string;
    newStatus: string;
  } | null>(null);

  // Status options
  const statusOptions = [
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
  ];

  // Handle status change initiation
  const initiateStatusChange = (orderId: string, newStatus: string) => {
    setPendingStatusChange({ orderId, newStatus });
    setIsModalOpen(true);
  };

  // Confirm status change
  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;
    const { orderId, newStatus } = pendingStatusChange;
    try {
      await updateOrderStatus(orderId, newStatus as any);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
      setError(null);
    } catch (err: any) {
      setError(`Failed to update status: ${err.message}`);
      console.error("Update status error:", err);
    } finally {
      setIsModalOpen(false);
      setPendingStatusChange(null);
    }
  };

  // Cancel status change
  const cancelStatusChange = () => {
    setIsModalOpen(false);
    setPendingStatusChange(null);
  };

  // Filter orders by search term and default status
  const filteredOrders = orders.filter(order =>
    (defaultStatus ? order.status === defaultStatus : true) &&
    (order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort orders by date
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.orderTime).getTime();
    const dateB = new Date(b.orderTime).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Status styles
  const getStatusStyles = (status: string) => {
    const baseStyles = 'w-fit px-2 py-1 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';
    switch (status) {
      case 'PENDING':
        return `${baseStyles} bg-gray-100 text-blue-600 border-blue-600 dark:bg-gray-500 dark:text-blue-200 dark:border-blue-400`;
      case 'CONFIRMED':
        return `${baseStyles} bg-gray-100 text-yellow-600 border-yellow-600 dark:bg-gray-500 dark:text-yellow-200 dark:border-yellow-400`;
      case 'PREPARING':
        return `${baseStyles} bg-gray-100 text-orange-600 border-orange-600 dark:bg-gray-500 dark:text-orange-200 dark:border-orange-400`;
      case 'READY':
        return `${baseStyles} bg-gray-100 text-green-600 border-green-600 dark:bg-gray-500 dark:text-green-200 dark:border-green-400`;
      case 'OUT_FOR_DELIVERY':
        return `${baseStyles} bg-gray-100 text-purple-600 border-purple-600 dark:bg-gray-500 dark:text-purple-200 dark:border-purple-400`;
      case 'DELIVERED':
        return `${baseStyles} bg-gray-100 text-teal-600 border-teal-600 dark:bg-gray-500 dark:text-teal-200 dark:border-teal-400`;
      case 'CANCELLED':
        return `${baseStyles} bg-gray-100 text-red-600 border-red-600 dark:bg-gray-500 dark:text-red-200 dark:border-red-400`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-600 border-gray-600 dark:bg-gray-500 dark:text-gray-200 dark:border-gray-400`;
    }
  };

  return (
    <>
      {error && <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>}
      <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          onClick={toggleSortOrder}
          className="w-full sm:w-auto px-4 rounded-full py-2 bg-gray-200 border-gray-200 dark:bg-gray-800 dark:border-gray-500 transition-colors"
        >
          Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
      <div className="hidden lg:block p-5 w-md text-sm rounded-2xl overflow-hidden bg-white dark:bg-gray-600">
        <table className="w-full">
          <thead className="bg-gray-300 border-gray-200 dark:bg-gray-700 dark:border-gray-500">
            <tr>
              {headers.filter(header => header !== 'Action').map((header, index) => (
                <th key={index} className="text-start py-4 px-6 font-semibold text-gray-600 dark:text-gray-200">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order, index) => (
              <tr
                key={order.orderId}
                className={`border-b border-gray-200 dark:border-gray-500 ${index % 2 === 0
                  ? 'bg-gray-50 dark:bg-gray-600'
                  : 'bg-gray-100 dark:bg-gray-700'
                } hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors`}
              >
                <td className="py-4 px-6">
                  <span className="font-mono text-gray-800 dark:text-white">ORD#{order.orderId}</span>
                </td>
                <td className="py-4 px-6 text-orange-600 font-bold dark:text-gray-300">{order.items}</td>
                <td className="py-4 px-6">
                  <span className="font-semibold text-green-600 dark:text-green-300">{order.totalAmount}</span>
                </td>
                <td className="py-4 px-6 text-gray-500 font-bold dark:text-gray-400">{order.orderTime}</td>
                <td className="py-4 px-6 text-gray-600 dark:text-gray-300">{order.deliveryAddress}</td>
                <td className="py-4 px-6">
                  <select
                    value={order.status}
                    onChange={(e) => initiateStatusChange(order.orderId, e.target.value)}
                    className={getStatusStyles(order.status)}
                  >
                    {statusOptions.map((status) => (
                      <option
                        key={status}
                        value={status}
                        className="bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lg:hidden p-5 space-y-4 overflow-y-scroll h-3/4">
        {sortedOrders.map((order) => (
          <div
            key={order.orderId}
            className="border rounded-md p-4 bg-white shadow-md hover:shadow-lg transition-shadow border-gray-200 dark:bg-gray-600 dark:border-gray-500"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="font-mono text-gray-600 font-bold dark:text-indigo-300">ORD#{order.orderId}</div>
                <select
                  value={order.status}
                  onChange={(e) => initiateStatusChange(order.orderId, e.target.value)}
                  className={getStatusStyles(order.status)}
                >
                  {statusOptions.map((status) => (
                    <option
                      key={status}
                      value={status}
                      className="bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-orange-600 font-bold dark:text-gray-300">Items: {order.items}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Address: {order.deliveryAddress}</div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-green-600 font-semibold dark:text-green-300">
                  {order.totalAmount}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{order.orderTime}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={cancelStatusChange}
        onConfirm={confirmStatusChange}
        title="Confirm Status Change"
        message={
          pendingStatusChange
            ? `Are you sure you want to change the status of order ${pendingStatusChange.orderId} to ${pendingStatusChange.newStatus}?`
            : ''
        }
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </>
  );
};

export default ResturentOrderTable;