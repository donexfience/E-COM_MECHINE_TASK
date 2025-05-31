import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);

  if (!user || user.role !== 'user') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome back, {user.name}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                USER
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">My Orders</h3>
            <p className="text-3xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-500 mt-1">Total orders placed</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Wishlist</h3>
            <p className="text-3xl font-bold text-red-600">8</p>
            <p className="text-sm text-gray-500 mt-1">Items in wishlist</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Rewards</h3>
            <p className="text-3xl font-bold text-green-600">250</p>
            <p className="text-sm text-gray-500 mt-1">Points earned</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">Order #12345</p>
                    <p className="text-sm text-gray-600">Wireless Headphones</p>
                    <p className="text-sm text-gray-500">Ordered on Dec 25, 2024</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    Delivered
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-lg font-bold text-gray-800">$99.99</p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">Order #12344</p>
                    <p className="text-sm text-gray-600">Smart Watch</p>
                    <p className="text-sm text-gray-500">Ordered on Dec 20, 2024</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                    Shipped
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-lg font-bold text-gray-800">$299.99</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
              View All Orders
            </button>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors">
                Browse Products
              </button>
              <button className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors">
                My Wishlist
              </button>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors">
                Track Orders
              </button>
              <button className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors">
                Account Settings
              </button>
            </div>

            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Special Offer!</h4>
              <p className="text-sm text-orange-700">
                Get 20% off on your next purchase. Use code: SAVE20
              </p>
              <button className="mt-2 bg-orange-500 text-white px-4 py-1 rounded text-sm hover:bg-orange-600 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;