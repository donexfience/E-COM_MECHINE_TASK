import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Info, Chrome, Facebook, Apple } from "lucide-react";
import { validateEmail } from "@/lib/utils";
import { useLoginMutation } from "@/services/Api/AuthApiSlice";
import { setUser } from "@/features/auth/authSlice";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup?: () => void;
}

const LoginModal = ({
  open,
  onOpenChange,
  onSwitchToSignup,
}: LoginModalProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [login, { isLoading}] = useLoginMutation();

  const socialProviders = [
    {
      name: "Google",
      icon: <Chrome className="h-6 w-6" />,
      color: "bg-white border-gray-200 hover:bg-gray-50",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-6 w-6" />,
      color: "bg-white border-gray-200 hover:bg-gray-50",
    },
    {
      name: "Apple",
      icon: <Apple className="h-6 w-6" />,
      color: "bg-white border-gray-200 hover:bg-gray-50",
    },
  ];

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      try {
        const result = await login({ email, password }).unwrap();
        dispatch(setUser(result.user));
        onOpenChange(false);
        const state = location.state as any;

        if (result.user.role === "admin" && state?.requireAdmin) {
          navigate("/admin", { replace: true });
        } else if (state?.from?.pathname && state.from.pathname !== "/") {
          navigate(state.from.pathname, { replace: true });
        }
      } catch (err) {
        console.error("Login failed:", err);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <Alert className="bg-blue-700 border-blue-500 text-white mb-3">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-white">
              Please enter your credentials to log in.
            </AlertDescription>
          </Alert>
          <DialogTitle className="text-2xl font-semibold text-white">
            Sign in to your account
          </DialogTitle>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {socialProviders.map((provider) => (
              <Button
                key={provider.name}
                variant="outline"
                className={`h-12 ${provider.color} flex items-center justify-center`}
              >
                {provider.icon}
              </Button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Sign in with email
              </h3>
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  onClick={onSwitchToSignup}
                >
                  Sign up
                </button>
              </p>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11"
                  required
                />
                {emailError && (
                  <p className="text-red-500 text-sm">{emailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}
                <div className="text-sm">
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
