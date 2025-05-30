// Header.tsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  MapPin,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoginModal from "../modals/Login";
import AuthModal from "../modals/signup";
import { logoutUser } from "@/features/auth/authSlice";
import type { RootState } from "@/store";

const Header: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const user: any = useSelector((state: RootState) => state.auth.user);
  console.log(user,"user got in header")
  const dispatch = useDispatch();

  const topLinks = [
    "SELL ON E-COMMERCE",
    "BECOME A SELLER",
    "BUY IN BULK",
    "GIFT CARDS",
    "TRACK YOUR ORDER",
    "CONTACT US",
  ];

  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsAuthModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsAuthModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="w-full">
      <div className="border-b">
        <div className="border-b border-gray-200 py-2">
          <div className="container mx-auto px-4">
            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              {topLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="hover:text-gray-900 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search"
                  className="pl-10 border-gray-300 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <h1 className="text-3xl font-bold text-orange-500">E-COMMERCE</h1>
            </div>

            <div className="flex-1 flex items-center justify-end space-x-6">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">
                    Hello, {user.username}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-700"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Sign Up Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-700"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    Sign In
                  </Button>
                </>
              )}

              <div className="flex items-center space-x-1 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Find a Store</span>
              </div>

              <div className="flex items-center space-x-4">
                <User className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                <Heart className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                <ShoppingCart className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        onSwitchToSignup={handleSwitchToSignup}
      />
    </div>
  );
};

export default Header;
