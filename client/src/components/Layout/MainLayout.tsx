import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Landing Page/Header";
import PromoBanner from "../Landing Page/PromoBanner";
import LoginModal from "../modals/auth/Login";
import AuthModal from "../modals/auth/Signup";

const MainLayout: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  };

  const handleOpenSignupModal = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleCloseSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBanner />
      <Header
        onOpenLoginModal={handleOpenLoginModal}
        onOpenSignupModal={handleOpenSignupModal}
      />
      <Outlet />
      {isLoginModalOpen && (
        <LoginModal
          open={isLoginModalOpen}
          onOpenChange={handleCloseLoginModal}
          onSwitchToSignup={handleOpenSignupModal}
        />
      )}

      {isSignupModalOpen && (
        <AuthModal
          open={isSignupModalOpen}
          onOpenChange={handleCloseSignupModal}
          onSwitchToLogin={handleOpenLoginModal}
        />
      )}
    </div>
  );
};

export default MainLayout;
