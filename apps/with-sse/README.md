# With SSE App

A Next.js application demonstrating Server-Sent Events (SSE) for real-time server-to-client communication.

## Getting Started

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3015](http://localhost:3015) with your browser to see the result.

## Scripts

- `dev` - Start the development server on port 3015
- `build` - Build the application for production
- `start` - Start the production server
- `clean` - Clean build artifacts and dependencies
- `typecheck` - Run TypeScript type checking

## About Server-Sent Events

Server-Sent Events (SSE) is a web standard that allows a server to push data to a client over a single HTTP connection. It's ideal for:

- Real-time notifications
- Live updates
- Progress tracking
- Event streaming

Unlike WebSockets, SSE is unidirectional (server to client) and automatically reconnects if the connection is lost.

