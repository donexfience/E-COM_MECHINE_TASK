import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-blue-600">1,234</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Total Orders
            </h3>
            <p className="text-3xl font-bold text-green-600">5,678</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Revenue
            </h3>
            <p className="text-3xl font-bold text-purple-600">$89,012</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Products
            </h3>
            <p className="text-3xl font-bold text-orange-600">345</p>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                Manage Users
              </button>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors">
                View Orders
              </button>
              <button className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors">
                Manage Products
              </button>
              <button className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors">
                Analytics
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-600">New user registered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-gray-600">Order #1234 completed</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-sm text-gray-600">Product updated</p>
                <p className="text-xs text-gray-500">10 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
