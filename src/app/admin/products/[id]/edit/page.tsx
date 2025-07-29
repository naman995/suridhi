"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import SizeChartEditor from "@/components/SizeChartEditor";
import {
  getProduct,
  updateProduct,
  getCategories,
  getSubcategories,
  uploadImage,
} from "@/lib/firebase-services";
import { Category } from "@/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    subcategoryId: "",
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
      sizes: [] as { [key: string]: string }[],
      instructions: "",
      columns: ["Size", "Chest", "Length"],
    },
    faq: [] as { question: string; answer: string }[],
    // Quantity tiers
    quantityTiers: [] as {
      minQuantity: number;
      maxQuantity: number;
      pricePerUnit: number;
    }[],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000" });
  const [newQuantityTier, setNewQuantityTier] = useState({
    minQuantity: "",
    maxQuantity: "",
    pricePerUnit: "",
  });

  useEffect(() => {
    fetchProductAndCategories();
  }, [productId]);

  const fetchProductAndCategories = async () => {
    try {
      const [product, categoriesData] = await Promise.all([
        getProduct(productId),
        getCategories(),
      ]);

      if (!product) {
        setError("Product not found");
        return;
      }

      setCategories(categoriesData);

      // Fetch subcategories if the product has a category
      if (product.categoryId) {
        try {
          const subcats = await getSubcategories(product.categoryId);
          setSubcategories(subcats);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          setSubcategories([]);
        }
      }
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        categoryId: product.categoryId,
        subcategoryId: product.subcategoryId || "",
        sizes: product.sizes || [],
        colors: product.colors || [],
        inStock: product.inStock,
        isNew: product.isNew || false,
        isSale: product.isSale || false,
        discount: product.discount ? product.discount.toString() : "",
        rating: product.rating.toString(),
        reviews: product.reviews.toString(),
        isPopular: product.isPopular || false,
        isTrending: product.isTrending || false,
        images: product.images || [],
        categoryName: product.categoryName,
        overview: {
          materialOptions: product.overview?.materialOptions || [],
          designGuidelines: product.overview?.designGuidelines || [],
          qualityFeatures: product.overview?.qualityFeatures || [],
        },
        specs: product.specs || {
          templates: [],
          specifications: [],
        },
        sizeChart: product.sizeChart || {
          sizes: [],
          instructions: "",
          columns: ["Size", "Chest", "Length"],
        },
        faq: product.faq || [],
        quantityTiers: product.quantityTiers || [],
      });
      setExistingImages(product.images || []);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    setFormData((prev) => ({ ...prev, categoryId, subcategoryId: "" }));
    if (categoryId) {
      try {
        const subcats = await getSubcategories(categoryId);
        setSubcategories(subcats);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
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

  const addQuantityTier = () => {
    if (
      newQuantityTier.minQuantity &&
      newQuantityTier.maxQuantity &&
      newQuantityTier.pricePerUnit
    ) {
      setFormData((prev) => ({
        ...prev,
        quantityTiers: [
          ...(prev.quantityTiers || []),
          {
            minQuantity: parseInt(newQuantityTier.minQuantity),
            maxQuantity: parseInt(newQuantityTier.maxQuantity),
            pricePerUnit: parseFloat(newQuantityTier.pricePerUnit),
          },
        ],
      }));
      setNewQuantityTier({
        minQuantity: "",
        maxQuantity: "",
        pricePerUnit: "",
      });
    }
  };

  const removeQuantityTier = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      quantityTiers: (prev.quantityTiers || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Upload new images
      const newImageUrls: string[] = [];
      for (let i = 0; i < newImages.length; i++) {
        const path = `products/${Date.now()}_${i}_${newImages[i].name}`;
        const url = await uploadImage(newImages[i], path);
        newImageUrls.push(url);
      }

      // Combine existing and new images
      const allImages = [...existingImages, ...newImageUrls];

      const selectedCategory = categories.find(
        (cat) => cat.id === formData.categoryId
      );
      const selectedSubcategory = subcategories.find(
        (subcat) => subcat.id === formData.subcategoryId
      );

      // Prepare product data, filtering out undefined values
      const productData: Partial<Product> = {
        name: formData.name,
        price: parseFloat(formData.price),
        image: allImages[0] || "",
        images: allImages,
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId || undefined,
        categoryName: selectedCategory?.name || "",
        subcategoryName: selectedSubcategory?.name || undefined,
        description: formData.description,
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        inStock: formData.inStock,
        isNew: formData.isNew,
        isSale: formData.isSale,
        isPopular: formData.isPopular,
        isTrending: formData.isTrending,
        // Product detail page content
        overview: formData.overview,
        specs: formData.specs,
        sizeChart: formData.sizeChart,
        faq: formData.faq,
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

      await updateProduct(productId, productData);
      router.push("/admin/products");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update product";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">Update product information</p>
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
                onChange={(e) => handleCategoryChange(e.target.value)}
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

            {/* Subcategory Selection */}
            {subcategories.length > 0 && (
              <div>
                <label
                  htmlFor="subcategoryId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subcategory
                </label>
                <select
                  id="subcategoryId"
                  value={formData.subcategoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, subcategoryId: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="">Select a subcategory (optional)</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mt-2 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Existing Images:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((imageUrl, index) => (
                      <div key={`existing-${index}`} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {newImagePreviews.length > 0 && (
                <div className="mt-2 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    New Images:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newImagePreviews.map((preview, index) => (
                      <div key={`new-${index}`} className="relative">
                        <img
                          src={preview}
                          alt={`New ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Images */}
              {existingImages.length + newImagePreviews.length < 4 && (
                <div className="mt-2">
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
                </div>
              )}
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

            {/* Quantity Tiers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity Pricing Tiers (Bulk Discounts)
              </label>
              <div className="space-y-2 mb-4">
                {formData.quantityTiers &&
                  formData.quantityTiers.map((tier, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">
                        {tier.minQuantity} - {tier.maxQuantity} units: ₹
                        {tier.pricePerUnit.toFixed(2)} per unit
                      </span>
                      <button
                        type="button"
                        onClick={() => removeQuantityTier(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={newQuantityTier.minQuantity}
                  onChange={(e) =>
                    setNewQuantityTier({
                      ...newQuantityTier,
                      minQuantity: e.target.value,
                    })
                  }
                  placeholder="Min Qty"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
                <input
                  type="number"
                  value={newQuantityTier.maxQuantity}
                  onChange={(e) =>
                    setNewQuantityTier({
                      ...newQuantityTier,
                      maxQuantity: e.target.value,
                    })
                  }
                  placeholder="Max Qty"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.01"
                    value={newQuantityTier.pricePerUnit}
                    onChange={(e) =>
                      setNewQuantityTier({
                        ...newQuantityTier,
                        pricePerUnit: e.target.value,
                      })
                    }
                    placeholder="Price/Unit"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={addQuantityTier}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Add quantity tiers for bulk pricing. Leave empty to use base
                price for all quantities.
              </p>
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

              {/* Specs & Templates Section */}
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Specs & Templates Section
                  </h4>

                  {/* Specifications */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specifications
                    </label>
                    <textarea
                      rows={3}
                      value={formData.specs.specifications.join("\n")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: {
                            ...formData.specs,
                            specifications: e.target.value
                              .split("\n")
                              .filter((line) => line.trim()),
                          },
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="Enter specifications (one per line)"
                    />
                  </div>

                  {/* Template Links */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Links
                    </label>
                    <div className="space-y-2">
                      {formData.specs.templates.map((template, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={template.name}
                            onChange={(e) => {
                              const newTemplates = [
                                ...formData.specs.templates,
                              ];
                              newTemplates[index].name = e.target.value;
                              setFormData({
                                ...formData,
                                specs: {
                                  ...formData.specs,
                                  templates: newTemplates,
                                },
                              });
                            }}
                            placeholder="Template name"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                          />
                          <input
                            type="text"
                            value={template.url}
                            onChange={(e) => {
                              const newTemplates = [
                                ...formData.specs.templates,
                              ];
                              newTemplates[index].url = e.target.value;
                              setFormData({
                                ...formData,
                                specs: {
                                  ...formData.specs,
                                  templates: newTemplates,
                                },
                              });
                            }}
                            placeholder="Download URL"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                          />
                          <select
                            value={template.type}
                            onChange={(e) => {
                              const newTemplates = [
                                ...formData.specs.templates,
                              ];
                              newTemplates[index].type = e.target.value;
                              setFormData({
                                ...formData,
                                specs: {
                                  ...formData.specs,
                                  templates: newTemplates,
                                },
                              });
                            }}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                          >
                            <option value="pdf">PDF</option>
                            <option value="png">PNG</option>
                            <option value="jpg">JPG</option>
                            <option value="doc">DOC</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              const newTemplates =
                                formData.specs.templates.filter(
                                  (_, i) => i !== index
                                );
                              setFormData({
                                ...formData,
                                specs: {
                                  ...formData.specs,
                                  templates: newTemplates,
                                },
                              });
                            }}
                            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            specs: {
                              ...formData.specs,
                              templates: [
                                ...formData.specs.templates,
                                { name: "", url: "", type: "pdf" },
                              ],
                            },
                          });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        + Add Template
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Size Chart Section */}
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Size Chart Section
                  </h4>
                  <SizeChartEditor
                    value={formData.sizeChart}
                    onChange={(sizeChartData) =>
                      setFormData({
                        ...formData,
                        sizeChart: sizeChartData,
                      })
                    }
                  />
                </div>
              </div>

              {/* FAQ Section */}
              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    FAQ Section
                  </h4>

                  <div className="space-y-4">
                    {formData.faq.map((item, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-sm font-medium text-gray-900">
                            FAQ Item {index + 1}
                          </h5>
                          <button
                            type="button"
                            onClick={() => {
                              const newFaq = formData.faq.filter(
                                (_, i) => i !== index
                              );
                              setFormData({
                                ...formData,
                                faq: newFaq,
                              });
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={item.question}
                            onChange={(e) => {
                              const newFaq = [...formData.faq];
                              newFaq[index].question = e.target.value;
                              setFormData({
                                ...formData,
                                faq: newFaq,
                              });
                            }}
                            placeholder="Question"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                          />
                          <textarea
                            rows={3}
                            value={item.answer}
                            onChange={(e) => {
                              const newFaq = [...formData.faq];
                              newFaq[index].answer = e.target.value;
                              setFormData({
                                ...formData,
                                faq: newFaq,
                              });
                            }}
                            placeholder="Answer"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                          />
                        </div>
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
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
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
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
