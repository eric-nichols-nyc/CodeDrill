import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowLeft, Image as ImageIcon, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ImageOptimizationPage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl">
      <Link href="/">
        <Button className="mb-4" variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Image Optimization</CardTitle>
          <CardDescription>
            Next.js Image component provides automatic image optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <h3 className="mb-2 font-semibold">Features:</h3>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>
                <strong>Automatic format optimization:</strong> Serves WebP/AVIF
                when supported
              </li>
              <li>
                <strong>Responsive images:</strong> Automatically serves
                correctly sized images
              </li>
              <li>
                <strong>Lazy loading:</strong> Images load only when they enter
                the viewport
              </li>
              <li>
                <strong>Blur placeholder:</strong> Show blur-up effect while
                loading
              </li>
              <li>
                <strong>Prevents layout shift:</strong> Maintains aspect ratio
                during load
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-3 font-semibold">Example:</h3>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  alt="Optimized image example"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQADAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  className="object-cover"
                  fill
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
                />
              </div>
              <p className="mt-2 text-muted-foreground text-xs">
                This image is automatically optimized with WebP/AVIF formats and
                responsive sizing.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Implementation:</h3>
              </div>
              <div className="rounded bg-muted p-3">
                <pre className="overflow-x-auto text-xs">
                  {`import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  placeholder="blur"
  blurDataURL="..."
/>`}
                </pre>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-500/10 p-4 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <p className="font-semibold text-blue-600 dark:text-blue-400">
                Benefits:
              </p>
            </div>
            <ul className="mt-2 list-inside list-disc space-y-1 text-blue-700 dark:text-blue-300">
              <li>Reduced bandwidth usage (smaller file sizes)</li>
              <li>Faster page loads (lazy loading)</li>
              <li>Better Core Web Vitals scores</li>
              <li>Improved SEO (proper image sizing)</li>
              <li>Better user experience (no layout shift)</li>
            </ul>
          </div>

          <div className="rounded-lg bg-yellow-500/10 p-4 text-sm">
            <p className="font-semibold text-yellow-600 dark:text-yellow-400">
              Best Practices:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-yellow-700 dark:text-yellow-300">
              <li>Always specify width and height (or use fill)</li>
              <li>Use appropriate sizes attribute for responsive images</li>
              <li>Provide meaningful alt text for accessibility</li>
              <li>Use blur placeholder for better perceived performance</li>
              <li>Consider using priority for above-the-fold images</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
);

export default ImageOptimizationPage;
