"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Sidebar from "@/components/Sidebar";
import { fetchProducts, fetchCategories } from "@/data/products";
import {
  getPopularProducts,
  getTrendingProducts,
} from "@/lib/firebase-services";
import CategoryBrowser from "@/components/CategoryBrowser";
import { Product, Category } from "@/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData, popularData, trendingData] =
          await Promise.all([
            fetchProducts(),
            fetchCategories(),
            getPopularProducts(8),
            getTrendingProducts(8),
          ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setPopularProducts(popularData);
        setTrendingProducts(trendingData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full">
        <HeroSection />
        <div className="mx-10 py-10">
          <CategoryBrowser categories={categories} />
        </div>

        {/* Popular Products Section */}
        {popularProducts.length > 0 && (
          <div className="mx-10 py-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Most Popular Products
              </h2>
              <p className="text-gray-600">
                Discover what our customers love the most
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Trending Products Section */}
        {trendingProducts.length > 0 && (
          <div className="mx-10 py-10 bg-white">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trending Products
              </h2>
              <p className="text-gray-600">Stay ahead with the latest trends</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
