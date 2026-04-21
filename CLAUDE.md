# Repo context for Claude

Personal mini-CV / portfolio site served from `lychan110.github.io` (GitHub Pages via GitHub Actions). Content grows organically, fed by Claude from two Obsidian vaults at `C:\Users\lycha\Desktop\projects\Obsidian`:

- **Personal vault** ("Lenya's brain") — freely publishable.
- **Work vault** — IP-bearing. Content from here MUST be scrubbed before it enters this repo. Never commit anything from the work vault without the `ip-scrubber` subagent having passed on it.

## Stack

**Astro 4** (static site) + **Tailwind CSS** + **React** (islands only, for interactivity) + **MDX** (project content) + **GitHub Actions** (build + deploy to GitHub Pages).

- `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json` — framework config
- `src/pages/` — routes (`index.astro`, `projects.astro`, `projects/[slug].astro`)
- `src/components/` — `.astro` components and one `.tsx` React island (`ProjectGrid.tsx` for the filterable project grid + modal)
- `src/layouts/Base.astro` — page shell
- `src/styles/global.css` — Tailwind + custom utilities + font declarations
- `src/content/projects/*.mdx` — one project per MDX file, schema enforced by `src/content/config.ts`
- `src/data/about.ts` — bio, education, awards, experience, talks (typed data)
- `src/assets/ychan_pubs.bib` — BibTeX, parsed at build by `scripts/parse-bib.js` into `public/data/publications.json`
- `public/` — static assets served as-is (images, favicon, generated JSON)

Build: `npm run build` (runs `parse-bib.js` → `astro build`). Dev: `npm run dev` (Astro dev server with HMR on :4321). Preview via the `dev` config in `.claude/launch.json` — always use `preview_start`, not Bash, to run it.

**No jQuery, no Bootstrap, no SCSS, no Pug.** React is used ONLY where the page needs client-side interactivity (the project grid filter + modal). Everything else is static Astro.

## Content schemas

### Projects (`src/content/projects/<slug>.mdx`)

Frontmatter validated by Zod in `src/content/config.ts`:

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
paper_url: "" | https-url                      # optional; DOI or arXiv fine
image:     "" | "/assets/img/foo.png"          # optional, path relative to public/
featured:  boolean                             # default false
---

Markdown / MDX body. Use H2 (`##`) as the top headers (H1 is the title from frontmatter).
Renders on the dedicated project page at /projects/<slug>/.
```

Slug is derived from the filename (`metaset.mdx` → `metaset`). **Do not add a `slug:` field** — it's reserved by Astro.

### About data (`src/data/about.ts`)

Typed TS module exporting `bio`, `education`, `awards`, `experience`, `talks`. `About.astro` currently renders `bio`, `education`, `awards`. Experience and talks are defined in data but not yet rendered (UI work pending — task #6).

### Publications (`src/assets/ychan_pubs.bib`)

Standard BibTeX. `scripts/parse-bib.js` extracts the fields Publications.astro cares about (title, authors, year, venue, doi, url) into JSON at build time. To add a publication, append a BibTeX entry and run `npm run build` (or it'll be picked up on the next CI build).

## Deploy

`.github/workflows/deploy.yml` builds on push to `master` and pushes `dist/` to the `gh-pages` branch → served at `lychan110.github.io`.

## Conventions for Claude

- **Adding a project**: use the `/add-entry` skill (or drop a new MDX file in `src/content/projects/`). Do NOT edit `ProjectGrid.tsx` or `projects.astro` for content changes.
- **Adding an award / talk / experience entry**: edit `src/data/about.ts`.
- **Adding a publication**: append a BibTeX entry to `src/assets/ychan_pubs.bib`. No other files.
- **Syncing from Obsidian**: use `/sync-from-obsidian`. For work-vault sources the `ip-scrubber` subagent must review before anything is written.
- **Never commit**: `.env*`, anything from the work vault that hasn't been scrubbed, internal URLs, client names, unredacted figures.
- **Never commit `dist/` or `.astro/`** — both are build output and are in `.gitignore`.
- **Astro dev server has HMR** — MDX and data edits hot-reload. No manual rebuild needed during development.
- **Visual redesign work** is a separate stream — don't bundle it with content changes.

## Things deliberately chosen (don't swap without discussion)

- Colors: `ink #1E1E1C`, `paper #E8E6E3`, `teal #8CC1DB` (defined in `tailwind.config.mjs`).
- Typography: Cormorant Garamond (display) + Lato (body) + JetBrains Mono (labels).
- React islands only where interactive — home page ships zero client JS by design.
