import React, { useState, useEffect } from "react";
import { Heart, Star } from "lucide-react";
import axiosInstance from "@/services/axiosInstance";
import { useSelector } from "react-redux";
import { toast } from "react-fox-toast";
import { useNavigate } from "react-router-dom";

const ProductListing = () => {
  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/product?page=${page}&pageSize=10`
      );
      setProducts(response.data.products);
      setTotalPages(Math.ceil(response.data.total / response.data.pageSize));
      setError(null);
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleBuyNow = (product: any) => {
    console.log(user, "user in the handlebuynow");
    if (!user) {
      toast.error("Please login to purchase");
      return;
    }
    navigate("/checkout", { state: { product } });
  };

  const formatPrice = (price: any) => {
    return `₹${price}`;
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Our Products</h1>
        <p className="text-gray-600">
          Discover amazing deals on quality products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product: any) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative aspect-square bg-gray-100">
              <img
                src={
                  product.imageURL
                    ? `${"http://localhost:8000"}${product.imageURL}`
                    : "/api/placeholder/300/300"
                }
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.target.src = "/api/placeholder/300/300";
                }}
              />
              <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </button>

              {product.stockQuantity === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 h-10">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {/* <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span> */}
                {/* <span className="text-sm text-green-600 font-medium">{discount}% off</span> */}
              </div>

              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">(4.5)</span>
              </div>

              <div className="text-xs text-gray-500 mb-3">
                {product.stockQuantity > 0 ? (
                  <span className="text-green-600">
                    In Stock ({product.stockQuantity} available)
                  </span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>

              <button
                className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  product.stockQuantity > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={product.stockQuantity === 0}
                onClick={() => handleBuyNow(product)}
              >
                {product.stockQuantity > 0 ? "BUY NOW" : "Out of Stock"}
              </button>
            </div>
          </div>
        ))}

        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex items-center justify-center min-h-[300px]">
          <div className="text-center p-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              MORE PRODUCTS
            </h3>
            <h4 className="text-xl font-bold text-white mb-4">DEALS</h4>
            <button className="bg-white text-orange-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
              EXPLORE MORE DEALS →
            </button>
            <p className="text-white text-sm mt-2">Shop Now</p>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
