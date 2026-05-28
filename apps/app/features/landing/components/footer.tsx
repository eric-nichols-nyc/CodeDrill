import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-border border-t py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Codedrill
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
          <Link className="hover:text-foreground" href="/problems">
            Problems
          </Link>
          <Link className="hover:text-foreground" href="/sign-in">
            Sign in
          </Link>
        </nav>
      </div>
    </footer>
  );
}
