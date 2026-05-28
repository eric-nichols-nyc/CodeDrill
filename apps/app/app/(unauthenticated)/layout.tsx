import Link from "next/link";

export default function UnauthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border border-b">
        <div className="container mx-auto flex items-center px-4 py-3 md:px-6">
          <Link
            className="font-medium text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline"
            href="/"
          >
            Home
          </Link>
        </div>
      </header>
      <main className="container mx-auto flex grow flex-col items-center justify-center p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
