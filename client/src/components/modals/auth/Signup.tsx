import { validateEmail, validatePassword, validateUsername } from "@/lib/utils";
import { Apple, Chrome, Eye, EyeOff, Facebook, Info } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSignupMutation } from "@/services/Api/AuthApiSlice";
import toast from "react-hot-toast";
import {  useNavigate } from "react-router-dom";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

const AuthModal = ({ open, onOpenChange, onSwitchToLogin }: AuthModalProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signup, { isLoading }] = useSignupMutation();

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

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;

    if (!validateUsername(username)) {
      setUsernameError(
        "Username must be at least 3 characters and contain only letters and numbers."
      );
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters and include a letter, a number, and a special character."
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      try {
        await signup({ username, email, password }).unwrap();
        toast.success("login successfull ");
        navigate("/");
        onOpenChange(false);
      } catch (err) {
        console.error("Signup failed:", err);
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
              For your protection, please verify your identity.
            </AlertDescription>
          </Alert>
          <div className="text-sm text-blue-100 mb-1">Step 1 of 2</div>
          <DialogTitle className="text-2xl font-semibold text-white">
            Create an account
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
                Sign up with email
              </h3>
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  onClick={onSwitchToLogin}
                >
                  Sign in
                </button>
              </p>
            </div>

            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11"
                  required
                />
                {usernameError && (
                  <p className="text-red-500 text-sm">{usernameError}</p>
                )}
              </div>

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
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Continue"}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
