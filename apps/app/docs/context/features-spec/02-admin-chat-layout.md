# Feature: admin-chat-layout

## Goal

Add an admin layout enhancement that gives the admin area a global header with an **Ask AI** button and a right-side slide-out chat panel. The chat panel should use static/local functionality for now, with clean boundaries so it can later connect to a real AI endpoint.

## Reference

Use `01-design-system.md` as the implementation guide:

- Feature UI should live under `apps/app/features/<feature-name>/`.
- Keep route files thin.
- Use `@repo/design-system` primitives.
- Use semantic tokens such as `bg-background`, `text-muted-foreground`, and `border-border`.
- Put browser state in hooks.
- Prefer named exports.
- Use `lucide-react` for icons.

Current admin route context:

- `apps/app/app/admin/page.tsx` already handles auth, redirect, server fetching, and renders `AdminPageShell`.
- Keep this page focused on server concerns.
- Add the new layout behavior around the existing admin shell rather than moving fetch/auth logic into client components.

## User story

As an admin, I want a persistent header with an **Ask AI** button, so I can open a chatbot panel while managing problems without leaving the admin page.

## Requirements

### Global admin header

Create a header for the admin area with:

- Left side: admin/product label, for example `Admin` or `Problem Admin`.
- Right side: a button labeled `Ask AI`.
- The button toggles the right chat sidebar open and closed.
- The header should remain visually global to the admin page.
- Use design-system `Button`.
- Use semantic token classes only.
- Optional icon: `MessageCircle` from `lucide-react`.

### Right slide-out panel

Create a right panel that:

- Slides in from the right when open.
- Slides out when closed.
- Can be toggled by the `Ask AI` button.
- Has a panel header with title `Ask AI`.
- Has a close button.
- Uses static/local functionality only for now.
- Does not call an API yet.
- Does not require database changes.
- Does not require real AI integration yet.

### Static chatbot functionality

The chatbot should support:

- A basic message list.
- An input field.
- A submit button.
- Local user messages.
- A static assistant response after submit.

Example static response:

```ts
"Static AI response for now. Later this can call the admin assistant endpoint."
```

The chat can start with one assistant message:

```ts
"Hi, I can help you think through problem wording, examples, hints, and test cases."
```

### Layout behavior

The layout should:

- Wrap the existing admin page content.
- Keep the main admin experience usable when the panel is closed.
- Avoid pushing business logic into the route file.
- Keep the open/close state in a hook.
- Use accessible button labels.
- Close the panel when the close button is clicked.
- Optional: close the panel on `Escape`.

## Proposed file structure

```txt
apps/app/features/admin-chat-layout/
  components/
    admin-chat-layout.tsx
    admin-chat-header.tsx
    admin-chat-panel.tsx
    admin-chat-message-list.tsx
    admin-chat-input.tsx
  hooks/
    use-admin-chat-layout.ts
    use-static-admin-chat.ts
  lib/
    admin-chat-types.ts
```

## Component responsibilities

### `AdminChatLayout`

Composes the feature.

Responsibilities:

- Owns layout structure.
- Renders `AdminChatHeader`.
- Renders `children` as the main admin content.
- Renders `AdminChatPanel`.
- Uses `useAdminChatLayout` for sidebar state.

Suggested props:

```ts
type AdminChatLayoutProps = {
  children: React.ReactNode;
};
```

### `AdminChatHeader`

Displays the admin header.

Responsibilities:

- Render title/label.
- Render `Ask AI` button.
- Call `onToggleChat` when clicked.
- Keep markup and styling presentational.

Suggested props:

```ts
type AdminChatHeaderProps = {
  isChatOpen: boolean;
  onToggleChat: () => void;
};
```

### `AdminChatPanel`

Displays the right slide-out panel.

Responsibilities:

- Render panel shell.
- Render panel title.
- Render close button.
- Render message list and input.
- Apply open/closed transition classes.
- Receive `isOpen` and `onClose` from the layout hook.

Suggested props:

```ts
type AdminChatPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};
```

### `AdminChatMessageList`

Displays chat messages.

Responsibilities:

- Render user and assistant messages.
- Keep message rendering simple.
- Use semantic design-system tokens.

### `AdminChatInput`

Displays chat input controls.

Responsibilities:

