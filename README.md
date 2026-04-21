# lychan110.github.io

Personal portfolio and CV site — [lychan110.github.io](https://lychan110.github.io).

**Stack:** Astro 4 · Tailwind CSS · React islands · MDX · GitHub Actions → `gh-pages` branch

## Local dev

```bash
npm install
npm run dev      # Astro dev server on :4321 with HMR
npm run build    # parse-bib.js → astro build → dist/
```

## Adding content

| What | Where |
|------|-------|
| Project | `src/content/projects/<slug>.mdx` |
| Publication | `src/assets/ychan_pubs.bib` (BibTeX) |
| Award / talk / experience | `src/data/about.ts` |

With Claude Code, use the `/add-entry` or `/sync-from-obsidian` skills.

## Deploy

Push to `master` → GitHub Actions builds and pushes `dist/` to `gh-pages` → live at `lychan110.github.io`.
