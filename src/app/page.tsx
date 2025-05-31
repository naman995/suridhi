import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Sidebar from '@/components/Sidebar';
import { products } from '@/data/products';
import CategoryBrowser from '@/components/CategoryBrowser';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="  w-full">
        <HeroSection />
        <div className='mx-10 py-10'>
          <CategoryBrowser />
        </div>
      </div>
    </main>
  );
}
