# Agent instructions for lychan110.github.io (portfolio)

## Approach
- Read existing files before writing. Do not re-read unless content changed.
- Thorough in reasoning, concise in output.
- Skip files over 100KB unless required.
- No sycophantic openers or closing fluff.
- No emojis or em-dashes.
- Do not guess APIs, versions, flags, commit SHAs, or package names. Verify by reading code or docs first.

## Project context
- **Type:** Astro 4 static site + Tailwind + React (islands only).
- **React usage:** React only where interactivity is needed. Static pages ship zero client JS.
- **Content:** MDX project files in `src/content/projects/`. Zod schema validation in `src/content/config.ts`. About data in `src/data/about.ts`.
- **Publications:** BibTeX in `src/assets/ychan_pubs.bib`. Build-time script `scripts/parse-bib.js` generates `public/data/publications.json`. Run `npm run build` to regenerate.
- **Dev:** `npm run dev` (port 4321). Astro HMR works for MDX, data, and component edits — no manual rebuild needed during dev.
- **Deploy:** GitHub Actions on push to `master` builds and deploys to `gh-pages` branch.
- **Never commit:** `.env*`, work-vault content that hasn't been scrubbed, `dist/`, `.astro/`.