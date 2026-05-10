# TypeScript Examples App

An interactive learning application demonstrating TypeScript concepts from basic to advanced.

## Features

- **Sidebar Navigation** - Easy navigation between different TypeScript concepts
- **Interactive Examples** - Hands-on examples for each concept
- **Code Examples** - Copy-paste ready code snippets
- **Progressive Learning** - Organized from basic to advanced topics

## Topics Covered

### Basic
- **Basic Types** - Primitives, arrays, objects, functions

### Intermediate
- **Unions** - Type alternatives with the `|` operator
- **Intersections** - Combining types with the `&` operator
- **Generics** - Reusable type-safe components
- **Tuples** - Fixed-length arrays with specific types

### Advanced
- **Utility Types** - Built-in type transformations (Partial, Pick, Omit, etc.)
- **Conditional Types** - Type-level conditionals and inference
- **Mapped Types** - Transforming properties of existing types
- **Template Literal Types** - String pattern matching at the type level

## Running the App

```bash
# Install dependencies (from monorepo root)
pnpm install

# Run the development server
pnpm --filter with-typescript dev

# The app will be available at http://localhost:3017
```

## Structure

```
apps/with-typescript/
├── app/
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Home page
│   ├── basic-types/        # Basic types page
│   ├── unions/             # Union types page
│   ├── intersections/      # Intersection types page
│   ├── generics/           # Generics page
│   ├── tuples/             # Tuples page
│   ├── utility-types/      # Utility types page
│   ├── conditional-types/  # Conditional types page
│   ├── mapped-types/       # Mapped types page
│   └── template-literals/  # Template literal types page
├── components/
│   ├── sidenav.tsx         # Sidebar navigation
│   ├── header.tsx          # Page header
│   ├── code-block.tsx      # Code display component
│   └── examples/           # Interactive example components
└── package.json
```

## Technologies

- **Next.js 16** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Styling
- **Design System** - Shared UI components from `@repo/design-system`

