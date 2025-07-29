"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  addProduct,
  uploadImage,
  getCategories,
} from "@/lib/firebase-services";
import { Category } from "@/types";
import { Upload, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

// Type for product data without id, createdAt, and updatedAt
type ProductInputData = {
  name: string;
  price: number;
  image: string;
  images: string[];
  categoryId: string;
  categoryName: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
  isPopular: boolean;
  isTrending: boolean;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  discount?: number;
  overview?: {
    materialOptions: string[];
    designGuidelines: string[];
    qualityFeatures: string[];
  };
  specs?: {
    templates: { name: string; url: string; type: string }[];
    specifications: string[];
  };
  sizeChart?: {
    sizes: { size: string; chest: string; length: string }[];
    instructions: string;
  };
  faq?: { question: string; answer: string }[];
};

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    sizes: [] as string[],
    colors: [] as { name: string; hex: string }[],
    inStock: true,
    isNew: false,
    isSale: false,
    discount: "",
    rating: "4.5",
    reviews: "0",
    // Home page display options
    isPopular: false,
    isTrending: false,
    // Additional fields from mock data
    images: [] as string[],
    categoryName: "",
    // Product detail page content
    overview: {
      materialOptions: [] as string[],
      designGuidelines: [] as string[],
      qualityFeatures: [] as string[],
    },
    specs: {
      templates: [] as { name: string; url: string; type: string }[],
      specifications: [] as string[],
    },
    sizeChart: {
      sizes: [] as { size: string; chest: string; length: string }[],
      instructions: "",
    },
    faq: [] as { question: string; answer: string }[],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000" });
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()],
      }));
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }));
  };

  const addColor = () => {
    if (
      newColor.name.trim() &&
      !formData.colors.some((c) => c.name === newColor.name.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        colors: [
          ...prev.colors,
          { name: newColor.name.trim(), hex: newColor.hex },
        ],
      }));
      setNewColor({ name: "", hex: "#000000" });
    }
  };

  const removeColor = (colorName: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c.name !== colorName),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Upload images
      const imageUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const path = `products/${Date.now()}_${i}_${images[i].name}`;
        const url = await uploadImage(images[i], path);
        imageUrls.push(url);
      }

      const selectedCategory = categories.find(
        (cat) => cat.id === formData.categoryId
      );

      // Prepare product data, filtering out undefined values
      const productData: ProductInputData = {
        name: formData.name,
        price: parseFloat(formData.price),
        image: imageUrls[0] || "",
        images: imageUrls,
        categoryId: formData.categoryId,
        categoryName: selectedCategory?.name || "",
        description: formData.description,
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        inStock: formData.inStock,
        isNew: formData.isNew,
        isSale: formData.isSale,
        isPopular: formData.isPopular,
        isTrending: formData.isTrending,
      };

      // Only add optional fields if they have values
      if (formData.sizes.length > 0) {
        productData.sizes = formData.sizes;
      }

      if (formData.colors.length > 0) {
        productData.colors = formData.colors;
      }

      if (
        formData.isSale &&
        formData.discount &&
        formData.discount.trim() !== ""
      ) {
        productData.discount = parseFloat(formData.discount);
      }

      await addProduct(productData);

      router.push("/admin/products");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create product";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/products"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600">Create a new product listing</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price (₹) *
                </label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rating
                </label>
                <input
                  type="number"
                  id="rating"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="4.5"
                />
              </div>

              <div>
                <label
                  htmlFor="reviews"
                  className="block text-sm font-medium text-gray-700"
                >
                  Number of Reviews
                </label>
                <input
                  type="number"
                  id="reviews"
                  min="0"
                  value={formData.reviews}
                  onChange={(e) =>
                    setFormData({ ...formData, reviews: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700"
              >
                Category *
              </label>
              <select
                id="categoryId"
                required
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                placeholder="Enter product description"
              />
            </div>

            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Images *
              </label>
              <div className="mt-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      width={128}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {imagePreviews.length < 4 && (
                  <div className="flex justify-center items-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                    <label className="cursor-pointer text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="block text-sm text-gray-600">
                        Add Image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.sizes.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Add size (e.g., S, M, L)"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Colors
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.colors.map((color) => (
                  <span
                    key={color.name}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: color.hex,
                      color: color.hex === "#FFFFFF" ? "#000" : "#fff",
                    }}
                  >
                    {color.name}
                    <button
                      type="button"
                      onClick={() => removeColor(color.name)}
                      className="ml-2 hover:opacity-75"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newColor.name}
                  onChange={(e) =>
                    setNewColor({ ...newColor, name: e.target.value })
                  }
                  placeholder="Color name"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
                <input
                  type="color"
                  value={newColor.hex}
                  onChange={(e) =>
                    setNewColor({ ...newColor, hex: e.target.value })
                  }
                  className="w-12 h-10 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Product Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={formData.inStock}
                    onChange={(e) =>
                      setFormData({ ...formData, inStock: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="inStock"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    In Stock
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={formData.isNew}
                    onChange={(e) =>
                      setFormData({ ...formData, isNew: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isNew"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    New Product
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isSale"
                    checked={formData.isSale}
                    onChange={(e) =>
                      setFormData({ ...formData, isSale: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isSale"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    On Sale
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={formData.isPopular}
                    onChange={(e) =>
                      setFormData({ ...formData, isPopular: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isPopular"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Most Popular Product
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isTrending"
                    checked={formData.isTrending}
                    onChange={(e) =>
                      setFormData({ ...formData, isTrending: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isTrending"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Trending Product
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                {formData.isSale && (
                  <div>
                    <label
                      htmlFor="discount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      id="discount"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({ ...formData, discount: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="0"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Product Detail Page Content */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Product Detail Page Content
              </h3>

              {/* Overview Section */}
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Overview Section
                  </h4>

                  {/* Material Options */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material Options
                    </label>
                    <textarea
                      rows={3}
                      value={formData.overview.materialOptions.join("\n")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          overview: {
                            ...formData.overview,
                            materialOptions: e.target.value
                              .split("\n")
                              .filter((line) => line.trim()),
                          },
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="Enter material options (one per line)&#10;Example:&#10;• Standard Stock: 220 GSM, 50% Cotton-50% Polyester&#10;• Premium Stock: 250 GSM, 60% Cotton-40% Polyester"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter each material option on a new line
                    </p>
                  </div>

                  {/* Design Guidelines */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Design Guidelines
                    </label>
                    <textarea
                      rows={4}
                      value={formData.overview.designGuidelines.join("\n")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          overview: {
                            ...formData.overview,
                            designGuidelines: e.target.value
                              .split("\n")
                              .filter((line) => line.trim()),
                          },
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="Enter design guidelines (one per line)&#10;Example:&#10;• Simple designs look better when embroidered&#10;• Keep font size above 10 points&#10;• Use high-resolution images"
                    />
                  </div>

                  {/* Quality Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quality Features
                    </label>
                    <textarea
                      rows={3}
                      value={formData.overview.qualityFeatures.join("\n")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          overview: {
                            ...formData.overview,
                            qualityFeatures: e.target.value
                              .split("\n")
                              .filter((line) => line.trim()),
                          },
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="Enter quality features (one per line)&#10;Example:&#10;• Even Low Quantities @ Best Prices&#10;• High quality products and Easy design"
                    />
                  </div>
                </div>
              </div>

              {/* Size Chart Section */}
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Size Chart
                  </h4>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size Chart Instructions
                    </label>
                    <input
                      type="text"
                      value={formData.sizeChart.instructions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sizeChart: {
                            ...formData.sizeChart,
                            instructions: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="For best fit, measure your favorite t-shirt and compare with the chart above"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size Chart Data (CSV format: Size,Chest,Length)
                    </label>
                    <textarea
                      rows={6}
                      value={formData.sizeChart.sizes
                        .map((s) => `${s.size},${s.chest},${s.length}`)
                        .join("\n")}
                      onChange={(e) => {
                        const lines = e.target.value
                          .split("\n")
                          .filter((line) => line.trim());
                        const sizes = lines.map((line) => {
                          const [size, chest, length] = line
                            .split(",")
                            .map((s) => s.trim());
                          return {
                            size: size || "",
                            chest: chest || "",
                            length: length || "",
                          };
                        });
                        setFormData({
                          ...formData,
                          sizeChart: {
                            ...formData.sizeChart,
                            sizes,
                          },
                        });
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="S,38,26&#10;M,40,27&#10;L,42,28&#10;XL,44,29"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter size chart data in CSV format: Size,Chest,Length
                      (one per line)
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    FAQ Section
                  </h4>

                  <div className="space-y-4">
                    {formData.faq.map((faq, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            FAQ #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newFaq = formData.faq.filter(
                                (_, i) => i !== index
                              );
                              setFormData({ ...formData, faq: newFaq });
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const newFaq = [...formData.faq];
                            newFaq[index].question = e.target.value;
                            setFormData({ ...formData, faq: newFaq });
                          }}
                          className="mb-2 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                          placeholder="Question"
                        />
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const newFaq = [...formData.faq];
                            newFaq[index].answer = e.target.value;
                            setFormData({ ...formData, faq: newFaq });
                          }}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                          placeholder="Answer"
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          faq: [...formData.faq, { question: "", answer: "" }],
                        });
                      }}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors"
                    >
                      + Add FAQ Item
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/products"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
