import React from 'react';
import OrderPage from './Order';

const ReadyOrders: React.FC = () => {
  return <OrderPage defaultStatus="READY" title="Ready Orders" />;
};

export default ReadyOrders;