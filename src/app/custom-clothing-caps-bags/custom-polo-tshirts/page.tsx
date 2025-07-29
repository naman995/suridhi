"use client";

import Link from "next/link";
import Image from "next/image";


const popularPoloProducts = [
  {
    name: "Men&apos;s Polo T-Shirts",
    price: "Starting at ₹ 550.00",
    image: "/custom_polo_tshirts.webp",
    colors: 4,
  },
  {
    name: "Women&apos;s Polo T-Shirts",
    price: "Starting at ₹ 550.00",
    image: "/custom_polo_tshirts.webp",
    colors: 4,
  },
  {
    name: "Premium Polo T-Shirts",
    price: "1 Starting at ₹ 750.00",
    image: "/custom_polo_tshirts.webp",
    colors: null,
  },
  {
    name: "Men&apos;s Scott Polo T-Shirts",
    price: "1 Starting at ₹ 820.00",
    image: "/custom_polo_tshirts.webp",
    colors: null,
  },
  // Add more placeholder data as needed from your products
];

const CustomPoloTshirtsPage = () => {
  return (
    <div className=" mx-auto px-4   py-8 bg-gray-50">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        {" > "}
        <Link href="/custom-clothing-caps-bags" className="hover:text-gray-900">
          Custom Clothing, Caps & Bags
        </Link>
        {" > "}
        <span className="text-gray-900">Custom Polo T-shirts</span>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Loved by our customers
            </h3>
            <ul>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Men&apos;s Polo T-Shirts
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Women&apos;s Polo T-Shirts
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Premium Polo T-Shirts
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Men&apos;s Scott Polo T-Shirts
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Women&apos;s Scott Polo T-Shirts
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Polyester Polo T-Shirts
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Puma® Polo T-shirts
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Adidas® Polo T-shirts
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Parx® Premium Polo T-Shirts
                </Link>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Explore More Polo T-Shirts
            </h3>
            <ul>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  US POLO ASSN.® Polo T-Shirts
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Adidas® Climalite Dryfit Polo T-shirts
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Arrow® Tipping Polo T-Shirts
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Pikmee Tipline Zipper Polo T-Shirt
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Pikmee Highline Polo T shirts
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Flying Machine® Dry Fit Polo T-Shirts
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Arrow® Mercerized Polo T-Shirts
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Pikmee Tipline Double tipped Polo T-shirts - Men
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  AWG Sport Giza Polos - Men
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Legends Men&apos;s Polo T Shirt
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Pikmee Tipline Double tipped Polo T-shirts - Men (Back & Left)
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Monte Carlo® Polo T-Shirt
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Pikmee Promo Tees Polo T-Shirts
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          {/* Banner */}
          <div className="relative bg-white rounded-lg p-8 mb-8 flex flex-col lg:flex-row items-center shadow-md">
            <div className="lg:w-2/3 mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold mb-4 text-gray-900">
                Custom Polo T-shirts
              </h1>
              <p className="text-gray-600">
                Promote your business with personalized polos - choose sizes and
                styles for a cohesive look.
              </p>
            </div>
            <div className="lg:w-1/3 flex justify-center">
              <Image
                src="/images/custom-polo-banner.png"
                alt="Custom Polo T-shirts Banner"
                width={300}
                height={200}
                className="rounded-md"
              />
            </div>
          </div>

          {/* Loved by our customers Products */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Loved by our customers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {popularPoloProducts.map((product, index) => (
                <Link key={index} href={`/product/${index + 1}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200">
                    <div className="relative w-full h-48">
                      <Image
                        src={product.image}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                      />
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600">₹{product.price}</p>
                      {product.colors && (
                        <p className="text-gray-600 mt-2">
                          {product.colors} colors available
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPoloTshirtsPage;
