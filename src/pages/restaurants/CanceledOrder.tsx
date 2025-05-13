import React from 'react';
import OrderPage from './Order';

const ConfirmedOrders: React.FC = () => {
  return <OrderPage defaultStatus="CANCELLED" title="Cancelled Orders" />;
};

export default ConfirmedOrders;