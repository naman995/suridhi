"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import { getNavbarCategories } from "@/lib/firebase-services";
import { Category } from "@/types";

const ChevronRight = ({ open }: { open: boolean }) => (
  <svg
    className={`ml-2 h-4 w-4 inline transition-transform duration-200 ${
      open ? "rotate-90" : ""
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const DynamicNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean;
  }>({});
  const { state } = useCart();

  useEffect(() => {
    fetchNavbarCategories();
  }, []);

  const fetchNavbarCategories = async () => {
    try {
      const navbarCategories = await getNavbarCategories();
      setCategories(navbarCategories);
    } catch (error) {
      console.error("Error fetching navbar categories:", error);
      // Set empty array as fallback
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (categoryId: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleMouseEnter = (categoryId: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [categoryId]: true,
    }));
  };

  const handleMouseLeave = (categoryId: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [categoryId]: false,
    }));
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-lg z-50 relative">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Image
                  src="/Logo.png"
                  alt="Suridhi Logo"
                  width={140}
                  height={60}
                  className="h-16 w-auto"
                  priority
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-6 w-28 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg z-50 relative">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/Logo.png"
                alt="Suridhi Logo"
                width={140}
                height={60}
                className="h-16 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <ShoppingCart className="h-6 w-6" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>

            {categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={() => handleMouseLeave(category.id)}
              >
                {category.subcategories && category.subcategories.length > 0 ? (
                  <>
                    <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200 flex items-center">
                      {category.name}{" "}
                      <ChevronRight open={openDropdowns[category.id]} />
                    </button>
                    {openDropdowns[category.id] && (
                      <div className="absolute left-0 w-48 rounded-md shadow-lg bg-white z-50">
                        <div className="py-1">
                          {category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.id}
                              href={`/subcategory/${category.id}/${subcategory.id}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={`/category/${category.id}`}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Cart and Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              href="/cart"
              className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <ShoppingCart className="h-6 w-6" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {categories.map((category) => (
              <div key={category.id} className="space-y-1">
                {category.subcategories && category.subcategories.length > 0 ? (
                  <>
                    <div
                      className="px-3 py-2 text-gray-600 flex items-center cursor-pointer"
                      onClick={() => toggleDropdown(category.id)}
                    >
                      {category.name}{" "}
                      <ChevronRight open={openDropdowns[category.id]} />
                    </div>
                    {openDropdowns[category.id] && (
                      <div className="pl-6 space-y-1">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/subcategory/${category.id}/${subcategory.id}`}
                            className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={`/category/${category.id}`}
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default DynamicNavbar;
