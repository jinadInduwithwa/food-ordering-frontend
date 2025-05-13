import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
    const navigate = useNavigate();

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Order Confirmation</h2>
            <p>Your order has been successfully placed!</p>
            <p>We will notify you when your order is ready for pickup.</p>
            <button onClick={() => navigate('/')} className="mt-4 bg-green-500 text-white p-2 rounded-md">
                Go Back to Home
            </button>
        </div>
    );
};

export default OrderConfirmation;
