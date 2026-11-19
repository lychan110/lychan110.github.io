---
name: add-entry
description: Add a new entry (project, publication, award, talk, experience, education) to this Astro portfolio site. Use when the user says anything like "add a project", "new publication", "I got a new award", "add talk", or when syncing content from an Obsidian vault note into the site.
---

# add-entry

Add a single content entry to the site. Entry types: **project, publication, award, talk, experience, education**.

## Decision tree

| Type | Where it lives | How to add |
|---|---|---|
| project | `src/content/projects/<slug>.mdx` | Create new file, frontmatter + MDX body (see schema below) |
| publication | `src/assets/ychan_pubs.bib` | Append a BibTeX entry; `scripts/parse-bib.js` picks it up at build |
| award | `src/data/about.ts` → `awards` | Prepend an item (most recent first) |
| talk | `src/data/about.ts` → `talks` | Prepend an item (most recent first) |
| experience | `src/data/about.ts` → `experience` | Prepend an item (most recent first) |
| education | `src/data/about.ts` → `education` | Append (chronological) |

## Project schema (`src/content/projects/<slug>.mdx`)

Validated by Zod in `src/content/config.ts`. **Do not add a `slug:` field** — Astro derives it from the filename.

```yaml
---
title:     string                              # required
date:      "YYYY-MM-DD"                        # required
status:    "complete" | "ongoing" | "archived" # required
category:  "personal" | "academic" | "work"    # required
tags:      [string, ...]                       # required
summary:   string (≤ 300 chars)                # required, shown on grid card
demo_url:  "" | https-url                      # optional
repo_url:  "" | https-url                      # optional
paper_url: "" | https-url                      # optional
image:     "" | "/assets/img/foo.png"          # optional, path relative to public/
featured:  boolean                             # default false
---

## Overview
Short MDX body. Use H2 (`##`) for top-level sections — H1 is the frontmatter title.
Freeform markdown + JSX components if needed. Rendered on /projects/<slug>/.
```

Filename convention: lowercase, hyphenated slug derived from title (e.g. `data-driven-metamaterials.mdx`). The filename IS the URL slug — keep it stable after publish.

## about.ts schemas

Open `src/data/about.ts` and extend the relevant typed array. The interfaces are defined in that file:

- `Award`: `{ title, year }`
- `Talk`: `{ title, venue, location?, date }`
- `Experience`: `{ title, dates, summary }`
- `Education`: `{ school, degree, years, note }`

Copy an existing item and modify — this keeps the shape consistent.

## Publication (BibTeX)

Append to `src/assets/ychan_pubs.bib`. Match the entry type (`@article`, `@inproceedings`, etc.) and field style of existing entries. `scripts/parse-bib.js` reads: `title`, `author`, `year`, `journal`/`booktitle`, `doi`, `url`.

## Workflow

1. Identify type from user input. If ambiguous, ask.
2. Gather missing required fields. Ask one consolidated question, not one-at-a-time.
3. For a project: derive slug from the title. Confirm with user if the title is long/ambiguous.
4. **If source is the work vault**: stop and invoke the `ip-scrubber` subagent on the proposed content before writing.
5. Write the file.
6. No rebuild needed during dev — Astro HMR picks up MDX and data changes. For production, `npm run build` runs on push via GitHub Actions.
7. Confirm with user; mention the file path and (for projects) the URL where it will appear.

## Guardrails

- Don't touch `src/components/`, `src/pages/`, or `src/layouts/` for content changes. Components iterate over data.
- Don't add a `slug:` frontmatter field to projects. It's reserved.
- One entry per invocation. Bulk adds hide mistakes.
- If the user hands you an Obsidian note, use `/sync-from-obsidian` instead — it handles scrubbing.
