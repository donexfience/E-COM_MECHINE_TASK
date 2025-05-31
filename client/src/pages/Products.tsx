import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  RefreshCw,
  Search,
  DollarSign,
  Calendar,
  Package,
  Filter,
  AlertCircle,
  Edit,
  Trash2,
  ImageIcon,
} from "lucide-react";
import AddProduct from "../components/Admin/Product/AddProduct";
import {
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/services/Api/productApiSlice";
import { toast } from "react-fox-toast";
import axiosInstance from "@/services/axiosInstance";
import { DatePicker } from "@/components/ui/date-picker";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageURL?: string;
}

interface ProductsResponse {
  total: number;
  page: number;
  pageSize: number;
  products: Product[];
}

const Products = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 10;

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("search", searchQuery);
      if (priceRange[0] > 0)
        queryParams.append("minPrice", priceRange[0].toString());
      if (priceRange[1] < 1000)
        queryParams.append("maxPrice", priceRange[1].toString());
      if (dateRange.start)
        queryParams.append("startDate", dateRange.start.toISOString());
      if (dateRange.end)
        queryParams.append("endDate", dateRange.end.toISOString());
      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", pageSize.toString());

      const response = await axiosInstance.get<ProductsResponse>(
        `/product?${queryParams.toString()}`
      );
      setProducts(response.data.products || []);
      setTotalProducts(response.data.total);
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to fetch products";
      setError(errorMessage);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, priceRange, dateRange, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceRange, dateRange]);

  const handleAddProduct = async (formData: FormData) => {
    try {
      await addProduct(formData).unwrap();
      setIsAddModalOpen(false);
      toast.success("Product added successfully");
      await fetchProducts();
    } catch (err: any) {
      console.error("Failed to add product:", err);
      toast.error(err?.data?.message || "Failed to add product");
    }
  };

  const handleEditProduct = async (formData: FormData) => {
    if (!selectedProduct) return;

    try {
      await updateProduct({ id: selectedProduct._id, formData }).unwrap();
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      toast.success("Product updated successfully");
      await fetchProducts();
    } catch (err: any) {
      console.error("Failed to update product:", err);
      toast.error(err?.data?.message || "Failed to update product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Product deleted successfully");
        await fetchProducts();
      } catch (err: any) {
        console.error("Failed to delete product:", err);
        toast.error(err?.data?.message || "Failed to delete product");
      }
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return "destructive";
    if (stock < 10) return "secondary";
    return "default";
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Product Management
            </h1>
            <p className="text-slate-600">Manage your inventory with ease</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              disabled={isAdding}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAdding ? "Adding..." : "Add Product"}
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="border-slate-300 hover:bg-slate-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-sm border-0 shadow-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {totalProducts}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-0 shadow-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">
                    Price Range
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${priceRange[0]} - ${priceRange[1]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-0 shadow-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Filter className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">
                    Current Page
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {currentPage} of {Math.ceil(totalProducts / pageSize)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-sm border-0 shadow-slate-200/50 w-full">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-900">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <div className="space-y-2">
                <label
                  htmlFor="search"
                  className="text-sm font-medium text-slate-700 flex items-center"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search by Name
                </label>
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter product name"
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Price Range ($)
                </label>
                <div className="px-3">
                  <Slider
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) =>
                      setPriceRange([value[0], value[1]])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-1">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Created Date Range
                </label>
                <div className="flex gap-2 items-center ">
                  <DatePicker
                    value={dateRange.start}
                    onChange={(date: any) =>
                      setDateRange((prev) => ({ ...prev, start: date }))
                    }
                  />
                  <span className="text-slate-500">to</span>
                  <DatePicker
                    value={dateRange.end}
                    onChange={(date: any) =>
                      setDateRange((prev) => ({ ...prev, end: date }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="bg-white shadow-sm border-0 shadow-slate-200/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-3" />
                <p className="text-slate-600">Loading products...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="bg-red-50 border-red-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <p className="text-red-800">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && products.length > 0 && (
          <Card className="bg-white shadow-sm border-0 shadow-slate-200/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption className="text-slate-600 pb-4">
                    A list of your products with advanced filtering options.
                  </TableCaption>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="font-semibold text-slate-700">
                        Product
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Description
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Price
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Stock Status
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Image
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow
                        key={product._id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {product._id.slice(-8)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p
                            className="text-slate-700 truncate"
                            title={product.description}
                          >
                            {product.description}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                            <span className="font-semibold text-slate-900">
                              {product.price.toFixed(2)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge
                              variant={getStockBadgeVariant(
                                product.stockQuantity
                              )}
                            >
                              {getStockText(product.stockQuantity)}
                            </Badge>
                            <p className="text-xs text-slate-500">
                              Qty: {product.stockQuantity}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.imageURL ? (
                            <div className="relative group">
                              <img
                                src={product.imageURL}
                                alt={product.name}
                                className="h-12 w-12 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all" />
                            </div>
                          ) : (
                            <div className="h-12 w-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(product)}
                              disabled={isUpdating || isDeleting}
                              className="border-slate-300 hover:bg-slate-50"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              {isUpdating ? "Updating..." : "Edit"}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(product._id)}
                              disabled={isDeleting}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && !error && (
          <Card className="bg-white shadow-sm border-0 shadow-slate-200/50">
            <CardContent className="p-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No products found
                </h3>
                <p className="text-slate-500 mb-6">
                  Get started by adding your first product to the inventory.
                </p>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalProducts > 0 && (
          <div className="flex justify-center">
            <nav className="flex items-center gap-2 mt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev: number) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-slate-700">
                Page {currentPage} of {Math.ceil(totalProducts / pageSize)}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev: number) =>
                    Math.min(prev + 1, Math.ceil(totalProducts / pageSize))
                  )
                }
                disabled={currentPage === Math.ceil(totalProducts / pageSize)}
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>

      <AddProduct
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddProduct={handleAddProduct}
      />

      {selectedProduct && (
        <AddProduct
          isOpen={isEditModalOpen}
          onOpenChange={(open: boolean) => {
            setIsEditModalOpen(open);
            if (!open) setSelectedProduct(null);
          }}
          onAddProduct={handleEditProduct}
          initialData={{
            name: selectedProduct.name,
            description: selectedProduct.description,
            price: selectedProduct.price.toString(),
            stockQuantity: selectedProduct.stockQuantity.toString(),
          }}
        />
      )}
    </div>
  );
};

export default Products;
