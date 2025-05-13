import React from 'react';
import OrderPage from './Order';

const OutForDeliveryOrders: React.FC = () => {
  return <OrderPage defaultStatus="OUT_FOR_DELIVERY" title="Out for Delivery Orders" />;
};

export default OutForDeliveryOrders;