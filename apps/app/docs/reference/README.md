# Reference notes

Personal **learn-by-reading** docs for CodeDrill — explanations, mental models, and “how does X work here?” notes.

## How this differs from `context/`

| Folder | Audience | Purpose |
| ------ | -------- | ------- |
| [`../context/`](../context/) | Agents + implementers | Specs, architecture, progress tracker — **source of truth for building** |
| [`../context/features-spec/`](../context/features-spec/) | Agents + implementers | Per-feature requirements and acceptance criteria |
| **`reference/`** (here) | You | Plain-language guides you can revisit when someone asks “what is TanStack doing?” |

Agents should **not** treat reference notes as product requirements. If a reference doc and a feature spec disagree, the spec wins.

## Obsidian

The vault root is [`../`](../) (`apps/app/docs/`). Open that folder in Obsidian to browse both `context/` and `reference/`.

- Start from **[00-index.md](./00-index.md)** for a linked map of reference notes.
- Use `[[wikilinks]]` between notes in this folder.
- Link out to specs with normal markdown paths, e.g. `[07-problem-chat-ui](../context/features-spec/ai/problem-chat/07-problem-chat-ui.md)`.

## Adding a note

1. Add `your-topic.md` in this folder.
2. Register it in [00-index.md](./00-index.md).
3. Optional: add a one-line row to [../README.md](../README.md).

Keep notes **explanatory**, not spec-like. Move “we must ship X by Y” content into `context/features-spec/`.
