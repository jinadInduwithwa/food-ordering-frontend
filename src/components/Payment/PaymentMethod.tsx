import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';
import { FiShoppingCart, FiInfo } from 'react-icons/fi';

const PaymentMethod = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
    const navigate = useNavigate();
    const [isOnlinePayment, setIsOnlinePayment] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [tipAmount, setTipAmount] = useState(0);

    const handlePaymentMethodChange = (method: string) => {
        setSelectedPaymentMethod(method);
        if (method === 'payOnline') {
            navigate('/card-details');
        } else {
            setIsOnlinePayment(false);
        }
    };

    const handleApplyCoupon = () => {
        // Logic to apply coupon
        console.log(`Coupon Applied: ${couponCode}`);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 p-15 bg-gray-50 my-20 mx-5 mt-20">
            {/* Left Sidebar: Checkout/Order Details */}
            <div className="flex-1 bg-white shadow-lg p-6 rounded-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">FoodX </h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <FiShoppingCart className="text-xl text-gray-800" />
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                        </div>
                        <FiInfo className="text-xl text-gray-800" />
                    </div>
                </div>

                {/* Payment Method Section */}
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h3>
                <div className="space-y-4">
                    <label
                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${selectedPaymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        onClick={() => handlePaymentMethodChange('cash')}
                    >
                        <input
                            type="radio"
                            name="payment"
                            checked={selectedPaymentMethod === 'cash'}
                            className="h-5 w-5 text-blue-500"
                        />
                        <span className="text-lg font-medium text-gray-700">Cash</span>
                    </label>
                    <label
                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${selectedPaymentMethod === 'cardAtPickup' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        onClick={() => handlePaymentMethodChange('cardAtPickup')}
                    >
                        <input
                            type="radio"
                            name="payment"
                            checked={selectedPaymentMethod === 'cardAtPickup'}
                            className="h-5 w-5 text-blue-500"
                        />
                        <span className="text-lg font-medium text-gray-700">Card at Pickup Counter</span>
                    </label>
                    <label
                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${selectedPaymentMethod === 'callBack' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                        onClick={() => handlePaymentMethodChange('callBack')}
                    >
                        <input
                            type="radio"
                            name="payment"
                            checked={selectedPaymentMethod === 'callBack'}
                            className="h-5 w-5 text-blue-500"
                        />
                        <span className="text-lg font-medium text-gray-700">Call Me Back</span>
                    </label>

                    {/* Pay Online Option */}
                    <div className="border border-gray-300 rounded-lg p-4">
                        <label
                            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${selectedPaymentMethod === 'payOnline' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                            onClick={() => handlePaymentMethodChange('payOnline')}
                        >
                            <input
                                type="radio"
                                name="payment"
                                checked={selectedPaymentMethod === 'payOnline'}
                                className="h-5 w-5 text-blue-500"
                            />
                            <span className="text-lg font-medium text-gray-700">Pay Online</span>
                        </label>
                        {isOnlinePayment && (
                            <div className="flex gap-4 mt-4 text-2xl">
                                <FaCcVisa className="text-blue-600" />
                                <FaCcMastercard className="text-red-600" />
                                <FaCcAmex className="text-blue-500" />
                                <FaCcDiscover className="text-orange-500" />
                            </div>
                        )}
                    </div>

                    
                </div>

                {/* Tip Amount */}
                <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Tip?</h4>
                    <input
                        type="number"
                        value={tipAmount}
                        onChange={(e) => setTipAmount(Number(e.target.value))}
                        placeholder="Enter tip amount"
                        className="w-full p-3 border rounded-lg text-lg text-gray-700"
                    />
                </div>

                <Button className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600">
                    Save
                </Button>
            </div>

            {/* Right Sidebar: Order Summary */}
            <div className="flex-1 bg-white shadow-lg p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>

                {/* Order Items */}
                <div className="space-y-4 mb-4">
                    <div className="flex justify-between text-gray-700">
                        <span>1x Cheesecake (Strawberry)</span>
                        <span>$4.99</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span>1x Chicken Wings (Lemon Pepper, Ranch Dressing)</span>
                        <span>$9.99</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-gray-700 font-semibold">
                        <span>Sub-Total</span>
                        <span>$14.98</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span>Tip</span>
                        <span>${tipAmount}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t pt-2 text-gray-800">
                        <span>Total</span>
                        <span>${(14.98 + tipAmount).toFixed(2)}</span>
                    </div>
                </div>

                {/* Coupon Code */}
                <div className="mt-4">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter Coupon Code"
                        className="w-full p-3 border rounded-lg text-lg text-gray-700"
                    />
                    <Button
                        onClick={handleApplyCoupon}
                        className="mt-2 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
                    >
                        Apply Coupon
                    </Button>
                </div>

                <div className="mt-6 text-center text-gray-600">
                    <span className="text-sm">
                        By placing your order, you agree to our <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a>.
                    </span>
                </div>

                {/* Place Order Button */}
                <Button className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600">
                    Place Pickup Order Now
                </Button>
            </div>
        </div>
    );
};

export default PaymentMethod;
