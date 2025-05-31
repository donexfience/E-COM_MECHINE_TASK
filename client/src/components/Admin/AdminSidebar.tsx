import React, { useState, useEffect } from "react";
import {
  Home,
  Users,
  BarChart3,
  Settings,
  FileText,
  ShoppingCart,
  Bell,
  Mail,
  Calendar,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: any) => state.auth.user);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/admin" },
    { id: "users", label: "Users", icon: Users, href: "users" },
    {
      id: "products",
      label: "products",
      icon: BarChart3,
      href: "products",
    },
    { id: "orders", label: "Orders", icon: ShoppingCart, href: "orders" },
    { id: "reports", label: "Reports", icon: FileText, href: "reports" },
    { id: "purchase", label: "Calendar", icon: Calendar, href: "calendar" },
    { id: "messages", label: "Messages", icon: Mail, href: "messages" },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      href: "admin/notifications",
    },
    { id: "settings", label: "Settings", icon: Settings, href: "admin/settings" },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const getActiveItem = () => {
    const match = navigationItems.find((item) =>
      location.pathname.startsWith(item.href)
    );
    return match?.id || "dashboard";
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [location.pathname]);

  return (
    <div
      className={`bg-slate-900 text-white h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } shadow-2xl`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center space-x-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg">
              A
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AdminPanel
                </h1>
                <p className="text-xs text-slate-400">Management System</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  navigate(item.href);
                }}
                className={`w-full text-left flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : ""}
              >
                <IconComponent
                  size={20}
                  className={`${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  } transition-colors`}
                />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                {!isCollapsed && isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="border-t border-slate-700 p-4">
        <div
          className={`flex items-center space-x-3 mb-4 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          {!isCollapsed && user && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.username || "Admin"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user.email || "online"}
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center space-x-3 px-3 py-3 text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all duration-200 group ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut
            size={20}
            className="text-slate-400 group-hover:text-red-400 transition-colors"
          />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
