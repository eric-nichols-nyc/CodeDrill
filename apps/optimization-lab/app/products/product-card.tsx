"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Product } from "@/app/lib/mock-data";

type ProductCardProps = {
  product: Product;
};

const DELAY_MS = 0;

function busyWait(ms: number) {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    // Block main thread to simulate slow render
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDelayed = useRef(false);

  // Simulate slow component: block the main thread for 5s on first render.
  // Only run once per card so we don't block on every re-render.
  if (!hasDelayed.current) {
    busyWait(DELAY_MS);
    hasDelayed.current = true;
  }

  return (
    <Link href={`/products/${product.id}`}>
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
            <div>
              <p className="font-bold text-2xl">${product.price}</p>
              {product.originalPrice ? (
                <p className="text-muted-foreground text-sm line-through">
                  ${product.originalPrice}
                </p>
              ) : null}
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">
                ⭐ {product.rating} ({product.reviewCount})
              </p>
              <p className="text-muted-foreground text-xs">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
