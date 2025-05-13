import React from 'react';
import OrderPage from './Order';

const PendingOrders: React.FC = () => {
  return <OrderPage defaultStatus="PENDING" title="Pending Orders" />;
};

export default PendingOrders;