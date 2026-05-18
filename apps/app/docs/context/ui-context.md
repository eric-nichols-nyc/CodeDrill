# UI Context

## Design system package

Shared UI lives in **`packages/design-system`** (`@repo/design-system`). The app imports global styles from there and pulls components by path — do not add duplicate primitives under `apps/app/components/ui/`.

```ts
import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
```

Global CSS entry for the app: `apps/app/app/styles.css` → `@import "@repo/design-system/styles/globals.css"`.

## Theme

Light and dark modes are supported via **next-themes** (`class` strategy: `.dark` on an ancestor). Tokens are defined in `packages/design-system/styles/globals.css` for `:root` and `.dark`.

- Default palette: warm **primary** accent on neutral surfaces (shadcn **New York** style, `neutral` base).
- `ModeToggle` from `@repo/design-system/components/mode-toggle` is used on landing and problems headers. Wire `ThemeProvider` from `@repo/design-system/providers/theme` (or `DesignSystemProvider` from `@repo/design-system`) at the root if theme switching should apply app-wide — the commented block in `apps/app/app/layout.tsx` shows the intended pattern.
- **App overrides** in `apps/app/app/styles.css`: dark-mode foreground tokens are brightened for readability; the problem workspace uses scoped `.problem-by-slug-page` vars for the nav bar (`--nav-bg`, `--nav-border`, `--teal-accent`, etc.).

## Colors

Use **semantic CSS variables** exposed as Tailwind utilities — no hardcoded hex in feature code unless scoped to a one-off layout (e.g. problem nav). Values are **oklch** in the design system; light/dark differ automatically.

| Role              | CSS variable              | Tailwind examples                          |
| ----------------- | ------------------------- | ------------------------------------------ |
| Page background   | `--background`            | `bg-background`                            |
| Default text      | `--foreground`            | `text-foreground`                          |
| Card / panel      | `--card`                  | `bg-card`, `text-card-foreground`          |
| Popover           | `--popover`               | `bg-popover`                               |
| Primary accent    | `--primary`               | `bg-primary`, `text-primary`               |
| Secondary surface | `--secondary`             | `bg-secondary`                             |
| Muted text / fill | `--muted`, `--muted-foreground` | `bg-muted`, `text-muted-foreground` |
| Hover / subtle    | `--accent`                | `bg-accent`, `hover:bg-accent`             |
| Border / input    | `--border`, `--input`     | `border-border`, `border-input`            |
| Focus ring        | `--ring`                  | `ring-ring`, `outline-ring/50`             |
| Error             | `--destructive`           | `bg-destructive`, `text-destructive`       |
| Success           | `--success`               | `text-success` (where used)                |
| Sidebar           | `--sidebar-*`             | `bg-sidebar`, `text-sidebar-foreground`, … |
| Charts            | `--chart-1` … `--chart-5` | `text-chart-1`, etc.                       |

Charts, prose (`@utility prose`), and third-party surfaces should reference these tokens so they track theme changes.

## Typography

| Role      | Source | Notes |
| --------- | ------ | ----- |
| UI (sans) | **Geist Sans** | App: `next/font/google` → `--font-geist-sans` on `<body>` in `apps/app/app/layout.tsx`. Package: `GeistSans` in `@repo/design-system/lib/fonts`. |
| Code/mono | **Geist Mono** | App: `--font-geist-mono`. Package: `GeistMono` in `fonts.ts`. |
| Prose     | `@tailwindcss/typography` | Use `prose` / `prose-invert`; colors map to design tokens in `globals.css`. |

Base scale: `apps/app/app/styles.css` sets `html { font-size: 106.25%; }` and `body { line-height: 1.6; }`.

Prefer `font-sans` / `font-mono` (wired to `--font-sans` / `--font-mono` in the design system) or the Geist CSS variables already on the root layout.

## Border radius

Base token: `--radius: 0.5rem`. Tailwind scale from `@theme inline` in `globals.css`:

| Context              | Class / token   |
| -------------------- | --------------- |
| Small controls       | `rounded-sm`    |
| Buttons, inputs      | `rounded-md`    |
| Cards, default       | `rounded-lg`    |
| Large panels         | `rounded-xl`    |

Match existing shadcn components (`Button` uses `rounded-md`) rather than inventing one-off radii.

## Component library

- **Primitives**: `packages/design-system/components/ui/` — shadcn/ui (**New York**, CSS variables, **Lucide** icons). Config: `packages/design-system/components.json`.
- **Layout**: `components/layout/` — e.g. `DashboardLayout`, `ZonesHeader`.
- **AI UI**: `components/ai-elements/` — conversation, message, prompt-input, etc. (used by problem chatbot).
- **Other**: `components/flashcards/`, `components/mode-toggle.tsx`.

Add or update components from the repo root:

```sh
npx shadcn@latest add <component> -c packages/design-system
# update all:
pnpm bump-ui
```

Use **`cn()`** from `@repo/design-system/lib/utils` for conditional classes.

## Layout patterns (Codedrill)

- **Problem workspace** (`/problems/[slug]`): full viewport (`h-dvh`), `ProblemSlugNavHeader`, then horizontal split — description/tabs left, `ProblemWorkspace` right; workspace uses app `SplitLayout` (resizable) between editor and output panel.
- **Problems list / dashboard**: standard page chrome with app headers; cards and tables use design-system `Card`, `Table`, `Badge`, etc.
- **Docs**: sidebar nav + markdown content (`apps/app/features/docs/`).
- **Modals / sheets**: `Dialog`, `Sheet`, `Drawer` from design system; prefer overlay + `bg-background` / `border-border`.
- **Sidebars**: `Sidebar` + `SidebarProvider` (see `DashboardLayout` in the package for reference).

## Icons

**lucide-react** (configured in `components.json`). Stroke icons; typical sizes: `size-4` (inline / button default per shadcn), `h-5 w-5` for emphasis. Import icons directly in feature code — do not wrap unless sharing behavior.
