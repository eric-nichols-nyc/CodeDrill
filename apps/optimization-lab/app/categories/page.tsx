import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { getAllCategories } from "@/app/lib/mock-data";

// SSG - Static Site Generation (no revalidate = fully static)
// This page is generated at build time
const CategoriesPage = async () => {
  const categories = getAllCategories();

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
            <ShoppingBag className="h-8 w-8 text-primary" />
            <div>
              <h1 className="font-bold text-4xl">Categories</h1>
              <p className="mt-1 text-muted-foreground">
                Browse by category (SSG - pre-rendered at build time)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link href={`/categories/${category.slug}`} key={category.id}>
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      {category.productCount} products
                    </span>
                    <Button variant="outline">View Category</Button>
                  </div>
                  <p className="mt-4 text-muted-foreground text-xs">
                    This category page is statically generated at build time for
                    maximum performance.
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CategoriesPage;
