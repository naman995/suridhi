'use client';
import { useState } from 'react';
import Link from 'next/link';

const categories = [
  { id: 't-shirts', name: 'T-Shirts', count: 12 },
  { id: 'pens', name: 'Pens', count: 8 },
  { id: 'mugs', name: 'Mugs', count: 6 },
  { id: 'bags', name: 'Bags', count: 4 },
  { id: 'bottles', name: 'Bottles', count: 10 },
  { id: 'mouse-pads', name: 'Mouse Pads', count: 7 },
  { id: 'caps', name: 'Caps', count: 9 },
  { id: 'diwali-gifts', name: 'Diwali Gifts', count: 15 },
];

const priceRanges = [
  { id: 'under-50', name: 'Under $50', count: 8 },
  { id: '50-100', name: '$50 - $100', count: 12 },
  { id: '100-200', name: '$100 - $200', count: 6 },
  { id: 'over-200', name: 'Over $200', count: 4 },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`bg-gray-50 border-r border-gray-200 h-full ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out shadow-sm`}>
      {isOpen && (
        <>
          {/* Categories Section */}
          <div className="px-4 py-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <span>{category.name}</span>
                  <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">({category.count})</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Price Range Section */}
          <div className="px-4 py-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <div
                  key={range.id}
                  className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <span>{range.name}</span>
                  <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">({range.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="px-4 py-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700 hover:text-gray-900 transition-colors">
                  <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-500" />
                  <span>In Stock</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700 hover:text-gray-900 transition-colors">
                  <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-500" />
                  <span>On Sale</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700 hover:text-gray-900 transition-colors">
                  <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-500" />
                  <span>Free Shipping</span>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar; 