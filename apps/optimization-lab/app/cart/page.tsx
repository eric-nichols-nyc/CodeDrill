"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, Loader2, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

// Mock cart API
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// CSR - Client-Side Rendering
// This page is rendered on the client with SWR for real-time updates
const CartPage = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/cart", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  const removeFromCart = async (productId: string) => {
    // Optimistic update
    const optimisticData = {
      ...data,
      items: data.items.filter((item: { id: string }) => item.id !== productId),
      total:
        data.total -
          data.items.find((item: { id: string }) => item.id === productId)
            ?.price || 0,
    };

    mutate(optimisticData, false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Revalidate
    mutate();
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-8 py-12">
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading cart...</span>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-8 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Error loading cart</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const { items, total, itemCount } = data;

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
            <ShoppingCart className="h-8 w-8 text-primary" />
            <div>
              <h1 className="font-bold text-4xl">Shopping Cart</h1>
              <p className="mt-1 text-muted-foreground">
                CSR - Interactive cart with SWR for real-time updates
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-12">
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-lg">Your cart is empty</h3>
              <p className="mb-4 text-muted-foreground">
                Start shopping to add items to your cart
              </p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({itemCount})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map(
                      (item: {
                        id: string;
                        name: string;
                        image: string;
                        price: number;
                        quantity: number;
                      }) => (
                        <div
                          className="flex items-center gap-4 rounded-lg border p-4"
                          key={item.id}
                        >
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              alt={item.name}
                              className="object-cover"
                              fill
                              sizes="80px"
                              src={item.image}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-muted-foreground text-sm">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <Button
                              className="mt-2"
                              onClick={() => removeFromCart(item.id)}
                              size="sm"
                              variant="ghost"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">
                      ${(total * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-2xl">
                        ${(total * 1.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                  <p className="text-muted-foreground text-xs">
                    Cart updates in real-time using SWR. Try opening this page
                    in multiple tabs to see synchronization.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
