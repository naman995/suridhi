"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DynamicNavbar from "@/components/DynamicNavbar";

import ProductCard from "@/components/ProductCard";
import {
  getCategory,
  getProducts,
  getSubcategories,
} from "@/lib/firebase-services";
import { Category, Product } from "@/types";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [categoryId]);

  const fetchCategoryAndProducts = async () => {
    try {
      const [categoryData, productsData, subcategoriesData] = await Promise.all(
        [
          getCategory(categoryId),
          getProducts(categoryId),
          getSubcategories(categoryId),
        ]
      );

      if (!categoryData) {
        setError("Category not found");
        return;
      }

      setCategory(categoryData);
      setProducts(productsData);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error("Error fetching category data:", error);
      setError("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DynamicNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DynamicNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Category Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The category you're looking for doesn't exist.
            </p>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DynamicNavbar />

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">
                    {category.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {category.name}
                  </h1>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {category.description ||
                      "Explore our amazing collection of products in this category."}
                  </p>
                </div>
                <div className="flex justify-center lg:justify-end">
                  {category.image ? (
                    <div className="relative w-full max-w-md h-64">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-md h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subcategories Section */}
            {subcategories.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Subcategories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/subcategory/${categoryId}/${subcategory.id}`}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        {subcategory.image && (
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={subcategory.image}
                              alt={subcategory.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {subcategory.name}
                          </h3>
                          {subcategory.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {subcategory.description}
                            </p>
                          )}
                          <p className="text-xs text-blue-600 mt-2">
                            View products →
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Products Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {subcategories.length > 0 ? "All Products" : "Products"}
              </h2>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No products found in this category.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              {/* Category Title */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category.name}
                </h3>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">
                    {products.length} product{products.length !== 1 ? "s" : ""}{" "}
                    available
                  </p>
                </div>
              </div>

              {/* Category Navigation */}
              <div className="space-y-6">
                {/* Loved by our customers section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Loved by our customers
                  </h4>
                  <ul className="space-y-2">
                    {products.slice(0, 9).map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/product/${product.id}`}
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors block py-1"
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Explore More section */}
                {products.length > 9 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Explore More {category.name}
                    </h4>
                    <ul className="space-y-2">
                      {products.slice(9).map((product) => (
                        <li key={product.id}>
                          <Link
                            href={`/product/${product.id}`}
                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors block py-1"
                          >
                            {product.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
