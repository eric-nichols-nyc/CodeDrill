import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory } from "@/app/lib/mock-data";

// SSG - Generate all category pages at build time
export async function generateStaticParams() {
  const categories = [
    { slug: "electronics" },
    { slug: "clothing" },
    { slug: "accessories" },
    { slug: "home-kitchen" },
    { slug: "sports" },
  ];
  return categories;
}

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(slug);

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b bg-muted/50">
        <div className="mx-auto max-w-7xl px-8 py-8">
          <Link href="/categories">
            <Button className="mb-4" variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-4xl">{category.name}</h1>
            <p className="mt-2 text-muted-foreground">{category.description}</p>
            <p className="mt-1 text-muted-foreground text-sm">
              SSG - This page was pre-rendered at build time
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-12">
        <div className="mb-6">
          <p className="text-muted-foreground text-sm">
            {products.length} products in this category
          </p>
        </div>

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
                  <CardTitle className="line-clamp-2">{product.name}</CardTitle>
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
      </div>
    </main>
  );
};

export default CategoryPage;
