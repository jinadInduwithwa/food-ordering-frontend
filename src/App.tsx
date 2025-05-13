import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { DriverProvider } from "@/context/DriverContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Layout from "./components/UI/Layout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PaymentMethod from "@/components/Payment/PaymentMethod";
import CardDetails from "@/components/Payment/CardDetails";
import OrderConfirmation from "@/pages/OrderConfirmation";
import RestaurantMenu from "./pages/RestaurantMenu";
import ViewMenuItem from "./pages/ViewMenuItem";
import Order from "./pages/Order";
import Cart from "./pages/Cart";
import ResturentRegister from "./pages/ResturentRegister";
import Profile from "./pages/Profile";
import DriverDashboard from "./pages/Drivers/DriverDashboard";
import TermsAndConditions from "./pages/TermsAndConditions";

//-------------- admin--------------------------------------
import AdminLayout from "./pages/admin/AdminLayout";
import AllResturent from "./pages/admin/AllResturent";
import RequestResturent from "./pages/admin/RequestResturent";
import AddResturent from "./pages/admin/AddResturent";
import AllUsers from "./pages/admin/AllUsers";
import UserPermissions from "./pages/admin/UserPermissions";
import UserSetting from "./pages/admin/UserSetting";
import AddUser from "./pages/admin/AddUser";
import Earnings from "./pages/admin/Earnings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="overview" replace />} />{" "}
        {/* Relative path */}
        <Route path="overview" element={<Overview />} />
        <Route path="profile" element={<Profile />} />
        {/* Order-related routes grouped under /orders */}
        <Route path="resturent">
          <Route path="" element={<AllResturent />} />
          <Route path="request" element={<RequestResturent />} />
          <Route path="add" element={<AddResturent />} />
        </Route>
        {/* user-related routes grouped under /orders */}
        <Route path="user-management">
          <Route path="all" element={<AllUsers />} />
          <Route path="roles" element={<UserPermissions />} />
          <Route path="add" element={<AddUser />} /> 
          <Route path="settings" element={<UserSetting />} />
        </Route>

         {/* payment-related routes grouped under /orders */}
         <Route path="earnings">
          <Route path="earan" element={<Earnings />} />
          <Route path="roles" element={<UserPermissions />} />
          <Route path="add" element={<AddUser />} /> 
          <Route path="settings" element={<UserSetting />} />
        </Route>

        {/* Add more routes as needed to match sidebar */}
      </Route>
    </Routes>
  );
};

//-------------- resturent--------------------------------------
import ResturentLayout from "./pages/restaurants/ResturentLayout";
import Overview from "./pages/restaurants/Overview";

import PendingOrders from "./pages/restaurants/PendingOrders";
import PreparingOrder from "./pages/restaurants/PreparingOrder";
import CancelledOrder from "./pages/restaurants/CanceledOrder";
import ConfirmedOrders from "./pages/restaurants/ConfirmedOrders";
import ReadyOrders from "./pages/restaurants/ReadyOrders";
import CompletedOrders from "./pages/restaurants/CompletedOrders";
import OutForDeliveryOrders from "./pages/restaurants/OutForDeliveryOrders";
import ManageMenuItems from "./pages/restaurants/ManageMenuItems";
import AddNewMenuItem from "./pages/restaurants/AddNewMenuItem";
import AllMenuItems from "./pages/restaurants/AllMenuItems";
import AddCategories from "./pages/restaurants/AddCategories";
import CategoryManagement from "./pages/restaurants/CategoryManagement";
import FoodHomePage from "./pages/FoodHomePage";
import Restaurant from "./pages/Restaurant";
import ResturentProfile from "./pages/restaurants/ResturentProfile";
import MobileBottomNav from "./components/UI/MobileBottomNav";
import Checkout from "./pages/Checkout";
import OrdersList from "./pages/OrdersList";

const ResturentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ResturentLayout />}>
        <Route index element={<Navigate to="overview" replace />} />{" "}
        {/* Relative path */}
        <Route path="overview" element={<Overview />} />
        <Route path="profile" element={<ResturentProfile />} />
        {/* Order-related routes grouped under /orders */}
        <Route path="orders">
          <Route path="new" element={<PendingOrders />} />
          <Route path="confirme" element={<ConfirmedOrders />} />
          <Route path="preparing" element={<PreparingOrder />} />
          <Route path="ready" element={<ReadyOrders />} />
          <Route path="out-for-delivery" element={<OutForDeliveryOrders />} />
          <Route path="completed" element={<CompletedOrders />} />
          <Route path="canceled" element={<CancelledOrder />} />
        </Route>
        {/* menu-related routes grouped under /menu-management */}
        <Route path="menu-management">
          <Route path="all" element={<AllMenuItems />} />
          <Route path="manage" element={<ManageMenuItems />} />
          <Route path="add" element={<AddNewMenuItem />} />
        </Route>
        {/* category-related routes grouped under /menu-management */}
        <Route path="category">
          <Route path="manage" element={<CategoryManagement />} />
          <Route path="add" element={<AddCategories />} />
        </Route> 
        {/* Add more routes as needed to match sidebar */}
      </Route>
    </Routes>
  );
};

//-------------- driver--------------------------------------
const DriverRoutes = () => {
  console.log("DriverRoutes component rendered");
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DriverDashboard />} />
      </Route>
    </Routes>
  );
};

function App() {
  console.log("App component rendered");
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <DriverProvider>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                  path="/resturent-signup"
                  element={<ResturentRegister />}
                />
                <Route path="/restaurants" element={<Restaurant />} />
                <Route path="/payment-method" element={<PaymentMethod />} />
                <Route path="/card-details" element={<CardDetails />} />
                <Route
                  path="/order-confirmation"
                  element={<OrderConfirmation />}
                />
                <Route path="/orders" element={<OrdersList />} />
                <Route path="/order/:orderId" element={<Order />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/account" element={<Profile />} />
                <Route
                  path="/restaurant/:restaurantId/menu"
                  element={<RestaurantMenu />}
                />
                <Route
                  path="/restaurant/:restaurantId/menu/:menuItemId"
                  element={<ViewMenuItem />}
                />
                <Route path="menu" element={<FoodHomePage />} />
              </Route>
              <Route
                path="/resturent-dashboard/*"
                element={<ResturentRoutes />}
              />
              <Route path="/admin-dashboard/*" element={<AdminRoutes />} />
              <Route path="/driver-dashboard/*" element={<DriverRoutes />} />
            </Routes>
            <MobileBottomNav />
          </DriverProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
