import  { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Package,
  Calendar,
  CreditCard,
  Eye,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "react-fox-toast";

const PurchaseHistory = () => {
  const user = useSelector((state: any) => state.auth.user);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user) {
      fetchPurchaseHistory();
    }
  }, [user, page]);

  const fetchPurchaseHistory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/purchase/all/history?page=${page}&limit=10`
      );

      setPurchases(response.data.purchases);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError("Failed to fetch purchase history");
      console.error("Error fetching purchases:", err);
      toast.error("Failed to load purchase history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: any) => {
    switch (status) {
      case "processing":
        return {
          color: "bg-amber-50 text-amber-700 border border-amber-200",
          icon: <Clock className="w-3 h-3" />,
          bgColor: "bg-amber-100",
        };
      case "shipped":
        return {
          color: "bg-blue-50 text-blue-700 border border-blue-200",
          icon: <Truck className="w-3 h-3" />,
          bgColor: "bg-blue-100",
        };
      case "delivered":
        return {
          color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
          icon: <CheckCircle className="w-3 h-3" />,
          bgColor: "bg-emerald-100",
        };
      case "cancelled":
        return {
          color: "bg-red-50 text-red-700 border border-red-200",
          icon: <XCircle className="w-3 h-3" />,
          bgColor: "bg-red-100",
        };
      default:
        return {
          color: "bg-gray-50 text-gray-700 border border-gray-200",
          icon: <Package className="w-3 h-3" />,
          bgColor: "bg-gray-100",
        };
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-36 animate-pulse"></div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Access Required
          </h3>
          <p className="text-gray-600 mb-6">
            Please login to view your purchase history and track your orders.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Login Now
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={fetchPurchaseHistory}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Purchase History
              </h1>
              <p className="text-gray-600 mt-1">
                Track and manage all your orders in one place
              </p>
            </div>
          </div>
        </div>

        {purchases.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No purchases yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your shopping journey and discover amazing products tailored
              just for you.
            </p>
            <button
              onClick={() => (window.location.href = "/products")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {purchases.map((purchase: any) => {
                const statusConfig = getStatusConfig(purchase.orderStatus);

                return (
                  <div
                    key={purchase._id}
                    className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gray-200 group"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={
                              purchase.productImage
                                ? `http://localhost:8000${purchase.productImage}`
                                : "/api/placeholder/80/80"
                            }
                            alt={purchase.productName}
                            className="w-20 h-20 object-cover rounded-xl border border-gray-100 shadow-sm"
                          />
                          <div
                            className={`absolute -top-1 -right-1 w-4 h-4 ${statusConfig.bgColor} rounded-full flex items-center justify-center`}
                          >
                            {statusConfig.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">
                            {purchase.productName}
                          </h3>
                          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                            ₹{purchase.productPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.color}`}
                        >
                          {statusConfig.icon}
                          {purchase.orderStatus.charAt(0).toUpperCase() +
                            purchase.orderStatus.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Purchased</p>
                          <p>{formatDate(purchase.purchaseDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Payment</p>
                          <p className="capitalize">{purchase.paymentStatus}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order ID</p>
                          <p className="font-mono">
                            ...{purchase.paymentIntentId.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                      <div className="text-lg font-semibold text-gray-900">
                        <span className="text-gray-600 font-normal">
                          Total Paid:{" "}
                        </span>
                        <span className="text-green-600">
                          ₹{purchase.amount.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          toast.info("Order details feature coming soon!");
                        }}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 mt-8">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Showing page{" "}
                    <span className="font-semibold text-gray-900">{page}</span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-900">
                      {totalPages}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-25 disabled:text-gray-400 text-gray-700 rounded-lg border border-gray-200 disabled:border-gray-100 transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                                pageNum === page
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                  : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={page === totalPages}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-25 disabled:text-gray-400 text-gray-700 rounded-lg border border-gray-200 disabled:border-gray-100 transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
