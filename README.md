# lychan110.github.io

Personal portfolio and CV site — [lychan110.github.io](https://lychan110.github.io).

**Stack:** Astro 4 · Tailwind CSS · React islands · MDX · GitHub Actions → `gh-pages` branch

## Local dev

```bash
npm install
npm run dev      # Astro dev server on :4321 with HMR
npm run build    # parse-bib.js → astro build → dist/
```

---

## Manual content edits

### Bio, education, awards, experience, talks

Edit **`src/data/about.ts`** directly. Each export is a typed array — add or reorder entries and the page updates automatically on the next build. No other files need touching.

```
bio          → paragraph strings rendered in the About bio section
education    → { school, degree, years, note }
awards       → { title, year }
experience   → { title, dates, summary }   title format: "Role — Company"
talks        → { title, venue, location?, date }
```

### Projects

Drop a new **`.mdx` file in `src/content/projects/`**. The filename becomes the URL slug (`metaset.mdx` → `/projects/metaset`). Required frontmatter:

```yaml
---
title:     "Project title"
date:      "YYYY-MM-DD"
status:    complete | ongoing | archived
category:  personal | academic | work
tags:      [tag1, tag2]
summary:   "One or two sentences shown on the project grid card (≤ 300 chars)"
demo_url:  ""          # optional
repo_url:  ""          # optional
paper_url: ""          # optional — DOI or arXiv link fine
image:     ""          # optional — path relative to public/, e.g. /assets/img/foo.png
featured:  false       # set true to pin to top of grid
---

Write the full project description here in Markdown / MDX.
Use ## for top-level headers (H1 is the title from frontmatter).
```

The project grid, filter pills, and detail page all update automatically — no component changes needed.

### Publications

Append a BibTeX entry to **`src/assets/ychan_pubs.bib`**. The `scripts/parse-bib.js` script extracts title, authors, year, venue, doi, and url into `public/data/publications.json` at build time. Standard BibTeX fields — no special format required.

---

## Auto-generating content with Claude Code

With Claude Code open in this repo, use the following skills:

### `/add-entry`

Adds a single new entry (project, publication, award, talk, or experience) guided by a short prompt. Claude will ask what type of entry, gather the details, write the MDX or edit `about.ts` / `ychan_pubs.bib` accordingly, and stage a commit.

Example prompt after invoking:
> "Add a project: a Python tool for visualising topology optimisation results, personal, complete, 2023"

### `/sync-from-obsidian`

Pulls a note or project from the Obsidian vault and converts it into a site entry. Claude reads the vault file, strips any work-IP content through the `ip-scrubber` subagent (mandatory for anything from the work vault), rewrites it to fit the project schema, and writes the MDX file.

> Usage: tell Claude which vault note to sync, e.g. "sync the MetaSet project note from my personal vault"

Work-vault content is **never committed** without passing the IP scrubber — Claude enforces this automatically.

---

## Deploy

Push to `master` → GitHub Actions builds and pushes `dist/` to `gh-pages` → live at `lychan110.github.io` within ~60 seconds.

Never commit `dist/` or `.astro/` manually — both are build output and in `.gitignore`.
