"use client";

const HeroSection = () => {
  return (
    <div className="relative bg-gray-900 h-[600px]">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="/banner.png"
          alt="Hero banner"
        />
      </div>
      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        {/* Removed text and button content */}
      </div>
    </div>
  );
};

export default HeroSection;
