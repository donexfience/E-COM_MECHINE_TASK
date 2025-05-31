import { CheckCircle } from "lucide-react";

export const PaymentSuccess = ({
  product,
  paymentIntent,
  onContinueShopping,
}: {
  product: any;
  paymentIntent: any;
  onContinueShopping: any;
}) => {
  return (
    <div className="text-center py-8">
      <div className="mb-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto mb-6">
        <div className="flex items-center gap-4">
          <img
            src={
              product.imageURL
                ? `http://localhost:8000${product.imageURL}`
                : "/api/placeholder/80/80"
            }
            alt={product.name}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="text-gray-600">₹{product.price}</p>
            <p className="text-sm text-gray-500">
              Payment ID: {paymentIntent.id.slice(-8)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onContinueShopping}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => (window.location.href = "/orders")}
          className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};
