'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/category/t-shirts" className="text-gray-600 hover:text-gray-900">
              T-Shirts
            </Link>
            <Link href="/category/pens" className="text-gray-600 hover:text-gray-900">
              Pens
            </Link>
            <Link href="/category/mugs" className="text-gray-600 hover:text-gray-900">
              Mugs
            </Link>
            <Link href="/category/bags" className="text-gray-600 hover:text-gray-900">
              Bags
            </Link>
            <Link href="/category/bottles" className="text-gray-600 hover:text-gray-900">
              Bottles
            </Link>
            <Link href="/category/mouse-pads" className="text-gray-600 hover:text-gray-900">
              Mouse Pads
            </Link>
            <Link href="/category/caps" className="text-gray-600 hover:text-gray-900">
              Caps
            </Link>
            <Link href="/category/diwali-gifts" className="text-gray-600 hover:text-gray-900">
              Diwali Gifts
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-gray-900">
              Cart
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
            <Link href="/" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/category/t-shirts" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
              T-Shirts
            </Link>
            <Link href="/category/pens" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
              Pens
            </Link>
            <Link href="/category/mugs" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
              Mugs
            </Link>
            <Link href="/category/bags" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
              Bags
            </Link>
            <Link href="/category/bottles" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
              Bottles
            </Link>
            <Link href="/category/mouse-pads" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
              Mouse Pads
            </Link>
            <Link href="/category/caps" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
              Caps
            </Link>
            <Link href="/category/diwali-gifts" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
              Diwali Gifts
            </Link>
            <Link href="/cart" className="block px-3 py-2 text-gray-600 hover:text-gray-900">
              Cart
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 