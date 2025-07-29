"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getProduct, deleteProduct } from "@/lib/firebase-services";
import { Product } from "@/types";

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const productData = await getProduct(productId);
      if (!productData) {
        setError("Product not found");
        return;
      }
      setProduct(productData);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeleting(true);
    try {
      await deleteProduct(productId);
      router.push("/admin/products");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete product";
      setError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error && error === "Product not found") {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/admin/products"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link
              href="/admin/products"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/products"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/admin/products/${productId}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600">Product Details</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Basic Information
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="text-sm text-gray-900">{product.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Price</dt>
                    <dd className="text-sm text-gray-900">
                      ₹{product.price.toFixed(2)}
                      {product.isSale && product.discount && (
                        <span className="ml-2 text-xs text-red-600">
                          -{product.discount}% off
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Category
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {product.categoryName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Description
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {product.description}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Ratings & Reviews
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Rating
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {product.rating}/5
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Reviews
                    </dt>
                    <dd className="text-sm text-gray-900">{product.reviews}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Product Status
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Stock Status
                    </dt>
                    <dd className="text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Product Type
                    </dt>
                    <dd className="text-sm">
                      <div className="flex space-x-2">
                        {product.isNew && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                        {product.isSale && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            On Sale
                          </span>
                        )}
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Available Sizes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="inline-flex px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Available Colors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span
                        key={color.name}
                        className="inline-flex px-3 py-1 rounded-full text-sm"
                        style={{
                          backgroundColor: color.hex,
                          color: color.hex === "#FFFFFF" ? "#000" : "#fff",
                        }}
                      >
                        {color.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Timestamps
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Created
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {product.createdAt.toLocaleDateString()} at{" "}
                      {product.createdAt.toLocaleTimeString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Last Updated
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {product.updatedAt.toLocaleDateString()} at{" "}
                      {product.updatedAt.toLocaleTimeString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
