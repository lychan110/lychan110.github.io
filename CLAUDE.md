# Repo context for Claude

Personal mini-CV / portfolio site at **lychan110.github.io**. Content grows organically, fed by Claude from two Obsidian vaults:

- **Personal vault** ("Lenya's brain") — freely publishable.
- **Work vault** — IP-bearing. Content from here MUST be scrubbed before it enters this repo. Never commit anything from the work vault without the `ip-scrubber` subagent having passed on it.

## Stack (legacy — slated for polish)

Static site: Pug → HTML, SCSS → CSS, plain JS. Build via Node scripts in `scripts/`. Bootstrap 4.5 + jQuery + bibtex-js (via an old rawgit CDN that's sunset — vendor this when doing frontend polish). No framework, no server.

Build: `npm run build`. Dev server: `npm start` (browser-sync on :3000). Preview via the `dev` config in `.claude/launch.json` — always use `preview_start`, not Bash, to run it.

## Content architecture (the important part)

All user-facing content lives in `content/`. Templates in `src/pug/` iterate over it. **To add/update an entry, edit a data file — do not touch templates.**

```
content/
  cv.yml              # site metadata, about, education, awards, experience, talks, social links
  projects/*.md       # one project per file, YAML frontmatter + markdown body
  publications.bib    # → src/assets/ychan_pubs.bib (rendered client-side by bibtex-js)
```

Note: publications still live at `src/assets/ychan_pubs.bib` because bibtex-js fetches it at runtime. When adding a publication, edit that `.bib` file.

### Project frontmatter schema

```yaml
---
title: string                # required
image: string                # required, path relative to dist/ (e.g. assets/img/foo.png)
align: left | right          # which side the image sits on in the two-col layout
order: number                # sort key, ascending
status: published | draft    # draft entries are not rendered
source_vault: personal | work
tags: [string, ...]
---

One-paragraph description (plain markdown text; kept short, used as the project card body).
```

### cv.yml schema

Top-level keys: `site`, `about`, `notice` (optional), `education[]`, `awards[]`, `experience[]`, `talks[]`, `links[]`. See the file for field names. HTML is allowed inside `about` and `notice` (rendered with `!=`).

## How rendering works

`scripts/load-content.js` reads `content/` into a `{ cv, projects }` object. `scripts/render-pug.js` passes it as Pug locals. `src/pug/index.pug` iterates with `each`. Drafts and ordering are handled in the loader.

## Conventions for Claude

- **Adding a project**: use the `/add-entry` skill (or create `content/projects/<slug>.md` directly following the schema above). Do NOT edit `index.pug` for content changes.
- **Syncing from Obsidian**: use `/sync-from-obsidian`. If the source is the work vault, the `ip-scrubber` subagent must review before anything is written here.
- **Never commit**: `.env*`, anything from the work vault that hasn't been scrubbed, internal URLs, client names, unredacted figures.
- **After editing content**: the PostToolUse hook auto-runs `npm run build:pug`. If it didn't fire, run it manually.
- **Frontend polish is a separate stream of work** from content updates — don't mix them in one change.

## Deploy

`master` branch → GitHub Pages via `CNAME`. `dist/` is committed (that's what Pages serves).
