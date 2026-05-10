# With Solid App

A Next.js application demonstrating SOLID principles and best practices.

## Getting Started

### Environment Variables

The app is configured to load environment variables from the root `.env` or `.env.local` file in the monorepo root directory. You can also create a `.env.local` file in the `apps/with-solid` directory.

Add your Gemini API key to one of these locations:

**Option 1: Root `.env` file (recommended for monorepo)**
```bash
# In /Users/ericnichols/Documents/monorepo-apps/my-next-forge-repo/.env
GEMINI_API_KEY=your_api_key_here
```

**Option 2: App-specific `.env.local` file**
```bash
# In apps/with-solid/.env.local
GEMINI_API_KEY=your_api_key_here
```

The app supports both `GEMINI_API_KEY` and `GOOGLE_GENERATIVE_AI_API_KEY` variable names.

You can get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### Running the App

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3016](http://localhost:3016) with your browser to see the result.

### Chatbot

The app includes a floating chatbot (bottom-right corner) powered by Google Gemini AI. You can ask questions about SOLID principles and the code examples. The chatbot will use context from the current page to provide relevant answers.

## Scripts

- `dev` - Start the development server on port 3016
- `build` - Build the application for production
- `start` - Start the production server
- `clean` - Clean build artifacts and dependencies
- `typecheck` - Run TypeScript type checking

## About SOLID Principles

SOLID is an acronym for five object-oriented design principles:

- **S**ingle Responsibility Principle
- **O**pen/Closed Principle
- **L**iskov Substitution Principle
- **I**nterface Segregation Principle
- **D**ependency Inversion Principle

These principles help create maintainable, scalable, and robust software architectures.

