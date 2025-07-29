"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Download, Plus, Minus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProduct } from "@/lib/firebase-services";
import { Product } from "@/types";

type TabType = "overview" | "specs" | "sizeChart" | "faq";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The product you're looking for doesn't exist.
            </p>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

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
                  <ChevronRight className="flex-shrink-0 h-5 w-5 text-gray-300" />
                  <Link
                    href={`/category/${product.categoryId}`}
                    className="ml-4 text-gray-500 hover:text-gray-700"
                  >
                    {product.categoryName}
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="flex-shrink-0 h-5 w-5 text-gray-300" />
                  <span className="ml-4 text-sm font-medium text-gray-500">
                    {product.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="relative w-full h-96 mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative w-full h-20">
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.isSale && product.discount && (
                  <span className="ml-2 text-lg text-red-600">
                    -{product.discount}%
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Product Options */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Available Sizes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-4 py-2 bg-blue-600 text-white border border-blue-600 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Available Colors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span
                        key={color.name}
                        className="px-3 py-1 rounded-md text-sm text-white"
                        style={{ backgroundColor: color.hex }}
                      >
                        {color.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <svg
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Satisfaction Guarantee */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-blue-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-blue-800">
              100% satisfaction guaranteed
            </span>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "specs", label: "Specs & Templates" },
                { id: "sizeChart", label: "Size Charts" },
                { id: "faq", label: "FAQ" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>

                {product.overview?.materialOptions &&
                  product.overview.materialOptions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Material Stock Options
                      </h3>
                      <ul className="space-y-2">
                        {product.overview.materialOptions.map(
                          (option, index) => (
                            <li key={index} className="text-gray-600">
                              • {option}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {product.overview?.designGuidelines &&
                  product.overview.designGuidelines.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-blue-600 mb-3">
                        Embroidery Design Guidelines
                      </h3>
                      <ul className="space-y-2">
                        {product.overview.designGuidelines.map(
                          (guideline, index) => (
                            <li key={index} className="text-gray-600">
                              • {guideline}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {product.overview?.qualityFeatures &&
                  product.overview.qualityFeatures.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-blue-600 mb-3">
                        Premium Quality at Best Price
                      </h3>
                      <ul className="space-y-2">
                        {product.overview.qualityFeatures.map(
                          (feature, index) => (
                            <li key={index} className="text-gray-600">
                              • {feature}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            {/* Specs & Templates Tab */}
            {activeTab === "specs" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Specs & Templates
                </h2>

                {product.specs?.templates &&
                  product.specs.templates.length > 0 && (
                    <div className="space-y-4">
                      {product.specs.templates.map((template, index) => (
                        <div key={index} className="flex items-center">
                          <span className="mr-2">•</span>
                          <a
                            href={template.url}
                            download
                            className="text-blue-600 hover:text-blue-800 underline flex items-center"
                          >
                            Download {template.name} (
                            {template.type.toUpperCase()})
                            <Download className="h-4 w-4 ml-1" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}

                {product.specs?.specifications &&
                  product.specs.specifications.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Specifications
                      </h3>
                      <ul className="space-y-2">
                        {product.specs.specifications.map((spec, index) => (
                          <li key={index} className="text-gray-600">
                            • {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {(!product.specs?.templates ||
                  product.specs.templates.length === 0) &&
                  (!product.specs?.specifications ||
                    product.specs.specifications.length === 0) && (
                    <p className="text-gray-500">
                      Specs and downloadable print templates will be shown here.
                    </p>
                  )}
              </div>
            )}

            {/* Size Charts Tab */}
            {activeTab === "sizeChart" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Size Charts
                </h2>

                {product.sizeChart?.sizes &&
                product.sizeChart.sizes.length > 0 ? (
                  <div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                              Size
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                              Chest (in)
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                              Length (in)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.sizeChart.sizes.map((size, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-200"
                            >
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {size.size}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {size.chest}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {size.length}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {product.sizeChart.instructions && (
                      <p className="text-sm text-gray-600 mt-4">
                        {product.sizeChart.instructions}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Size chart information will be displayed here.
                  </p>
                )}
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === "faq" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ</h2>

                {product.faq && product.faq.length > 0 ? (
                  <div className="space-y-4">
                    {product.faq.map((item, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg"
                      >
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                        >
                          <span className="font-medium text-gray-900">
                            {item.question}
                          </span>
                          {expandedFaq === index ? (
                            <Minus className="h-5 w-5 text-gray-500" />
                          ) : (
                            <Plus className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        {expandedFaq === index && (
                          <div className="px-4 pb-3">
                            <p className="text-gray-600">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Frequently asked questions will be displayed here.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600">
            Suridhi customizes all its products in facilities located within
            India. Some of our raw materials, intermediate components, and
            consumables used in the manufacturing of the final product could be
            from one or more countries. As we follow Global Sourcing, one
            product is likely to have a different country of origin depending on
            the batch sold.
          </p>
          <p className="text-sm text-gray-600 mt-2">Country of origin: India</p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
