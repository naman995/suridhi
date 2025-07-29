"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { Category } from "@/types";

interface CategoryBrowserProps {
  categories?: Category[];
}

const defaultCategories = [
  { name: "Visiting Cards", id: "visiting-cards", image: "/visitingCard.webp" },
  {
    name: "Custom Polo T-shirts",
    id: "custom-polo-tshirts",
    image: "/custom_polo_tshirts.webp",
    href: "/custom-clothing-caps-bags/custom-polo-tshirts",
  },
  {
    name: "Umbrellas & Rainwear",
    id: "umbrellas-rainwear",
    image: "/umbrella_and_rainwear.webp",
  },
  {
    name: "Custom T-shirts",
    id: "custom-t-shirts",
    image: "/custom_tshirt.webp",
  },
  {
    name: "Custom Stamps & Ink",
    id: "custom-stamps-ink",
    image: "/custom_stamps.webp",
  },
  { name: "Photo Gifts", id: "photo-gifts", image: "/photo-gifts.webp" },
  {
    name: "Labels, Stickers & Packaging",
    id: "labels-stickers-packaging",
    image: "/label-sticker-packing.webp",
  },
  {
    name: "Custom Stationery",
    id: "custom-stationery",
    image: "/custom_statonary.webp",
  },
  {
    name: "Signs, Posters & Marketing Materials",
    id: "signs-posters-marketing-materials",
    image: "/sign-poster.webp",
  },
  {
    name: "Custom Drinkware",
    id: "custom-drinkware",
    image: "/custom-drinkware.webp",
  },
  { name: "Custom Bags", id: "custom-bags", image: "/custom-bag.webp" },
];

const popularProducts = [
  {
    name: "Men's Polo T-Shirts",
    price: "BUY 1 @ Rs.550",
    image: "/custom_polo_tshirts.webp",
  },
  {
    name: "Standard Visiting Cards",
    price: "BUY 100 @ Rs.200",
    image: "/visitingCard.webp",
  },
  {
    name: "Single Fold Umbrellas",
    price: "BUY 1 @ Rs.850",
    image: "/umbrella_and_rainwear.webp",
  }, // Using available umbrella image
  {
    name: "Men's T-Shirts",
    price: "BUY 1 @ Rs.420",
    image: "/custom_tshirt.webp",
  },
  { name: "Letterheads", price: "BUY 10 @ Rs.230", image: "" }, // No direct image found
  {
    name: "Self Inking Stamps",
    price: "BUY 1 @ Rs.290",
    image: "/custom_stamps.webp",
  },
];

const trendingProducts = [
  {
    name: "Share Design On WhatsApp",
    price: "Starting from Rs 400",
    image: "",
  }, // No direct image found
  { name: "Employee Gift Hampers", price: "", image: "/custom-gifts.webp" },
  {
    name: "Two-Fold Umbrellas",
    price: "BUY 1 @ Rs.700",
    image: "/umbrella_and_rainwear.webp",
  }, // Using available umbrella image
  {
    name: "Raincoats",
    price: "BUY 1 @ Rs.750",
    image: "/umbrella_and_rainwear.webp",
  }, // Using available umbrella image
  {
    name: "Rounded Corner Visiting Cards",
    price: "BUY 100 @ Rs.250",
    image: "/visitingCard.webp",
  }, // Using available visiting card image
  {
    name: "Premium Polo T-Shirts",
    price: "BUY 1 @ Rs.750",
    image: "/custom_polo_tshirts.webp",
  }, // Using available polo t-shirt image
];

