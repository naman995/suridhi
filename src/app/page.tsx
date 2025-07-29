"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import DynamicNavbar from "@/components/DynamicNavbar";
import { fetchCategories } from "@/data/products";
import {
  getPopularProducts,
  getTrendingProducts,
} from "@/lib/firebase-services";
import CategoryBrowser from "@/components/CategoryBrowser";
import { Product, Category } from "@/types";

export default function Home() {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, popularData, trendingData] = await Promise.all([
          fetchCategories(),
          getPopularProducts(),
          getTrendingProducts(),
        ]);

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
        <DynamicNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <DynamicNavbar />
      <div className="w-full">
        <HeroSection />
        <div className="mx-10 py-10">
          <CategoryBrowser
            categories={categories}
            popularProducts={popularProducts}
            trendingProducts={trendingProducts}
          />
        </div>
      </div>
    </main>
  );
}
