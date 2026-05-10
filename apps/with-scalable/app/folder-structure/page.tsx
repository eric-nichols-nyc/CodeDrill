import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";

const folderTree = `my-nextjs-app/
├── public/
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── users/
│   │   │   │   └── route.ts
│   │   │   └── products/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── AuthProvider.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useSession.ts
│   │   │   ├── utils/
│   │   │   │   ├── validation.ts
│   │   │   │   └── tokenHelpers.ts
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts
│   │   │   ├── api/
│   │   │   │   └── authApi.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── user/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   └── products/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── utils/
│   │       ├── types/
│   │       └── index.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── index.ts
│   │   └── providers/
│   │       ├── QueryProvider.tsx
│   │       └── ThemeProvider.tsx
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── endpoints.ts
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   ├── constants/
│   │   │   ├── routes.ts
│   │   │   └── config.ts
│   │   └── db/
│   │       ├── prisma.ts
│   │       └── queries.ts
│   │
│   ├── hooks/
│   │   ├── useMediaQuery.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── global.d.ts
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   │
│   └── styles/
│       └── theme.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── .env.local
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
└── package.json`;

const routeStructure = `app/api/
├── auth/
│   ├── login/
│   │   └── route.ts
│   ├── register/
│   │   └── route.ts
│   └── logout/
│       └── route.ts
│
├── users/
│   ├── route.ts              # GET /api/users (list)
│   ├── [id]/
│   │   ├── route.ts          # GET/PUT/DELETE /api/users/:id
│   │   └── posts/
│   │       └── route.ts      # GET /api/users/:id/posts
│
└── products/
    ├── route.ts
    └── [id]/
        └── route.ts`;

const testingStructure = `features/
└── products/
    ├── components/
    │   ├── ProductCard.tsx
    │   ├── ProductCard.test.tsx
    │   ├── ProductList.tsx
    │   └── ProductList.test.tsx
    ├── hooks/
    │   ├── useProducts.ts
    │   └── useProducts.test.ts
    ├── utils/
    │   ├── productHelpers.ts
    │   └── productHelpers.test.ts
    └── api/
        ├── productApi.ts
        └── productApi.test.ts`;

const componentTestCode = `import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    imageUrl: '/test-image.jpg',
  };

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('calls onAddToCart when button is clicked', () => {
    const onAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    
    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);
    
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});`;

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="w-full min-w-0 overflow-x-auto rounded-lg border bg-muted/50 p-4 font-mono text-sm">
      <code>{children}</code>
    </pre>
  );
}

const FolderStructurePage = () => (
  <main className="min-h-screen w-[800px] bg-background p-8">
    <div className="mx-auto w-full min-w-full max-w-6xl shrink-0">
      <div className="mb-8">
        <h1 className="font-bold text-4xl">Folder Structure</h1>
        <p className="mt-2 text-muted-foreground">
          Organize your app for scale and maintainability
        </p>
      </div>

      <Tabs className="w-full" defaultValue="app-structure">
        <TabsList className="mb-4 grid w-full grid-cols-4">
          <TabsTrigger value="app-structure">App structure</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="component-test">Component test</TabsTrigger>
        </TabsList>

        <TabsContent className="min-h-112 w-full" value="app-structure">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Next.js app structure</CardTitle>
              <CardDescription>
                Feature-based layout with route groups, shared components, and
                lib utilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock>{folderTree}</CodeBlock>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="min-h-112 w-full" value="routes">
          <Card>
            <CardHeader>
              <CardTitle>Route structure</CardTitle>
              <CardDescription>
                App Router API routes with auth, users, and products and dynamic
                segments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock>{routeStructure}</CodeBlock>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="min-h-112 w-full" value="testing">
          <Card>
            <CardHeader>
              <CardTitle>Testing</CardTitle>
              <CardDescription>
                Co-located tests next to components, hooks, utils, and API
                modules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock>{testingStructure}</CodeBlock>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="min-h-112 w-full" value="component-test">
          <Card>
            <CardHeader>
              <CardTitle>Component test</CardTitle>
              <CardDescription>
                Example ProductCard test with React Testing Library: render,
                query, and user interaction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock>{componentTestCode}</CodeBlock>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </main>
);

export default FolderStructurePage;
