import { CheckoutForm } from "@/components/user/checkout/Checkoutform";
import { PaymentSuccess } from "@/components/user/checkout/PaymentSuccess";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  ArrowLeft,
  ShoppingBag,
  User,
  Mail,
  Package,
  Truck,
  Shield,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-fox-toast";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  console.log(stripePromise, "strippromise");
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);

  const product = location.state?.product;

  useEffect(() => {
    if (!product) {
      navigate("/");
      return;
    }

    if (!user) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }
  }, [product, user, navigate]);

  const handlePaymentSuccess = (intent: any) => {
    setPaymentIntent(intent);
    setPaymentSuccess(true);
    toast.success("Payment successful!");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (!product || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12">
        <div className="max-w-2xl mx-auto p-6">
          <PaymentSuccess
            product={product}
            paymentIntent={paymentIntent}
            onContinueShopping={handleContinueShopping}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Products</span>
            </button>

            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Secure Checkout
              </h1>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4 text-green-500" />
              <span>SSL Secured</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="relative">
                    <img
                      src={
                        product.imageURL
                          ? `http://localhost:8000${product.imageURL}`
                          : "/api/placeholder/80/80"
                      }
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Digital Product
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        (Premium Quality)
                      </span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      ${product.price}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${product.price}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">Shipping</span>
                    </div>
                    <span className="font-medium text-green-600">Free</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="font-medium text-green-600">$0</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      ${product.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Details
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-semibold text-gray-900">
                      {user.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-semibold text-gray-900">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-xl">
                  <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-green-800">
                    256-bit SSL
                  </p>
                  <p className="text-xs text-green-600">Encrypted</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-blue-800">
                    Instant Access
                  </p>
                  <p className="text-xs text-blue-600">Digital Delivery</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Secure Payment
                </h2>
                <p className="text-indigo-100 mt-1">
                  Your information is protected and encrypted
                </p>
              </div>

              <div className="p-8">
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    product={product}
                    user={user}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">SSL Secured Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">
                Instant Digital Delivery
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">
                Premium Quality Products
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Truck className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Free Worldwide Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
