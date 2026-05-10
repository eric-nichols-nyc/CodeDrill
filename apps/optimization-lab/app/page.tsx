import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Package, Search, ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";

const HomePage = () => (
  <main className="min-h-screen bg-background">
    {/* Hero Section */}
    <div className="border-b bg-muted/50">
      <div className="mx-auto max-w-7xl px-8 py-16">
        <div>
          <h1 className="font-bold text-5xl">Optimization Lab</h1>
          <p className="mt-4 text-muted-foreground text-xl">
            E-Commerce Product Catalog
          </p>
          <p className="mt-2 text-muted-foreground">
            A real-world showcase of Next.js optimization strategies
          </p>
        </div>
      </div>
    </div>

    {/* Quick Links */}
    <div className="mx-auto max-w-7xl px-8 py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/products">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Browse our product catalog (ISR)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Shop Now
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/categories">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Browse by category (SSG)</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Categories
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/search">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Search</CardTitle>
              <CardDescription>Search products (SSR)</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Search
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/cart">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Shopping Cart</CardTitle>
              <CardDescription>View your cart (CSR)</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Cart
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Info Card */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>About This E-Commerce Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a complete e-commerce product catalog built to demonstrate
            Next.js optimization strategies. Each page uses different rendering
            methods and optimization techniques:
          </p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-muted-foreground text-sm">
            <li>
              <strong>Product Pages (ISR):</strong> Pre-rendered with background
              regeneration for fresh inventory and pricing
            </li>
            <li>
              <strong>Category Pages (SSG):</strong> Static pages generated at
              build time for maximum performance
            </li>
            <li>
              <strong>Search (SSR):</strong> Server-rendered results for each
              search query
            </li>
            <li>
              <strong>Cart (CSR):</strong> Interactive client-side cart with SWR
              for real-time updates
            </li>
            <li>
              <strong>Product Details (PPR):</strong> Static product info with
              dynamic reviews and pricing
            </li>
          </ul>
          <p className="mt-4 text-muted-foreground text-sm">
            See the README.md for a complete list of all optimizations and
            rendering strategies.
          </p>
        </CardContent>
      </Card>
    </div>
  </main>
);

export default HomePage;
