import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import ProductsList from "../pages/products/ProductsList.jsx";
import AddProduct from "../pages/products/AddProduct.jsx";
import EditProduct from "../pages/products/EditProduct.jsx";
import OrdersList from "../pages/orders/OrdersList.jsx";
import OrderDetails from "../pages/orders/OrderDetails.jsx";
import Users from "../pages/users/UsersList.jsx";
import UserDetails from "../pages/users/UserDetails.jsx";
import Settings from "../pages/Settings.jsx";
import AdminLogin from "../pages/AdminLogin.jsx";

import AdminProtectedRoute from "./AdminProtectedRoute.jsx";

export const AdminRoutes = () => {
  return (
    <Routes>
      {/* Login */}
      <Route path="login" element={<AdminLogin />} />

      {/* Protected Admin Panel */}
      <Route
        path="/"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<AdminDashboard />} />

        {/* PRODUCTS */}
        <Route path="products" element={<ProductsList />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />

        {/* ORDERS */}
        <Route path="orders" element={<OrdersList />} />
        <Route path="orders/:id" element={<OrderDetails />} />

        {/* USERS */}
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetails />} />

        {/* SETTINGS */}
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};
