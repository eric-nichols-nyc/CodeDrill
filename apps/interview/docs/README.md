# Interview app docs

Developer notes for **`apps/interview`** (AI Interview Coach zone).

| Doc | Description |
|-----|-------------|
| [prd.md](./prd.md) | Product requirements — MVP features, screens, out of scope |
| [AGENTS.md](./AGENTS.md) | Agent entry point and read order |
| [context/progress-tracker.md](./context/progress-tracker.md) | Current phase and session notes |

Static prototype routes (dev: `http://localhost:3012/interview`):

| Route | Screen |
|-------|--------|
| `/` | Landing + screen index |
| `/create` | Create Interview |
| `/overview` | Interview Overview |
| `/session` | Question Player |
| `/feedback` | Per-question Feedback |
| `/report` | Final Report |
