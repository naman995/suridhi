import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Sidebar from '@/components/Sidebar';
import { products } from '@/data/products';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="  w-full">
        <HeroSection />
        <div className='mx-10 py-10'>

          <div className="mt-8 flex gap-8">
            <Sidebar />
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
