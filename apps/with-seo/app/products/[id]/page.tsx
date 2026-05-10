import type { Metadata } from "next";

type ProductPageProps = {
  params: {
    id: string;
  };
};

// Sample product data
const products = {
  "laptop-pro": {
    name: 'Laptop Pro 15"',
    price: 1299,
    description:
      "High-performance laptop perfect for developers and content creators.",
    features: [
      "15-inch Retina display",
      "16GB RAM",
      "512GB SSD",
      "Intel Core i7 processor",
      "12-hour battery life",
    ],
    category: "Electronics",
    brand: "TechCorp",
    inStock: true,
    rating: 4.8,
    reviews: 1247,
  },
  "wireless-headphones": {
    name: "Wireless Noise-Canceling Headphones",
    price: 299,
    description: "Premium wireless headphones with active noise cancellation.",
    features: [
      "Active noise cancellation",
      "30-hour battery life",
      "Quick charge (5 min = 3 hours)",
      "Premium sound quality",
      "Comfortable over-ear design",
    ],
    category: "Audio",
    brand: "SoundMax",
    inStock: true,
    rating: 4.6,
    reviews: 892,
  },
  "smart-watch": {
    name: "Smart Watch Series 5",
    price: 399,
    description:
      "Advanced smartwatch with health monitoring and fitness tracking.",
    features: [
      "Heart rate monitoring",
      "GPS tracking",
      "Water resistant",
      "7-day battery life",
      "App ecosystem",
    ],
    category: "Wearables",
    brand: "FitTech",
    inStock: false,
    rating: 4.4,
    reviews: 567,
  },
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = products[params.id as keyof typeof products];

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
      alternates: {
        canonical: `https://recipes.com/products/${params.id}`,
      },
    };
  }

  return {
    title: `${product.name} - ${product.brand} | MetadataWebsite`,
    description: `${product.description} Price: $${product.price}. ${
      product.inStock ? "In Stock" : "Out of Stock"
    }. Rating: ${product.rating}/5 stars.`,
    keywords: [product.category, product.brand, product.name.toLowerCase()],
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products[params.id as keyof typeof products];

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 font-bold text-4xl">Product Not Found</h1>
        <p>The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Metadata Course Store",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
      bestRating: 5,
      worstRating: 1,
    },
    additionalProperty: product.features.map((feature) => ({
      "@type": "PropertyValue",
      name: "Feature",
      value: feature,
    })),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />

      <nav className="mb-6">
        <a
          className="text-blue-600 hover:text-blue-800 hover:underline"
          href="/products"
        >
          ← Back to Products
        </a>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h1 className="mb-4 font-bold text-4xl">{product.name}</h1>
          <div className="mb-6">
            <span className="font-bold text-3xl text-green-600">
              ${product.price}
            </span>
            <span
              className={`ml-4 rounded-full px-3 py-1 text-sm ${
                product.inStock
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 font-semibold">{product.rating}</span>
              <span className="ml-2 text-gray-600">
                ({product.reviews} reviews)
              </span>
            </div>
            <p className="text-gray-600">Brand: {product.brand}</p>
            <p className="text-gray-600">Category: {product.category}</p>
          </div>

          <p className="mb-6 text-lg">{product.description}</p>

          <button
            className={`rounded-lg px-6 py-3 font-semibold ${
              product.inStock
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            }`}
            disabled={!product.inStock}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>

        <div>
          <h2 className="mb-4 font-semibold text-2xl">Features</h2>
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <li className="flex items-center" key={index}>
                <span className="mr-2 text-green-500">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 rounded-lg bg-purple-50 p-6">
        <h2 className="mb-4 font-semibold text-2xl">Teaching Notes</h2>
        <p className="mb-2">
          This dynamic product page is perfect for demonstrating:
        </p>
        <ul className="list-disc pl-6">
          <li>E-commerce metadata optimization</li>
          <li>Product structured data (Schema.org)</li>
          <li>Dynamic pricing and availability</li>
          <li>Product-specific Open Graph tags</li>
          <li>Rich snippets for search results</li>
          <li>Product review metadata</li>
        </ul>
      </div>
    </div>
  );
}
