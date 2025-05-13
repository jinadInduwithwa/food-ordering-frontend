import React from 'react';
import OrderPage from './Order';

const PreparingOrders: React.FC = () => {
  return <OrderPage defaultStatus="PREPARING" title="Preparing Orders" />;
};

export default PreparingOrders;