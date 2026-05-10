import { Button } from "@repo/design-system/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/app/lib/mock-data";
import { ProductCard } from "./product-card";
// Note: We fetch from API to demonstrate ISR properly
// The API call will be cached and re-executed during regeneration

// This page uses ISR - Incremental Static Regeneration
// How it works:
// 1. Page is pre-rendered at build time (like SSG)
// 2. After 600 seconds (10 minutes), the page is considered "stale"
// 3. Next request: stale page served immediately, regeneration triggered in background
// 4. Subsequent requests: fresh page is served
export const revalidate = 600; // 10 minutes (600 seconds)

const ProductsPage = async () => {
  // Fetch products from API - this demonstrates ISR properly
  // During regeneration, this fetch will be re-executed to get fresh data
  // Next.js automatically caches this fetch based on the page's revalidate setting

  // For server components, we can use absolute URL or call the API route handler directly
  // Using fetch with relative URL works in Next.js server components
  let products: Product[];

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3020";
    // 10s delay to test profiler (remove after testing)
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    const response = await fetch(`${baseUrl}/api/products`, {
      // This fetch is cached and re-executed during ISR regeneration
      //cache: "force-cache", // Cache the response
      //next: { revalidate: 600 }, // Revalidate every 10 minutes (same as page)
    });

    if (response.ok) {
      const data = await response.json();
      products = data.products || [];
    } else {
      // Fallback to mock data if API fails
      const { mockProducts } = await import("@/app/lib/mock-data");
      products = mockProducts;
    }
  } catch {
    // Fallback to mock data if fetch fails
    const { mockProducts } = await import("@/app/lib/mock-data");
    products = mockProducts;
  }

  // Get current time to show when this page was generated
  const generatedAt = new Date().toISOString();

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b bg-muted/50">
        <div className="mx-auto max-w-7xl px-8 py-8">
          <Link href="/">
            <Button className="mb-4" variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <h1 className="font-bold text-4xl">Products</h1>
              <p className="mt-1 text-muted-foreground">
                Browse our catalog (ISR - regenerates every 10 minutes)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {products.length} products found
          </p>
          <div className="rounded-lg bg-muted px-3 py-1.5 text-xs">
            <p className="text-muted-foreground">
              Generated: {new Date(generatedAt).toLocaleString()}
            </p>
            <p className="text-muted-foreground text-xs">
              (Regenerates every 10 minutes)
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
