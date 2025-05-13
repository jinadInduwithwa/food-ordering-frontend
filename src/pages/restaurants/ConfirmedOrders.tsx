import React from 'react';
import OrderPage from './Order';

const ConfirmedOrders: React.FC = () => {
  return <OrderPage defaultStatus="CONFIRMED" title="Confirmed Orders" />;
};

export default ConfirmedOrders;