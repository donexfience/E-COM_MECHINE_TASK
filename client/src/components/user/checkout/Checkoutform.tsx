import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  CheckCircle,
  Shield,
  User,
  Mail,
} from "lucide-react";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "react-fox-toast";

export const CheckoutForm = ({
  product,
  user,
  onSuccess,
}: {
  product: any;
  user: any;
  onSuccess: any;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [cardComplete, setCardComplete] = useState(false);

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const response = await axiosInstance.post("/payment/create-intent", {
        amount: product.price * 100, // Convert to cents
        currency: "usd",
        productId: product._id,
        productName: product.name,
      });

      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      toast.error("Failed to initialize payment");
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      toast.error("Card information is incomplete.");
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user.name,
              email: user.email,
            },
          },
        }
      );

      if (error) {
        console.error("Payment failed:", error);
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        await savePurchaseToDatabase(paymentIntent);
        onSuccess(paymentIntent);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const savePurchaseToDatabase = async (paymentIntent: any) => {
    try {
      await axiosInstance.post("/purchase/save", {
        userId: user._id,
        productId: product._id,
        productName: product.name,
        productPrice: product.price,
        productImage: product.imageURL,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        paymentStatus: paymentIntent.status,
        purchaseDate: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving purchase:", error);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1f2937",
        "::placeholder": {
          color: "#9ca3af",
        },
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        lineHeight: "24px",
        padding: "12px 16px",
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
      complete: {
        color: "#059669",
        iconColor: "#059669",
      },
    },
    hidePostalCode: true,
  };

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Order Summary
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-600">Digital Product</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">${product.price}</p>
            <p className="text-xs text-gray-500">One-time payment</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Customer Information
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{user.username}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{user.email}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:shadow-md">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Payment Information
          </h3>

          <div className="relative">
            <div
              className={`bg-gray-50 border-2 rounded-xl p-4 transition-all duration-200 ${
                cardComplete
                  ? "border-green-300 bg-green-50"
                  : "border-gray-200 focus-within:border-blue-300 focus-within:bg-white"
              }`}
            >
              <CardElement
                options={cardElementOptions}
                onChange={handleCardChange}
              />
            </div>
            {cardComplete && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
            <Shield className="w-4 h-4 text-green-600" />
            <span>
              Your payment information is secured with 256-bit SSL encryption
            </span>
          </div>
        </div>

        {/* Payment Button */}
        <button
          type="submit"
          disabled={!stripe || isProcessing || !clientSecret}
          className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 transform ${
            isProcessing || !stripe || !clientSecret
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              <span>Complete Payment • ${product.price}</span>
            </div>
          )}
        </button>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-4 h-4" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CreditCard className="w-4 h-4" />
            <span>Stripe Powered</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Lock className="w-4 h-4" />
            <span>PCI Compliant</span>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
          <p className="text-sm text-yellow-800 font-medium mb-2">Test Mode</p>
          <p className="text-xs text-yellow-700">
            <strong>Test Card:</strong> 4242 4242 4242 4242
            <br />
            <strong>Expiry:</strong> Any future date | <strong>CVC:</strong> Any
            3 digits
          </p>
        </div>
      </form>
    </div>
  );
};