const CategoryBrowser = ({ categories }: CategoryBrowserProps) => {
  // Use Firebase categories if available, otherwise fall back to default categories
  const displayCategories =
    categories && categories.length > 0
      ? categories.map((cat) => ({
          name: cat.name,
          id: cat.id,
          image: cat.image || "/custom_tshirt.webp", // fallback image
          href: `/category/${cat.id}`,
        }))
      : defaultCategories;

  // Create refs for the carousel divs
  const popularProductsRef = useRef<HTMLDivElement>(null);
  const trendingProductsRef = useRef<HTMLDivElement>(null);

  // Function to scroll carousels horizontally
  const scrollCarousel = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
  ) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -312 : 312; // Adjusted scroll amount to match card width + space (approx.)
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full py-8 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Explore all categories
      </h2>
      <div className="flex space-x-8 overflow-x-auto py-4 scrollbar-hide px-4">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={category.href || `/category/${category.id}`}
            className="flex-shrink-0 flex flex-col items-center w-32"
          >
            <div className="w-28 h-28 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center shadow-xl">
              {/* Replace with actual category images */}
              {category.image && (
                <Image
                  src={category.image}
                  alt={category.name}
                  width={112}
                  height={112}
                  objectFit="cover"
                  className="rounded-full"
                />
              )}
            </div>
            <p className="mt-3 text-sm font-medium text-gray-700 text-center leading-tight">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
      {/* Navigation arrows (Optional, can be implemented later) - Keeping commented out as per image structure */}
      {/*
            <button className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md cursor-pointer z-10 hidden md:block">
                 SVG for left arrow
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md cursor-pointer z-10 hidden md:block">
                 SVG for right arrow
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
            */}

      {/* Our Most Popular Products Section */}
      <div className="mt-12 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Our Most Popular Products
        </h2>
        <div
          id="popular-products-carousel"
          className="relative flex space-x-6 overflow-x-auto py-4 scrollbar-hide px-4 snap-x snap-mandatory group"
          ref={popularProductsRef}
        >
          {popularProducts.map((product, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 snap-start"
            >
              <div className="relative w-full h-72 flex items-center justify-center bg-gray-100 rounded-t-lg">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={288}
                    height={192}
                    objectFit="cover"
                  />
                ) : (
                  <span className="text-gray-500 text-center px-4">
                    Image Unavailable
                  </span>
                )}
                {product.price && (
                  <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {product.price}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 text-center leading-tight">
                  {product.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Navigation arrows for Popular Products - Moved outside carousel div and adjusted positioning */}
        <button
          className="absolute top-1/2 -translate-y-1/2 left-6 bg-white rounded-full p-2 shadow-md cursor-pointer z-10 md:block"
          onClick={() => scrollCarousel(popularProductsRef, "left")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          className="absolute top-1/2 -translate-y-1/2 right-6 bg-white rounded-full p-2 shadow-md cursor-pointer z-10 md:block"
          onClick={() => scrollCarousel(popularProductsRef, "right")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Trending Products Section */}
      <div className="mt-12 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Trending Products
        </h2>
        <div
          id="trending-products-carousel"
          className="relative flex space-x-6 overflow-x-auto py-4 scrollbar-hide px-4 snap-x snap-mandatory group"
          ref={trendingProductsRef}
        >
          {trendingProducts.map((product, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 snap-start"
            >
              <div className="relative w-full h-72 flex items-center justify-center bg-gray-100 rounded-t-lg">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={288}
                    height={256}
                    objectFit="cover"
                  />
                ) : (
                  <span className="text-gray-500 text-center px-4">
                    Image Unavailable
                  </span>
                )}
                {product.price && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {product.price}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 text-center leading-tight">
                  {product.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Navigation arrows for Trending Products - Moved outside carousel div and adjusted positioning */}
        <button
          className="absolute top-1/2 -translate-y-1/2 left-6 bg-white rounded-full p-2 shadow-md cursor-pointer z-10 md:block"
          onClick={() => scrollCarousel(trendingProductsRef, "left")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          className="absolute top-1/2 -translate-y-1/2 right-6 bg-white rounded-full p-2 shadow-md cursor-pointer z-10 md:block"
          onClick={() => scrollCarousel(trendingProductsRef, "right")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CategoryBrowser;