- Render text input or textarea.
- Render submit button.
- Call `onSubmit` with local input value.
- Disable submit when input is empty.

## Hook responsibilities

### `useAdminChatLayout`

Manages panel visibility.

Returns:

```ts
{
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}
```

### `useStaticAdminChat`

Manages static chat state.

Returns:

```ts
{
  messages: AdminChatMessage[];
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: () => void;
}
```

Behavior:

- Initialize with a static assistant greeting.
- On submit, add the user message.
- Then add one static assistant message.
- Clear the input.

## Types

Create `apps/app/features/admin-chat-layout/lib/admin-chat-types.ts`:

```ts
export type AdminChatRole = "user" | "assistant";

export type AdminChatMessage = {
  id: string;
  role: AdminChatRole;
  content: string;
  createdAt: Date;
};
```

## Route integration

Update the admin route composition without moving server logic into client components.

Current route shape:

```tsx
return (
  <AdminPageShell
    initialProblems={initialProblems}
    initialSelectedId={initialSelectedId ?? null}
  />
);
```

Target route shape:

```tsx
import { AdminChatLayout } from "@/features/admin-chat-layout/components/admin-chat-layout";

return (
  <AdminChatLayout>
    <AdminPageShell
      initialProblems={initialProblems}
      initialSelectedId={initialSelectedId ?? null}
    />
  </AdminChatLayout>
);
```

## Styling guidance

Use classes like:

```tsx
"min-h-screen bg-background text-foreground"
"border-b border-border bg-background/95 backdrop-blur"
"fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-border bg-background shadow-lg transition-transform duration-300"
"translate-x-0"
"translate-x-full"
"text-muted-foreground"
```

Avoid:

- Hardcoded hex colors.
- New UI primitives outside `@repo/design-system`.
- Putting chat state in `page.tsx`.
- Calling a real AI API in this feature pass.

## Accessibility notes

- `Ask AI` button should have `aria-expanded={isChatOpen}`.
- `Ask AI` button should have `aria-controls="admin-ai-panel"`.
- Close button should have an accessible label, such as `aria-label="Close AI chat"`.
- Panel should use `id="admin-ai-panel"`.
- Optional: add `role="dialog"` and `aria-label="Admin AI chat"` if the panel behaves like an overlay.

## Acceptance criteria

- [ ] New feature folder exists at `apps/app/features/admin-chat-layout/`.
- [ ] Admin page has a global header with an `Ask AI` button.
- [ ] Clicking `Ask AI` opens the right chat sidebar.
- [ ] Clicking close hides the right chat sidebar.
- [ ] Chat UI supports local/static messages only.
- [ ] No AI API calls are added yet.
- [ ] Existing `AdminPageShell` still renders inside the admin route.
- [ ] Route remains thin and focused on auth/data fetching/composition.
- [ ] Components use named exports.
- [ ] Design-system imports come from `@repo/design-system`.
- [ ] Styling uses semantic tokens.
- [ ] `pnpm typecheck` passes for `apps/app`.

## Implementation prompt for Codex

Implement a new feature named `admin-chat-layout`.

Use `01-design-system.md` as the guide. Create the feature under `apps/app/features/admin-chat-layout/` with `components/`, `hooks/`, and `lib/` folders.

Add an `AdminChatLayout` component that wraps admin page content with a global admin header and a right slide-out AI chat panel. The header should include a design-system `Button` labeled `Ask AI`. Clicking it toggles the right panel. The panel should slide in/out from the right and include a basic static chatbot UI.

Keep all chat behavior local/static for now. Do not add API calls, database changes, or real AI integration. The chatbot should have a local message list, an input field, a submit button, and a hardcoded assistant response after each user message.

Update `apps/app/app/admin/page.tsx` so the existing `AdminPageShell` is wrapped by `AdminChatLayout`. Keep the current auth redirect, server fetching, and parsing logic in the route. Do not move server logic into client components.

Use design-system imports from `@repo/design-system/components/ui/*`, `cn()` from `@repo/design-system/lib/utils`, and icons from `lucide-react`. Use semantic tokens such as `bg-background`, `text-foreground`, `text-muted-foreground`, and `border-border`. Prefer named exports. Add `"use client"` only to files that need hooks or browser state.
