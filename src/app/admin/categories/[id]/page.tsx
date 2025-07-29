"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getCategory, deleteCategory } from "@/lib/firebase-services";
import { Category } from "@/types";

export default function ViewCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const categoryData = await getCategory(categoryId);
      if (!categoryData) {
        setError("Category not found");
        return;
      }
      setCategory(categoryData);
    } catch (error) {
      console.error("Error fetching category:", error);
      setError("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setDeleting(true);
    try {
      await deleteCategory(categoryId);
      router.push("/admin/categories");
    } catch (error: any) {
      setError(error.message || "Failed to delete category");
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

  if (error && error === "Category not found") {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Category Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The category you're looking for doesn't exist.
            </p>
            <Link
              href="/admin/categories"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Categories
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!category) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link
              href="/admin/categories"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Categories
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
              href="/admin/categories"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/admin/categories/${categoryId}/edit`}
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
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-gray-600">Category Details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Information */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Category Information
            </h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="text-sm text-gray-900">{category.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Description
                </dt>
                <dd className="text-sm text-gray-900">
                  {category.description || "No description provided"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Product Count
                </dt>
                <dd className="text-sm text-gray-900">{category.count}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">
                  {category.createdAt.toLocaleDateString()} at{" "}
                  {category.createdAt.toLocaleTimeString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Updated
                </dt>
                <dd className="text-sm text-gray-900">
                  {category.updatedAt.toLocaleDateString()} at{" "}
                  {category.updatedAt.toLocaleTimeString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Hero Content Preview */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Hero Content Preview
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This is how the category will appear on the category page:
            </p>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {category.description ||
                      "Explore our amazing collection of products in this category."}
                  </p>
                </div>
                <div className="flex justify-center lg:justify-end">
                  {category.image ? (
                    <div className="relative w-full max-w-xs h-32">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-xs h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">
                        No image available
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category URL */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Category URL
          </h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={`${window.location.origin}/category/${categoryId}`}
              readOnly
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-900 text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/category/${categoryId}`
                );
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Copy
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Share this URL to direct customers to this category page.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
