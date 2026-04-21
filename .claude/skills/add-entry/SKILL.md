---
name: add-entry
description: Add a new entry (project, publication, award, talk, experience, education) to this CV site. Use when the user says anything like "add a project", "new publication", "I got a new award", "add talk", or when syncing content from an Obsidian vault note into the site.
---

# add-entry

Add a single content entry to the site. Entry types: **project, publication, award, talk, experience, education**.

## Decision tree

| Type | Where it lives | How to add |
|---|---|---|
| project | `content/projects/<slug>.md` | Create new file, frontmatter + one-paragraph body (see project schema below) |
| publication | `src/assets/ychan_pubs.bib` | Append a BibTeX entry; rendered client-side by bibtex-js |
| award | `content/cv.yml` → `awards:` | Prepend an item (most recent first) |
| talk | `content/cv.yml` → `talks:` | Prepend an item (most recent first) |
| experience | `content/cv.yml` → `experience:` | Prepend an item (most recent first) |
| education | `content/cv.yml` → `education:` | Append (chronological) |

## Schemas

### project (`content/projects/<slug>.md`)

```yaml
---
title: string              # required
image: string              # required, e.g. assets/img/foo.png (must exist in src/assets/img/)
align: left | right        # image side in two-col layout; alternate from previous project for visual rhythm
order: number              # ascending sort key; use (highest existing + 1) unless user specifies
status: published | draft  # default published; use draft if unsure or still redacting
source_vault: personal | work
tags: [string, ...]
---

One short paragraph, ~1–3 sentences. Plain prose, no markdown formatting inside.
```

Slug: lowercase, hyphenated, derived from title. Keep it stable — it's the filename.

### award / talk / experience / education

See `content/cv.yml` for examples. Copy an existing item and modify — this guarantees the schema stays consistent.

- `award`: `title`, `source`, `date`
- `talk`: `title`, `venue`, `location` (optional), `date`
- `experience`: `title`, `dates`, `summary`
- `education`: `institution`, `degree`, `dates`, `notes[]`

### publication (BibTeX)

Append to `src/assets/ychan_pubs.bib`. Use the same entry type (`@article`, `@inproceedings`, etc.) and field order as existing entries in that file. Required fields vary by type — match the existing style.

## Workflow

1. Identify type from user input. If ambiguous, ask.
2. Gather missing required fields (title, date, etc.). Ask one consolidated question, not one-at-a-time.
3. If an image is needed (project) and not provided, ask for a path or flag a TODO in the frontmatter.
4. **If source is the work vault**: stop and invoke the `ip-scrubber` subagent on the proposed content before writing.
5. Write the file (or edit `cv.yml` / `.bib`).
6. The PostToolUse hook rebuilds Pug automatically. If the hook isn't configured, run `npm run build:pug`.
7. Confirm with the user; mention the file path and whether draft/published.

## Guardrails

- Don't touch `src/pug/*.pug` for content changes. Templates are data-driven.
- Don't bulk-add. One entry per invocation keeps review easy.
- If the user hands you an Obsidian note, use `/sync-from-obsidian` instead — it handles scrubbing.
