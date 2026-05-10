export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  categorySlug: string;
  inStock: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
};

// Mock product data
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    description:
      "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
    ],
    category: "Electronics",
    categorySlug: "electronics",
    inStock: true,
    stock: 45,
    rating: 4.5,
    reviewCount: 128,
    tags: ["wireless", "audio", "premium"],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    name: "Smart Watch Series 9",
    description:
      "Advanced fitness tracking, heart rate monitoring, and smartphone connectivity.",
    price: 349.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800",
    ],
    category: "Electronics",
    categorySlug: "electronics",
    inStock: true,
    stock: 23,
    rating: 4.7,
    reviewCount: 256,
    tags: ["wearable", "fitness", "smart"],
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-22T09:15:00Z",
  },
  {
    id: "3",
    name: "Leather Backpack",
    description:
      "Handcrafted leather backpack with multiple compartments and laptop sleeve.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
    ],
    category: "Accessories",
    categorySlug: "accessories",
    inStock: true,
    stock: 67,
    rating: 4.3,
    reviewCount: 89,
    tags: ["leather", "travel", "laptop"],
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-18T11:20:00Z",
  },
  {
    id: "4",
    name: "Running Shoes Ultra",
    description:
      "Lightweight running shoes with advanced cushioning and breathable mesh.",
    price: 119.99,
    originalPrice: 149.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800",
    ],
    category: "Clothing",
    categorySlug: "clothing",
    inStock: true,
    stock: 34,
    rating: 4.6,
    reviewCount: 203,
    tags: ["sports", "running", "comfortable"],
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-21T16:45:00Z",
  },
  {
    id: "5",
    name: "Coffee Maker Deluxe",
    description:
      "Programmable coffee maker with thermal carafe and 12-cup capacity.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800",
    images: [
      "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800",
    ],
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    inStock: true,
    stock: 56,
    rating: 4.4,
    reviewCount: 167,
    tags: ["kitchen", "appliance", "coffee"],
    createdAt: "2024-01-08T10:00:00Z",
    updatedAt: "2024-01-19T13:10:00Z",
  },
  {
    id: "6",
    name: "Yoga Mat Premium",
    description:
      "Eco-friendly yoga mat with superior grip and cushioning for all practice levels.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    ],
    category: "Sports",
    categorySlug: "sports",
    inStock: true,
    stock: 78,
    rating: 4.8,
    reviewCount: 312,
    tags: ["fitness", "yoga", "eco-friendly"],
    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
];

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Latest electronics and gadgets",
    productCount: 2,
  },
  {
    id: "2",
    name: "Clothing",
    slug: "clothing",
    description: "Fashion and apparel",
    productCount: 1,
  },
  {
    id: "3",
    name: "Accessories",
    slug: "accessories",
    description: "Bags, wallets, and accessories",
    productCount: 1,
  },
  {
    id: "4",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Home essentials and kitchen appliances",
    productCount: 1,
  },
  {
    id: "5",
    name: "Sports",
    slug: "sports",
    description: "Sports and fitness equipment",
    productCount: 1,
  },
];

// Helper functions
export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return mockProducts.filter((p) => p.categorySlug === categorySlug);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getAllCategories(): Category[] {
  return mockCategories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return mockCategories.find((c) => c.slug === slug);
}
