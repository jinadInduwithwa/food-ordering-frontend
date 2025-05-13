import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  createOrder,
  getProfile,
  updateOrderStatus,
  initiatePayment,
  assignDeliveryDriver,
  getOrderById,
} from "../utils/api";
import { toast } from "react-toastify";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Modal from "../components/Modal";
import { FaMapMarkerAlt } from "react-icons/fa";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartId, cartItems, cartTotal, clearCartItems } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<
    [number, number] | null
  >(null);
  const [mapCenter, setMapCenter] = useState({ lat: 1.3143, lng: 103.7093 });
  const [showNoDriversModal, setShowNoDriversModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Sri Lanka",
  });
  const [paymentMethod, setPaymentMethod] = useState<
    "CREDIT_CARD" | "DEBIT_CARD" | "CASH" | "ONLINE"
  >("CREDIT_CARD");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
  });
  const [showDriverFoundModal, setShowDriverFoundModal] = useState(false);
  const [driverFoundOrderId, setDriverFoundOrderId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const profile = await getProfile();
        if (profile && profile.address) {
          setDefaultAddress(profile.address);
          setDeliveryAddress({
            ...profile.address,
            country: "Sri Lanka",
          });
        }
      } catch (error) {
        console.error("Error fetching default address:", error);
        toast.error("Failed to fetch default address");
      }
    };

    if (user?.id) {
      fetchDefaultAddress();
    }
  }, [user?.id]);

  useEffect(() => {
    if (paymentMethod !== "CREDIT_CARD" && paymentMethod !== "DEBIT_CARD") {
      setShowCardDetails(false);
      setCardDetails({
        cardNumber: "",
        cardHolderName: "",
        expiryDate: "",
        cvv: "",
      });
    }
  }, [paymentMethod]);

  useEffect(() => {
    console.log("Delivery location updated:", deliveryLocation);
  }, [deliveryLocation]);

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // For MongoDB: [longitude, latitude]
            const dbLocation: [number, number] = [
              position.coords.longitude,
              position.coords.latitude,
            ];
            handleLocationUpdate(dbLocation);
          },
          (error) => {
            toast.error("Failed to get location");
            console.error("Geolocation error:", error);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        toast.error("Geolocation is not supported by your browser");
      }
    };

    console.log("Getting current location on mount");
    getCurrentLocation();
  }, []);

  const handleLocationUpdate = async (dbLocation: [number, number]) => {
    try {
      console.log("Handling location update:", dbLocation);
      setDeliveryLocation(dbLocation);
      setMapCenter({
        lat: dbLocation[1], // latitude is second in MongoDB format
        lng: dbLocation[0], // longitude is first in MongoDB format
      });

      // If there's a pending order, try to assign a driver with the new location
      if (pendingOrderId) {
        console.log(
          "Trying to assign driver with new location for order:",
          pendingOrderId
        );
        const deliveryResponse = await assignDeliveryDriver(
          pendingOrderId,
          dbLocation // Already in MongoDB format [longitude, latitude]
        );

        if (deliveryResponse.status === "success") {
          console.log("Driver found in new location!");
          setShowNoDriversModal(false);
          setDriverFoundOrderId(pendingOrderId);
          setShowDriverFoundModal(true);
          toast.success("Driver found in the new location!");
        } else if (
          deliveryResponse.message === "No available drivers found in the area"
        ) {
          console.log("No drivers available in new location");
          toast.warning("No drivers available in the new location yet");
        }
      }
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location");
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      // For MongoDB: [longitude, latitude]
      const dbLocation: [number, number] = [e.latLng.lng(), e.latLng.lat()];
      handleLocationUpdate(dbLocation);
    }
  };

  const handleCardPayment = async (orderId: string, cartId: string) => {
    try {
      if (
        !cardDetails.cardNumber ||
        !cardDetails.cardHolderName ||
        !cardDetails.expiryDate ||
        !cardDetails.cvv
      ) {
        throw new Error("Please fill in all card details");
      }

      if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ""))) {
        throw new Error("Invalid card number");
      }
      if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
        throw new Error("Invalid expiry date (MM/YY)");
      }
      if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        throw new Error("Invalid CVV");
      }

      const paymentData = {
        userId: user!.id,
        cartId,
        orderId,
        restaurantId: cartItems[0].restaurantId,
        items: cartItems.map((item) => ({
          menuItemId: item.menuItemId,
          restaurantId: item.restaurantId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
        })),
        totalAmount: cartTotal,
        paymentMethod: paymentMethod as "CREDIT_CARD" | "DEBIT_CARD",
        cardDetails: {
          cardNumber: cardDetails.cardNumber,
          cardHolderName: cardDetails.cardHolderName,
        },
      };

      const response = await initiatePayment(paymentData);
      const { data } = response;
      const { payherePayload, hash } = data;

      console.log("PayHere Payload:", payherePayload);
      console.log("PayHere Hash:", hash);

      if (
        !payherePayload.merchant_id ||
        !payherePayload.order_id ||
        !payherePayload.amount ||
        !payherePayload.currency
      ) {
        throw new Error("Invalid PayHere payload: Missing required fields");
      }
      if (!hash) {
        throw new Error("Invalid PayHere hash: Hash is missing");
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://sandbox.payhere.lk/pay/checkout";

      Object.keys(payherePayload).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = payherePayload[key];
        form.appendChild(input);
      });

      const hashInput = document.createElement("input");
      hashInput.type = "hidden";
      hashInput.name = "hash";
      hashInput.value = hash;
      form.appendChild(hashInput);

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed");
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("Please login to place an order");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!deliveryLocation) {
      toast.error("Please select a delivery location on the map");
      return;
    }

    if (Object.values(deliveryAddress).some((value) => !value)) {
      toast.error("Please fill in all address fields");
      return;
    }

    if (
      (paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD") &&
      !cartId
    ) {
      toast.error("Cart not found. Please add items to cart.");
      return;
    }

    if (paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD") {
      if (!showCardDetails) {
        console.log("Showing card details form");
        setShowCardDetails(true);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);

      const orderPaymentMethod =
        paymentMethod === "DEBIT_CARD" ? "CREDIT_CARD" : paymentMethod;

      const orderData = {
        userId: user.id,
        restaurantId: cartItems[0].restaurantId,
        items: cartItems.map((item) => ({
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        deliveryAddress,
        paymentMethod: orderPaymentMethod as "CREDIT_CARD" | "CASH" | "ONLINE",
      };

      console.log("Creating order with data:", orderData);
      const order = await createOrder(orderData);
      console.log("Order created:", order);

      if (!order || !order._id) {
        throw new Error("Order creation failed - no order ID received");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const verifiedOrder = await getOrderById(order._id);
      console.log("Verified order:", verifiedOrder);
      if (!verifiedOrder) {
        throw new Error("Order not found in database");
      }

      try {
        const formattedLocation: [number, number] = [
          deliveryLocation[0],
          deliveryLocation[1],
        ];
        console.log(
          "Assigning driver for order:",
          order._id,
          "Location:",
          formattedLocation
        );
        const deliveryResponse = await assignDeliveryDriver(
          order._id,
          formattedLocation
        );
        console.log("Delivery response:", deliveryResponse);

        if (
          deliveryResponse.status === "error" &&
          deliveryResponse.message === "No available drivers found in the area"
        ) {
          console.log("No drivers found, setting pendingOrderId:", order._id);
          setPendingOrderId(order._id);
          setShowNoDriversModal(true);
          setLoading(false);
          return;
        }

        if (deliveryResponse.status !== "success") {
          throw new Error(
            deliveryResponse.message || "Failed to assign delivery driver"
          );
        }

        console.log(
          "Driver assigned, proceeding with payment. Payment method:",
          paymentMethod
        );
        if (paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD") {
          console.log("Initiating card payment for order:", order._id);
          await handleCardPayment(order._id, cartId!);
        } else {
          console.log("Confirming non-card order:", order._id);
          await updateOrderStatus(order._id, "CONFIRMED");
          await clearCartItems();
          toast.success("Order placed successfully!");
          navigate("/orders");
        }
      } catch (deliveryError) {
        console.error("Delivery assignment error:", deliveryError);
        console.log("Setting pendingOrderId in catch:", order._id);
        setPendingOrderId(order._id);
        setShowNoDriversModal(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to place order"
      );
      setLoading(false);
    }
  };

  const handleNoDriversModalConfirm = async () => {
    console.log("Modal confirm, pendingOrderId:", pendingOrderId);
    setShowNoDriversModal(false);
    if (!pendingOrderId) {
      console.log("No pending order found");
      toast.error("No pending order found");
      setLoading(false);
      return;
    }

    try {
      if (paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD") {
        console.log("Card payment, showCardDetails:", showCardDetails);
        if (!showCardDetails) {
          setShowCardDetails(true);
          setLoading(false);
        } else {
          console.log("Initiating card payment for order:", pendingOrderId);
          await handleCardPayment(pendingOrderId, cartId!);
        }
      } else {
        console.log("Non-card payment, confirming order:", pendingOrderId);
        await updateOrderStatus(pendingOrderId, "CONFIRMED");
        await clearCartItems();
        toast.success("Order placed successfully!");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Post-modal processing error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process order"
      );
      setLoading(false);
    }
  };

  const handleNoDriversModalClose = () => {
    console.log("Modal close, keeping pendingOrderId:", pendingOrderId);
    setShowNoDriversModal(false);
    setLoading(false);
  };

  const handleDriverFoundConfirm = async () => {
    if (!driverFoundOrderId) return;

    try {
      if (paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD") {
        await handleCardPayment(driverFoundOrderId, cartId!);
      } else {
        await updateOrderStatus(driverFoundOrderId, "CONFIRMED");
        await clearCartItems();
        toast.success("Order placed successfully!");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("Failed to process order");
    } finally {
      setShowDriverFoundModal(false);
      setDriverFoundOrderId(null);
      setPendingOrderId(null);
    }
  };

  const handleDriverFoundCancel = () => {
    setShowDriverFoundModal(false);
    setDriverFoundOrderId(null);
    setPendingOrderId(null);
    toast.info("Order placement cancelled");
  };

  // const getDisplayLocation = () => {
  //   if (!deliveryLocation) return null;
  //   return {
  //     lat: deliveryLocation[1],
  //     lng: deliveryLocation[0],
  //   };
  // };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="max-h-[400px] overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between mb-2">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>Rs. {cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Delivery Location</h2>
            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const newLocation: [number, number] = [
                        position.coords.longitude,
                        position.coords.latitude,
                      ];
                      handleLocationUpdate(newLocation);
                    },
                    (error) => {
                      toast.error("Failed to get location");
                      console.error("Geolocation error:", error);
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                  );
                } else {
                  toast.error("Geolocation is not supported by your browser");
                }
              }}
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-600"
            >
              <FaMapMarkerAlt />
              <span>Use Current Location</span>
            </button>
          </div>

          <div className="h-64 w-full rounded-lg overflow-hidden mb-4">
            <LoadScript
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              libraries={["places"]}
            >
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={mapCenter}
                zoom={15}
                onClick={handleMapClick}
                options={{
                  disableDefaultUI: false,
                  zoomControl: true,
                  mapTypeControl: true,
                  streetViewControl: true,
                  fullscreenControl: true,
                }}
              >
                {deliveryLocation && (
                  <Marker
                    position={{
                      lat: deliveryLocation[1],
                      lng: deliveryLocation[0],
                    }}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    }}
                  />
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Click on the map to set your delivery location
          </p>

          {deliveryLocation && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">
                Selected Location:
              </p>
              <p className="text-sm text-gray-600">
                Lat: {deliveryLocation[1].toFixed(4)}, Long:{" "}
                {deliveryLocation[0].toFixed(4)}
              </p>
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4 mt-6">Delivery Address</h2>

          {defaultAddress && (
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-gray-700 mb-2">
                  Default Address
                </h3>
                <p className="text-gray-600">{defaultAddress.street}</p>
                <p className="text-gray-600">
                  {defaultAddress.city}, {defaultAddress.state}{" "}
                  {defaultAddress.zipCode}
                </p>
                <p className="text-gray-600">{defaultAddress.country}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowNewAddress(!showNewAddress)}
                className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-2"
              >
                {showNewAddress ? (
                  <>
                    <span>Use Default Address</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Use Different Address</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {showNewAddress && (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Street
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={deliveryAddress.street}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryAddress.city}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={deliveryAddress.state}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={deliveryAddress.zipCode}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={deliveryAddress.country}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    required
                    disabled
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value as
                      | "CREDIT_CARD"
                      | "DEBIT_CARD"
                      | "CASH"
                      | "ONLINE"
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                disabled={showCardDetails}
              >
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="CASH">Cash on Delivery</option>
                <option value="ONLINE">Online Payment</option>
              </select>
            </div>

            {(paymentMethod === "CREDIT_CARD" ||
              paymentMethod === "DEBIT_CARD") &&
              showCardDetails && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleCardDetailsChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      required
                      placeholder="1234 5678 1234 5678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardHolderName"
                      value={cardDetails.cardHolderName}
                      onChange={handleCardDetailsChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleCardDetailsChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        required
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardDetailsChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        required
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

            <button
              type="submit"
              disabled={loading || !deliveryLocation}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading
                ? "Placing Order..."
                : (paymentMethod === "CREDIT_CARD" ||
                    paymentMethod === "DEBIT_CARD") &&
                  !showCardDetails
                ? "Proceed to Payment"
                : "Place Order"}
            </button>
          </form>
        </div>
      </div>

      <Modal
        isOpen={showNoDriversModal}
        onClose={handleNoDriversModalClose}
        onConfirm={handleNoDriversModalConfirm}
        title="No Available Drivers"
        message="No delivery drivers are currently available in your area. You can place your order and wait for the driver to be assigned. Please contact support for assistance."
        confirmText="Continue to Order"
        cancelText="Stay on Page"
      />

      <Modal
        isOpen={showDriverFoundModal}
        onClose={handleDriverFoundCancel}
        onConfirm={handleDriverFoundConfirm}
        title="Driver Found!"
        message="A delivery driver is now available in your area. Would you like to proceed with placing your order?"
        confirmText="Place Order"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Checkout;
