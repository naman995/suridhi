"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Download,
  Plus,
  Minus,
  Star,
  CheckCircle,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import DynamicNavbar from "@/components/DynamicNavbar";
import { getProduct } from "@/lib/firebase-services";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";

type TabType = "overview" | "specs" | "sizeChart" | "faq";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [showQuantityDropdown, setShowQuantityDropdown] =
    useState<boolean>(false);

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
      setMainImage(productData.image);
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

  // Calculate price based on quantity and pricing tiers
  const getPriceForQuantity = (quantity: number): number => {
    if (!product?.quantityTiers || product.quantityTiers.length === 0) {
      return product?.price || 0;
    }

    // Find the appropriate tier for the quantity
    const tier = product.quantityTiers.find(
      (tier) => quantity >= tier.minQuantity && quantity <= tier.maxQuantity
    );

    return tier ? tier.pricePerUnit : product.price;
  };

  const currentPrice = getPriceForQuantity(selectedQuantity);
  const totalPrice = currentPrice * selectedQuantity;

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <DynamicNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <DynamicNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <DynamicNavbar />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-300" />
                  <Link
                    href={`/category/${product.categoryId}`}
                    className="ml-4 text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    {product.categoryName}
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-300" />
                  <span className="ml-4 text-sm font-medium text-gray-900">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Images */}
            <div className="bg-gray-50 p-8">
              <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden bg-white">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    NEW
                  </div>
                )}
                {product.isSale && product.discount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    -{product.discount}% OFF
                  </div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className="relative w-full h-20 rounded-lg overflow-hidden cursor-pointer border-2 hover:border-blue-500 transition-colors"
                      onClick={() => setMainImage(image)}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8 flex items-center">
              <div className="w-full">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 font-medium">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                    {product.isSale && product.discount && (
                      <span className="text-lg text-red-600 font-semibold">
                        -{product.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">
                      ₹{currentPrice.toFixed(2)} per unit
                    </span>
                    {selectedQuantity > 1 && (
                      <span className="text-xs text-gray-400">
                        × {selectedQuantity} units
                      </span>
                    )}
                  </div>
                  {product.isSale && product.discount && (
                    <p className="text-sm text-gray-500 mt-1">
                      Original price:{" "}
                      <span className="line-through">
                        ₹
                        {(product.price / (1 - product.discount / 100)).toFixed(
                          2
                        )}
                      </span>
                    </p>
                  )}
                </div>

                <div className="mb-8">
                  <p className="text-gray-700 leading-relaxed text-base">
                    {product.description}
                  </p>
                </div>

                {/* Product Options */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Select Size
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-6 py-3 border-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedSize === size
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors && product.colors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Select Color
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedColor === color.name
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                          style={{
                            backgroundColor: color.hex,
                            color: color.hex === "#FFFFFF" ? "#000" : "#fff",
                          }}
                        >
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Quantity
                  </h3>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowQuantityDropdown(!showQuantityDropdown)
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-gray-300 transition-colors"
                    >
                      <span className="text-gray-900">
                        {selectedQuantity} (₹{currentPrice.toFixed(2)} / unit)
                      </span>
                      <ChevronRight
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          showQuantityDropdown ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {showQuantityDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                        {(() => {
                          // Generate quantity options based on tiers or default to 1-10
                          let quantityOptions: number[] = [];

                          if (
                            product.quantityTiers &&
                            product.quantityTiers.length > 0
                          ) {
                            // Use the tiers to generate quantity options
                            product.quantityTiers.forEach((tier) => {
                              for (
                                let qty = tier.minQuantity;
                                qty <= tier.maxQuantity;
                                qty++
                              ) {
                                if (!quantityOptions.includes(qty)) {
                                  quantityOptions.push(qty);
                                }
                              }
                            });
                            // Add base quantity if not in tiers
                            if (!quantityOptions.includes(1)) {
                              quantityOptions.unshift(1);
                            }
                            // Sort and limit to reasonable range
                            quantityOptions = quantityOptions
                              .sort((a, b) => a - b)
                              .slice(0, 20); // Limit to 20 options
                          } else {
                            // Default to 1-10 if no tiers
                            quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                          }

                          return quantityOptions.map((quantity) => {
                            const priceForQuantity =
                              getPriceForQuantity(quantity);
                            return (
                              <button
                                key={quantity}
                                onClick={() => {
                                  setSelectedQuantity(quantity);
                                  setShowQuantityDropdown(false);
                                }}
                                className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                                  selectedQuantity === quantity
                                    ? "bg-blue-50 border-l-4 border-blue-600"
                                    : "border-l-4 border-transparent"
                                }`}
                              >
                                <span className="text-gray-900">
                                  {quantity} (₹{priceForQuantity.toFixed(2)} /
                                  unit)
                                </span>
                                {selectedQuantity === quantity && (
                                  <CheckCircle className="h-5 w-5 text-blue-600" />
                                )}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                  {product.quantityTiers &&
                    product.quantityTiers.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-2">
                          Bulk Pricing Available
                        </p>
                        <div className="space-y-1">
                          {product.quantityTiers.map((tier, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-xs text-blue-800"
                            >
                              <span>
                                {tier.minQuantity === tier.maxQuantity
                                  ? `${tier.minQuantity} unit`
                                  : `${tier.minQuantity}-${tier.maxQuantity} units`}
                              </span>
                              <span className="font-medium">
                                ₹{tier.pricePerUnit.toFixed(2)} per unit
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                <div className="mb-6">
                  <button
                    onClick={() => {
                      addItem(
                        product,
                        selectedQuantity,
                        selectedSize,
                        selectedColor
                      );
                      // Show success message
                      alert(
                        `Added ${selectedQuantity} ${
                          selectedQuantity === 1 ? "item" : "items"
                        } to cart!`
                      );
                    }}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-base"
                  >
                    Add to Cart
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-gray-600">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-gray-600">
                      Secure Payment
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-gray-600">Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Satisfaction Guarantee */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-blue-600 mr-3" />
            <span className="text-blue-800 font-semibold">
              100% satisfaction guaranteed • Free returns within 30 days
            </span>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-8">
              {[
                { id: "overview", label: "Overview" },
                { id: "specs", label: "Specs & Templates" },
                { id: "sizeChart", label: "Size Charts" },
                { id: "faq", label: "FAQ" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-6 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Product Overview
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {product.description}
                  </p>
                </div>

                {product.overview?.materialOptions &&
                  product.overview.materialOptions.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Material Stock Options
                      </h3>
                      <ul className="space-y-2">
                        {product.overview.materialOptions.map(
                          (option, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-700">{option}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {product.overview?.designGuidelines &&
                  product.overview.designGuidelines.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">
                        Embroidery Design Guidelines
                      </h3>
                      <ul className="space-y-2">
                        {product.overview.designGuidelines.map(
                          (guideline, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-blue-800">{guideline}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {product.overview?.qualityFeatures &&
                  product.overview.qualityFeatures.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-green-900 mb-4">
                        Premium Quality Features
                      </h3>
                      <ul className="space-y-2">
                        {product.overview.qualityFeatures.map(
                          (feature, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-green-800">{feature}</span>
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
                  Specifications & Templates
                </h2>

                {product.specs?.templates &&
                  product.specs.templates.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Downloadable Templates
                      </h3>
                      <div className="space-y-3">
                        {product.specs.templates.map((template, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                          >
                            <div>
                              <span className="font-medium text-gray-900">
                                {template.name}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                ({template.type.toUpperCase()})
                              </span>
                            </div>
                            <a
                              href={template.url}
                              download
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {product.specs?.specifications &&
                  product.specs.specifications.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">
                        Product Specifications
                      </h3>
                      <ul className="space-y-2">
                        {product.specs.specifications.map((spec, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-blue-800">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {(!product.specs?.templates ||
                  product.specs.templates.length === 0) &&
                  (!product.specs?.specifications ||
                    product.specs.specifications.length === 0) && (
                    <div className="text-center py-12">
                      <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Specs and downloadable print templates will be shown
                        here.
                      </p>
                    </div>
                  )}
              </div>
            )}

            {/* Size Charts Tab */}
            {activeTab === "sizeChart" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Size Chart
                </h2>

                {product.sizeChart?.sizes &&
                product.sizeChart.sizes.length > 0 ? (
                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            {product.sizeChart.columns?.map((column) => (
                              <th
                                key={column}
                                className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                              >
                                {column}
                              </th>
                            )) || (
                              <>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                  Size
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                  Chest (inches)
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                  Length (inches)
                                </th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {product.sizeChart?.sizes.map((size, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              {product.sizeChart?.columns?.map((column) => (
                                <td
                                  key={column}
                                  className="px-6 py-4 text-sm text-gray-700"
                                >
                                  {size[column] || ""}
                                </td>
                              )) || (
                                <>
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {size.size || ""}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-700">
                                    {size.chest || ""}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-700">
                                    {size.length || ""}
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {product.sizeChart?.instructions && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          {product.sizeChart.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-gray-400 text-xl">📏</span>
                    </div>
                    <p className="text-gray-500">
                      Size chart information will be displayed here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === "faq" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>

                {product.faq && product.faq.length > 0 ? (
                  <div className="space-y-4">
                    {product.faq.map((item, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
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
                          <div className="px-6 pb-4 border-t border-gray-100">
                            <p className="text-gray-700 pt-4 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-gray-400 text-xl">❓</span>
                    </div>
                    <p className="text-gray-500">
                      Frequently asked questions will be displayed here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-xl">🇮🇳</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Made in India
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Suridhi customizes all its products in facilities located within
                India. Some of our raw materials, intermediate components, and
                consumables used in the manufacturing of the final product could
                be from one or more countries. As we follow Global Sourcing, one
                product is likely to have a different country of origin
                depending on the batch sold.
              </p>
              <p className="text-sm text-gray-600 mt-3 font-medium">
                Country of origin: India
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
