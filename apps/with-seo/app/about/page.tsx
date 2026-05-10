import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amazing Recipes - Recipes.com",
  description: "Find the best recipes in the world on this website.",
  keywords: ["recipes", "food", "best recipes"],
  openGraph: {
    title: "Best Recipes in the World",
    description: "Find the best recipes in the world on this website.",
    siteName: "Recipes.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image", // or "summary"
    title: "Next.js SEO Crash Course",
    description: "Master metadata, robots, sitemaps, and more.",
    creator: "@pedrotech",
    images: ["https://example.com/seo.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://Recipes.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-bold text-4xl">About Us</h1>
      <div className="prose max-w-none">
        <p className="mb-4 text-lg">
          Welcome to our sample application! This is a perfect example of a
          static route that you can enhance with metadata for SEO purposes.
        </p>
        <p className="mb-4">
          This page demonstrates how Next.js handles static routes and how you
          can later add metadata like title, description, and Open Graph tags to
          improve search engine optimization.
        </p>
        <h2 className="mb-3 font-semibold text-2xl">Our Mission</h2>
        <p className="mb-4">
          We're here to help you learn about metadata and SEO in Next.js
          applications. This sample app provides various route types that you
          can enhance with proper metadata configuration.
        </p>
        <h2 className="mb-3 font-semibold text-2xl">What You'll Learn</h2>
        <ul className="mb-4 list-disc pl-6">
          <li>Static route metadata</li>
          <li>Dynamic route metadata</li>
          <li>Open Graph tags</li>
          <li>Twitter Card metadata</li>
          <li>Structured data</li>
        </ul>
      </div>
    </div>
  );
}
