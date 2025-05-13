// CardDetails.tsx
import React, { useState } from 'react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';  // Importing useNavigate from react-router-dom
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';  // Importing credit card icons

const CardDetails = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardType, setCardType] = useState('visa');  // State for card type
    const [isValid, setIsValid] = useState(true);  // State for form validation
    const navigate = useNavigate();  // Initialize useNavigate hook

    const handleCardTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCardType(e.target.value);
    };

    const handleSubmit = () => {
        // Basic validation before submitting
        if (!cardNumber || !expiryDate || !cvv) {
            setIsValid(false);
            return;
        }

        console.log("Card details submitted:", { cardNumber, expiryDate, cvv, cardType });
        // Redirect to order confirmation page after submitting card details
        navigate("/order-confirmation");  // Use navigate for routing
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Enter Card Details</h2>
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Enter your card number"
                />

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            placeholder="MM/YY"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">CVV</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="CVV"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="cardType" className="block text-gray-700 font-medium mb-2">
                        Select Card Type
                    </label>
                    <select
                        id="cardType"
                        value={cardType}
                        onChange={handleCardTypeChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="visa">Visa</option>
                        <option value="mastercard">MasterCard</option>
                        <option value="amex">American Express</option>
                        <option value="discover">Discover</option>
                    </select>
                </div>

                {/* Card Icon Display */}
                <div className="flex items-center gap-4 mt-4">
                    {cardType === 'visa' && <FaCcVisa className="text-blue-600 text-3xl" />}
                    {cardType === 'mastercard' && <FaCcMastercard className="text-red-600 text-3xl" />}
                    {cardType === 'amex' && <FaCcAmex className="text-blue-500 text-3xl" />}
                    {cardType === 'discover' && <FaCcDiscover className="text-orange-500 text-3xl" />}
                </div>

                {/* Validation Message */}
                {!isValid && (
                    <div className="text-red-500 text-sm mt-2">
                        Please ensure all fields are filled out correctly.
                    </div>
                )}
            </div>

            <Button
                className="mt-6 w-full bg-green-500"
                onClick={handleSubmit}
            >
                Confirm Payment
            </Button>
        </div>
    );
};

export default CardDetails;
