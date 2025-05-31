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
import Products from "./pages/Products";
import { ToastContainer } from "react-fox-toast";
import Checkout from "./pages/Checkout";
import PurchaseHistory from "./components/user/purchase/PurchaseHistory";

function App() {
  return (
    <Provider store={store}>
      <ToastContainer position="top-center" />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <PurchaseHistory />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<Products />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
