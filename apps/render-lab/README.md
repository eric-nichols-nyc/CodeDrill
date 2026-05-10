# Render Lab

A Next.js application showcasing different rendering strategies:

- **CSR** (Client-Side Rendering)
- **SSR** (Server-Side Rendering)
- **SSG** (Static Site Generation)
- **ISR** (Incremental Static Regeneration)
- **PPR** (Partial Pre-Rendering) - Experimental

Each page demonstrates a different rendering approach with real-time timestamps and explanations.

## Getting Started

```bash
pnpm dev
```

Open [http://localhost:3012](http://localhost:3012) to see the demo.

## Rendering Strategies

### Client-Side Rendering (CSR)
Content is rendered in the browser after JavaScript loads. Best for highly interactive applications.

### Server-Side Rendering (SSR)
Content is rendered on the server for each request. Best for dynamic, personalized content.

### Static Site Generation (SSG)
Content is pre-rendered at build time. Best for content that doesn't change frequently.

### Incremental Static Regeneration (ISR)
Pre-rendered pages are regenerated in the background when content becomes stale. Best for content that changes occasionally.

### Partial Pre-Rendering (PPR)
Selectively pre-render parts of a page while leaving other parts dynamic. Best for pages with mixed static and dynamic content.

