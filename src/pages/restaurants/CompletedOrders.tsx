import React from 'react';
import OrderPage from './Order';

const ConfirmedOrders: React.FC = () => {
  return <OrderPage defaultStatus="DELIVERED" title="Complete Orders" />;
};

export default ConfirmedOrders;