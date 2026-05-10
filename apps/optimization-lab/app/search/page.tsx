import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { searchProducts } from "@/app/lib/mock-data";

// SSR - Server-Side Rendering (no revalidate, no generateStaticParams)
// This page is rendered on the server for each request
const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const { q } = await searchParams;
  const query = q || "";

  // Search products on the server
  const products = query ? searchProducts(query) : [];

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
            <SearchIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="font-bold text-4xl">Search Products</h1>
              <p className="mt-1 text-muted-foreground">
                SSR - Results rendered on the server for each search
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-12">
        {query ? (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground text-sm">
                Found {products.length} results for &quot;{query}&quot;
              </p>
              <p className="mt-1 text-muted-foreground text-xs">
                Rendered at: {new Date().toISOString()}
              </p>
            </div>

            {products.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No products found matching &quot;{query}&quot;
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Link href={`/products/${product.id}`} key={product.id}>
                    <Card className="h-full transition-all hover:shadow-lg">
                      <div className="relative aspect-square w-full overflow-hidden rounded-t-lg">
                        <Image
                          alt={product.name}
                          className="object-cover"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          src={product.image}
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">
                          {product.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {product.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-2xl">${product.price}</p>
                          {product.originalPrice && (
                            <p className="text-muted-foreground text-sm line-through">
                              ${product.originalPrice}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Search for Products</CardTitle>
              <CardDescription>
                Enter a search query to find products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex gap-2" method="get">
                <input
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  defaultValue={query}
                  name="q"
                  placeholder="Search products..."
                  type="text"
                />
                <Button type="submit">Search</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default SearchPage;
