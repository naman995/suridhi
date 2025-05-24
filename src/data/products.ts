export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  sizes?: string[];
  colors?: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;
}

export const categories = [
  { id: 'clothing', name: 'Clothing', count: 12 },
  { id: 'electronics', name: 'Electronics', count: 8 },
  { id: 'footwear', name: 'Footwear', count: 6 },
  { id: 'accessories', name: 'Accessories', count: 4 },
  { id: 'home', name: 'Home & Living', count: 10 },
  { id: 'beauty', name: 'Beauty & Personal Care', count: 7 },
  { id: 'sports', name: 'Sports & Outdoors', count: 5 },
  { id: 'books', name: 'Books & Stationery', count: 9 },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
    category: 'Clothing',
    description: 'A comfortable and stylish white t-shirt made from 100% organic cotton. Perfect for everyday wear with a modern fit and excellent durability.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Navy'],
    rating: 4.5,
    reviews: 128,
    inStock: true,
    isNew: true
  },
  {
    id: '2',
    name: 'Wireless Noise-Cancelling Headphones',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Electronics',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and professionals.',
    colors: ['Black', 'Silver'],
    rating: 4.8,
    reviews: 256,
    inStock: true,
    isNew: true
  },
  {
    id: '3',
    name: 'Professional Running Shoes',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Footwear',
    description: 'High-performance running shoes with advanced cushioning technology, breathable mesh upper, and durable rubber outsole. Ideal for both casual runners and athletes.',
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Red', 'Blue', 'Black'],
    rating: 4.6,
    reviews: 189,
    inStock: true,
    isSale: true,
    discount: 20
  },
  {
    id: '4',
    name: 'Smart Watch Series 5',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80',
    category: 'Electronics',
    description: 'Advanced smartwatch with health monitoring, GPS tracking, and seamless smartphone integration. Features a bright always-on display and water resistance.',
    colors: ['Black', 'Silver', 'Gold'],
    rating: 4.7,
    reviews: 312,
    inStock: true
  },
  {
    id: '5',
    name: 'Designer Leather Wallet',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    category: 'Accessories',
    description: 'Handcrafted genuine leather wallet with multiple card slots and RFID protection. Features a sleek design and premium stitching.',
    colors: ['Brown', 'Black'],
    rating: 4.4,
    reviews: 95,
    inStock: true
  },
  {
    id: '6',
    name: 'Organic Face Serum',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
    category: 'Beauty',
    description: 'Natural face serum with hyaluronic acid and vitamin C. Hydrates skin, reduces fine lines, and brightens complexion.',
    rating: 4.9,
    reviews: 203,
    inStock: true,
    isNew: true
  },
  {
    id: '7',
    name: 'Yoga Mat Premium',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Sports',
    description: 'Eco-friendly yoga mat with perfect thickness for comfort and stability. Includes carrying strap and alignment lines.',
    colors: ['Purple', 'Blue', 'Green'],
    rating: 4.5,
    reviews: 167,
    inStock: true,
    isSale: true,
    discount: 15
  },
]; 