# Testing Lab

Interactive demos for testing React applications with **Vitest** and **Playwright**.

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

Open [http://localhost:3009](http://localhost:3009)

## Running Tests

### Unit & Integration Tests (Vitest)

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Vitest UI
pnpm test:ui

# Coverage report
pnpm test:coverage
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
pnpm test:e2e

# Playwright UI mode
pnpm test:e2e:ui

# Run with visible browser
pnpm test:e2e:headed
```

## Project Structure

```
testing-lab/
├── app/                    # Next.js pages
│   ├── hooks/             # Custom hooks demo
│   ├── components/        # Component testing demo
│   ├── api-mocking/       # MSW demo
│   ├── async/             # Async testing patterns
│   └── e2e/               # Playwright info
├── hooks/                 # Custom hooks + tests
│   ├── use-counter.ts
│   ├── use-counter.test.ts
│   ├── use-toggle.ts
│   ├── use-toggle.test.ts
│   ├── use-fetch.ts
│   ├── use-fetch.test.ts
│   ├── use-local-storage.ts
│   └── use-local-storage.test.ts
├── mocks/                 # MSW handlers
│   ├── handlers.ts
│   └── server.ts
├── e2e/                   # Playwright tests
│   ├── navigation.spec.ts
│   ├── counter.spec.ts
│   └── toggle.spec.ts
├── vitest.config.ts       # Vitest configuration
├── vitest.setup.ts        # Test setup (MSW, cleanup)
└── playwright.config.ts   # Playwright configuration
```

## What's Covered

### Custom Hooks Testing

- `useCounter` - Bounded counter with min/max
- `useToggle` - Boolean toggle with helpers
- `useFetch` - Data fetching with loading/error states
- `useLocalStorage` - Persist state to localStorage

### MSW (Mock Service Worker)

- Mock API endpoints
- Override handlers for specific tests
- Simulate errors and delays

### Component Testing

- Render and query elements
- User interactions with `userEvent`
- Form validation testing

### Async Testing

- `waitFor` for conditions
- `findBy` async queries
- Loading state testing
- Fake timers for debounce/throttle

### E2E with Playwright

- Navigation tests
- User interaction flows
- Cross-browser testing
- Visual regression (optional)

## Technologies

- **Vitest** - Fast unit test runner
- **Testing Library** - Component testing utilities
- **MSW** - API mocking at network level
- **Playwright** - Cross-browser E2E testing
