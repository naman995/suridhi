export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  categoryId: string;
  categoryName: string;
  description: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;
  // Home page display options
  isPopular?: boolean;
  isTrending?: boolean;
  // Product detail page content
  overview?: {
    materialOptions?: string[];
    designGuidelines?: string[];
    qualityFeatures?: string[];
  };
  specs?: {
    templates?: { name: string; url: string; type: string }[];
    specifications?: string[];
  };
  sizeChart?: {
    sizes: { size: string; chest: string; length: string }[];
    instructions?: string;
  };
  faq?: { question: string; answer: string }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "super_admin";
  createdAt: Date;
}
