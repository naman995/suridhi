"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";

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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWinterwearOpen, setIsWinterwearOpen] = useState(false);
  const [isStationeryOpen, setIsStationeryOpen] = useState(false);
  const [isCorporateGiftsOpen, setIsCorporateGiftsOpen] = useState(false);
  const [isTshirtsOpen, setIsTshirtsOpen] = useState(false);
  const [isSublimationOpen, setIsSublimationOpen] = useState(false);
  const [isEmbroideryOpen, setIsEmbroideryOpen] = useState(false);
  const { state } = useCart();

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
              href="/checkout"
              className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <ShoppingCart className="h-6 w-6" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setIsWinterwearOpen(true)}
              onMouseLeave={() => setIsWinterwearOpen(false)}
            >
              <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200 flex items-center">
                Winterwear <ChevronRight open={isWinterwearOpen} />
              </button>
              {isWinterwearOpen && (
                <div className="absolute left-0  w-48 rounded-md shadow-lg bg-white  z-50">
                  <div className="py-1">
                    <Link
                      href="/category/winterwear/sheetshirts"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sheetshirts
                    </Link>
                    <Link
                      href="/category/winterwear/jackets"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Jackets
                    </Link>
                    <Link
                      href="/category/winterwear/hoodies"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Hoodies
                    </Link>
                    <Link
                      href="/category/winterwear/sweaters"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sweaters
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div
              className="relative"
              onMouseEnter={() => setIsTshirtsOpen(true)}
              onMouseLeave={() => {
                setIsTshirtsOpen(false);
                setIsSublimationOpen(false);
                setIsEmbroideryOpen(false);
              }}
            >
              <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200 flex items-center">
                Custom T-shirts <ChevronRight open={isTshirtsOpen} />
              </button>
              {isTshirtsOpen && (
                <div className="absolute left-0 w-56 rounded-md shadow-lg bg-white z-50 flex">
                  <div className="py-1 w-full">
                    <div
                      className="relative group"
                      onMouseEnter={() => setIsSublimationOpen(true)}
                      onMouseLeave={() => setIsSublimationOpen(false)}
                    >
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        Sublimation <ChevronRight open={isSublimationOpen} />
                      </button>
                      {isSublimationOpen && (
                        <div className="absolute left-full top-0 w-40 rounded-md shadow-lg bg-white z-50">
                          <Link
                            href="/category/custom-t-shirts/sublimation/round-neck"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Round Neck
                          </Link>
                          <Link
                            href="/category/custom-t-shirts/sublimation/polo-neck"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Polo Neck
                          </Link>
                        </div>
                      )}
                    </div>
                    <div
                      className="relative group"
                      onMouseEnter={() => setIsEmbroideryOpen(true)}
                      onMouseLeave={() => setIsEmbroideryOpen(false)}
                    >
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        Embroidery <ChevronRight open={isEmbroideryOpen} />
                      </button>
                      {isEmbroideryOpen && (
                        <div className="absolute left-full top-0 w-40 rounded-md shadow-lg bg-white z-50">
                          <Link
                            href="/category/custom-t-shirts/embroidery/round-neck"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Round Neck
                          </Link>
                          <Link
                            href="/category/custom-t-shirts/embroidery/polo-neck"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Polo Neck
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/category/custom-stamps-ink"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200"
            >
              Custom Stamps & Ink
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setIsCorporateGiftsOpen(true)}
              onMouseLeave={() => setIsCorporateGiftsOpen(false)}
            >
              <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200 flex items-center">
                Corporate Gifts <ChevronRight open={isCorporateGiftsOpen} />
              </button>
              {isCorporateGiftsOpen && (
                <div className="absolute left-0 w-64 rounded-md shadow-lg bg-white z-50">
                  <div className="py-1">
                    <Link
                      href="/category/corporate-gifts/bottles"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Bottles
                    </Link>
                    <Link
                      href="/category/corporate-gifts/tumblers"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Tumblers
                    </Link>
                    <Link
                      href="/category/corporate-gifts/cup"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cup
                    </Link>
                    <Link
                      href="/category/corporate-gifts/gift"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Gift
                    </Link>
                    <Link
                      href="/category/corporate-gifts/ceramic-cups"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Ceramic Cups
                    </Link>
                    <Link
                      href="/category/corporate-gifts/phone-stand"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Phone Stand
                    </Link>
                    <Link
                      href="/category/corporate-gifts/card-holder"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Card Holder
                    </Link>
                    <Link
                      href="/category/corporate-gifts/pen"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Pen
                    </Link>
                    <Link
                      href="/category/corporate-gifts/diaries"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Diaries
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div
              className="relative"
              onMouseEnter={() => setIsStationeryOpen(true)}
              onMouseLeave={() => setIsStationeryOpen(false)}
            >
              <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200 flex items-center">
                Custom Stationery <ChevronRight open={isStationeryOpen} />
              </button>
              {isStationeryOpen && (
                <div className="absolute left-0 w-48 rounded-md shadow-lg bg-white z-50">
                  <div className="py-1">
                    <Link
                      href="/category/custom-stationery/table-calendar"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Table Calendar
                    </Link>
                    <Link
                      href="/category/custom-stationery/wall-calendar"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Wall Calendar
                    </Link>
                    <Link
                      href="/category/custom-stationery/catalogs"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Catalogs
                    </Link>
                    <Link
                      href="/category/custom-stationery/notepad"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Notepad
                    </Link>
                    <Link
                      href="/category/custom-stationery/visiting-cards"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Visiting Cards
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/category/custom-drinkware"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200"
            >
              Custom Drinkware
            </Link>
            <Link
              href="/category/custom-bags"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200"
            >
              Custom Bags
            </Link>
            <Link
              href="/category/cap"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center px-3 py-1 rounded-full transition-colors duration-200"
            >
              Cap
            </Link>
          </div>

          {/* Cart and Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              href="/checkout"
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
            <div className="space-y-1">
              <div className="px-3 py-2 text-gray-600 flex items-center">
                Winterwear <ChevronRight open={true} />
              </div>
              <div className="pl-6 space-y-1">
                <Link
                  href="/category/winterwear/sheetshirts"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Sheetshirts
                </Link>
                <Link
                  href="/category/winterwear/jackets"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Jackets
                </Link>
                <Link
                  href="/category/winterwear/hoodies"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Hoodies
                </Link>
                <Link
                  href="/category/winterwear/sweaters"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Sweaters
                </Link>
              </div>
            </div>
            <div className="space-y-1">
              <div className="px-3 py-2 text-gray-600 flex items-center">
                Custom T-shirts <ChevronRight open={true} />
              </div>
              <div className="pl-6 space-y-1">
                <div className="text-gray-600">Sublimation</div>
                <div className="pl-4 space-y-1">
                  <Link
                    href="/category/custom-t-shirts/sublimation/round-neck"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                  >
                    Round Neck
                  </Link>
                  <Link
                    href="/category/custom-t-shirts/sublimation/polo-neck"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                  >
                    Polo Neck
                  </Link>
                </div>
                <div className="text-gray-600">Embroidery</div>
                <div className="pl-4 space-y-1">
                  <Link
                    href="/category/custom-t-shirts/embroidery/round-neck"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                  >
                    Round Neck
                  </Link>
                  <Link
                    href="/category/custom-t-shirts/embroidery/polo-neck"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                  >
                    Polo Neck
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/category/custom-stamps-ink"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
            >
              Custom Stamps & Ink
            </Link>
            <div className="space-y-1">
              <div className="px-3 py-2 text-gray-600 flex items-center">
                Corporate Gifts <ChevronRight open={true} />
              </div>
              <div className="pl-6 space-y-1">
                <Link
                  href="/category/corporate-gifts/bottles"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Bottles
                </Link>
                <Link
                  href="/category/corporate-gifts/tumblers"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Tumblers
                </Link>
                <Link
                  href="/category/corporate-gifts/cup"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Cup
                </Link>
                <Link
                  href="/category/corporate-gifts/gift"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Gift
                </Link>
                <Link
                  href="/category/corporate-gifts/ceramic-cups"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Ceramic Cups
                </Link>
                <Link
                  href="/category/corporate-gifts/phone-stand"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Phone Stand
                </Link>
                <Link
                  href="/category/corporate-gifts/card-holder"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Card Holder
                </Link>
                <Link
                  href="/category/corporate-gifts/pen"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Pen
                </Link>
                <Link
                  href="/category/corporate-gifts/diaries"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Diaries
                </Link>
              </div>
            </div>
            <div className="space-y-1">
              <div className="px-3 py-2 text-gray-600 flex items-center">
                Custom Stationery <ChevronRight open={true} />
              </div>
              <div className="pl-6 space-y-1">
                <Link
                  href="/category/custom-stationery/table-calendar"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Table Calendar
                </Link>
                <Link
                  href="/category/custom-stationery/wall-calendar"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Wall Calendar
                </Link>
                <Link
                  href="/category/custom-stationery/catalogs"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Catalogs
                </Link>
                <Link
                  href="/category/custom-stationery/notepad"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Notepad
                </Link>
                <Link
                  href="/category/custom-stationery/visiting-cards"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
                >
                  Visiting Cards
                </Link>
              </div>
            </div>
            <Link
              href="/category/custom-drinkware"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
            >
              Custom Drinkware
            </Link>
            <Link
              href="/category/custom-bags"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
            >
              Custom Bags
            </Link>
            <Link
              href="/category/cap"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-center rounded-full transition-colors duration-200"
            >
              Cap
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
