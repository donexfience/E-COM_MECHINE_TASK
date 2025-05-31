import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import "./App.css";
import MainLayout from "./components/Layout/MainLayout";
import Home from "./pages/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoutes";
import AdminLayout from "./components/Layout/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Notfound from "./components/NotFound/Notfound";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />

            {/* Public product pages */}
            {/* <Route path="product/:id" element={<ProductDetail />} /> */}

            {/* Protected User Routes */}
            <Route
              path="cart"
              element={<ProtectedRoute>{/* <Cart /> */}</ProtectedRoute>}
            />
            {/* <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            /> */}

            {/* User Dashboard Routes */}
            <Route path="user" element={<ProtectedRoute />}>
              <Route index element={<>Usersssssssssssss</>} />
              <Route path="profile" element={<>Profile page</>} />
              {/* <Route path="payment" element={<Payment />} /> */}
            </Route>
          </Route>

          {/* Admin Routes - Completely separate layout */}
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<div>Products</div>} />
            {/* <Route path="products/:id" element={<AdminProductDetail />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={<AdminOrders />} /> */}
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
