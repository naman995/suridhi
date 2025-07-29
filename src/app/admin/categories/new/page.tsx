"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  addCategory,
  uploadImage,
  getParentCategories,
} from "@/lib/firebase-services";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Category } from "@/types";

function NewCategoryForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    showInNavbar: false,
    parentId: "",
    // Additional fields from mock data
    count: 0,
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const categories = await getParentCategories();
        setParentCategories(categories);
      } catch (error) {
        console.error("Error fetching parent categories:", error);
      }
    };

    fetchParentCategories();

    // Set parentId from URL if provided
    const parentId = searchParams.get("parentId");
    if (parentId) {
      setFormData((prev) => ({ ...prev, parentId }));
    }
  }, [searchParams]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = "";
      if (formData.image) {
        const path = `categories/${Date.now()}_${formData.image.name}`;
        imageUrl = await uploadImage(formData.image, path);
      }

      // Prepare category data, filtering out empty parentId
      const categoryData: Omit<Category, "id" | "createdAt" | "updatedAt"> = {
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        showInNavbar: formData.showInNavbar,
        count: formData.count,
        parentId: undefined,
      };

      // Only add parentId if it's not empty
      if (formData.parentId && formData.parentId.trim() !== "") {
        categoryData.parentId = formData.parentId;
      }

      await addCategory(categoryData);

      router.push("/admin/categories");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create category";
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
            href="/admin/categories"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
          <p className="text-gray-600">Create a new product category</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Category Name *
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
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                placeholder="Enter category description"
              />
            </div>

            <div>
              <label
                htmlFor="parentId"
                className="block text-sm font-medium text-gray-700"
              >
                Parent Category
              </label>
              <select
                id="parentId"
                value={formData.parentId}
                onChange={(e) =>
                  setFormData({ ...formData, parentId: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              >
                <option value="">Select a parent category (optional)</option>
                {parentCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to create a main category, or select a parent to
                create a subcategory.
              </p>
            </div>

            <div>
              <label
                htmlFor="count"
                className="block text-sm font-medium text-gray-700"
              >
                Product Count
              </label>
              <input
                type="number"
                id="count"
                min="0"
                value={formData.count}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    count: parseInt(e.target.value) || 0,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                placeholder="Number of products in this category"
              />
            </div>

            <div className="flex items-center">
              <input
                id="showInNavbar"
                type="checkbox"
                checked={formData.showInNavbar}
                onChange={(e) =>
                  setFormData({ ...formData, showInNavbar: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="showInNavbar"
                className="ml-2 block text-sm text-gray-900"
              >
                Show in Navigation Bar
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Check this box to display this category in the main navigation
              bar.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, image: null });
                          setImagePreview("");
                        }}
                        className="text-sm text-red-600 hover:text-red-500"
                      >
                        Remove image
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/categories"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function NewCategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewCategoryForm />
    </Suspense>
  );
}
