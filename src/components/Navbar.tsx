'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
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
            <Link href="/category/visiting-cards" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200">
              Visiting Cards
            </Link>
            <Link href="/category/custom-polo-tshirts" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200">
              Custom Polo T-shirts
            </Link>
            <Link href="/category/umbrellas-rainwear" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200">
              Umbrellas & Rainwear
            </Link>
            <Link href="/category/custom-t-shirts" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200">
              Custom T-shirts
            </Link>
            <Link href="/category/custom-stamps-ink" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200">
              Custom Stamps & Ink
            </Link>
            <Link href="/category/photo-gifts" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200">
              Photo Gifts
            </Link>
            {/* <Link href="/category/labels-stickers-packaging" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200">
              Labels, Stickers & Packaging
            </Link> */}
            <Link href="/category/custom-stationery" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200">
              Custom Stationery
            </Link>
            {/* <Link href="/category/signs-posters-marketing-materials" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200">
              Signs, Posters & Marketing Materials
            </Link> */}
            <Link href="/category/custom-drinkware" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200">
              Custom Drinkware
            </Link>
            <Link href="/category/custom-bags" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200">
              Custom Bags
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
            <Link href="/category/visiting-cards" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200">
              Visiting Cards
            </Link>
            <Link href="/category/custom-polo-tshirts" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200">
              Custom Polo T-shirts
            </Link>
            <Link href="/category/umbrellas-rainwear" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200">
              Umbrellas & Rainwear
            </Link>
            <Link href="/category/custom-t-shirts" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200">
              Custom T-shirts
            </Link>
            <Link href="/category/custom-stamps-ink" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200">
              Custom Stamps & Ink
            </Link>
            <Link href="/category/photo-gifts" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200">
              Photo Gifts
            </Link>
            {/* <Link href="/category/labels-stickers-packaging" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200">
              Labels, Stickers & Packaging
            </Link> */}
            <Link href="/category/custom-stationery" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200">
              Custom Stationery
            </Link>
            {/* <Link href="/category/signs-posters-marketing-materials" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200">
              Signs, Posters & Marketing Materials
            </Link> */}
            <Link href="/category/custom-drinkware" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200">
              Custom Drinkware
            </Link>
            <Link href="/category/custom-bags" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200">
              Custom Bags
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 