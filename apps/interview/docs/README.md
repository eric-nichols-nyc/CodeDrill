# Interview app docs

Developer notes for **`apps/interview`** (AI Interview Coach zone).

| Doc | Description |
|-----|-------------|
| [prd.md](./prd.md) | Product requirements — MVP features, screens, out of scope |
| [AGENTS.md](./AGENTS.md) | Agent entry point and read order |
| [context/progress-tracker.md](./context/progress-tracker.md) | Current phase and session notes |

Static prototype — single flow at `/interview` (create → overview → question → feedback → report).

| Route | Screen |
|-------|--------|
| `/` | Landing |
| `/interview` | Full prototype flow (`InterviewCoach`) |
