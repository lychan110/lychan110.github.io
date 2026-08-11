# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: anyone landing on a professional identity page — recruiters and hiring managers screening Yu-Chin Chan for a role, academic peers and collaborators evaluating her research, and general professional contacts arriving from a résumé, LinkedIn, GitHub, Google Scholar, or a search. Their job in all cases: quickly understand who she is, what she works on, whether her record holds up, and how to reach her. Confirmed: the site serves all of these audiences equally; it is not tuned for any single one.

## Product Purpose

Personal portfolio and CV site for Yu-Chin Chan ("Lenya"). Presents her research identity, projects, publications, education, awards, experience, and talks in a single crafted surface. Success means a visitor leaves with an accurate and memorable impression of the person behind the credentials — not just a list of them — and can contact her.

## Positioning

A neighboring product could not truthfully copy the combination: a real, verifiable research record (PhD Northwestern in computational metamaterials; Simulation and Digital Twin Research Scientist at Siemens; NSF Graduate Research Fellowship; eight publications) presented through a deliberately identity-forward voice — "Researcher, tinkerer, and worldbuilder" — with credentials intentionally de-emphasized. The site is a designed object, not a CV template.

## Operating Context

- Static Astro site deployed to GitHub Pages: push to `master` → GitHub Actions builds and pushes `dist/` to the `gh-pages` branch (~60 s to live).
- Content grows organically via Claude Code skills (`/add-entry`, `/sync-from-obsidian`), fed from two Obsidian vaults: the personal vault ("Lenya's brain") is freely publishable; the work vault is IP-bearing and every piece of its content must pass the `ip-scrubber` subagent before it is committed.
- Dev loop: `npm run dev` (Astro on :4321, HMR for MDX and data edits); production build runs `scripts/parse-bib.js` then `astro build`.
- Content conventions (documented, enforced by convention): projects are MDX files in `src/content/projects/` (filename = slug, Zod schema in `src/content/config.ts`); résumé data lives in `src/data/about.ts`; publications are BibTeX in `src/assets/ychan_pubs.bib` parsed at build into `public/data/publications.json`.

## Capabilities and Constraints

- About page: masthead, bio, portrait, contact links (email obfuscated, GitHub, Google Scholar), recent-work cards, résumé ledger (experience, education), publications ledger, awards and talks ledgers.
- Projects: filterable grid (React island) plus per-project MDX detail pages at `/projects/<slug>`.
- Dark/light theme toggle, persisted in localStorage.
- Home page ships zero client JavaScript; React is used only where a task needs interactivity (the project grid).
- Constraint: never commit `dist/`, `.astro/`, `.env*`, or unscrubbed work-vault content.
- Constraint: the incumbent visual system is documented in `CLAUDE.md` under "Things deliberately chosen (don't swap without discussion)" — tokens (ink/paper/teal plus coral/ochre/sage/rust accents), fonts (Cormorant Garamond, Lato, JetBrains Mono, Caveat), and the editorial ledger/kicker/registration-mark language. Treat as binding unless the user opens it.
- Constraint: static output only; GitHub Pages; no server-side functionality.

## Brand Commitments

- Name: Yu-Chin Chan; footer signs "Y. (L.) CHAN"; small screens show initials "Y. (L.) C."; masthead photo captioned "Fig. 1 — Y.C."; email lychan115@gmail.com (obfuscated in markup); GitHub `lychan110`; Google Scholar profile linked.
- Voice (user-confirmed binding): masthead "Researcher, tinkerer, and worldbuilder"; bio deliberately non-specific and identity-forward — the credential-heavy PhD bio line exists commented out in `src/data/about.ts` and must stay de-emphasized.
- Identity: "Lenya" is used personally; the site presents the professional name.

## Evidence on Hand

- Projects: METASET (complete, academic; arXiv 2006.02142; ASME IDETC 2020 Paper of Distinction) and Machine Learning for Metal Manufacturing (ongoing, work).
- Publications: 8 BibTeX entries (7 articles + 1 PhD thesis) in `src/assets/ychan_pubs.bib`.
- Résumé data in `src/data/about.ts`: bio (2 paragraphs, lead: "Researcher at heart, always dissecting systems, patterns, and behavior with curiosity and precision…"), education (PhD Mechanical Engineering, Northwestern 2016–2021, IDEAL Group, advisor Prof. Wei Chen; B.S. Mechanical Engineering Honors, NC State 2011–2015, Summa Cum Laude), 5 awards (NSF GRFP 2018; Paper of Distinction ASME IDETC DAC 2020 and 2017; PSE Fellowship 2017; Walter P. Murphy Fellowship 2016), 2 experience entries (Simulation and Digital Twin Research Scientist, Siemens Corporation, Jan 2022–Present; Generative Design Intern, Siemens Corporate Technology, 2018 — topology optimization, US patent), 2 talks (METASET at ASME IDETC/CIE DAC 2020; spectral shape descriptor talk at USNCCM 2019).
- Assets: `/assets/img/mountain.jpg` (masthead texture), `/assets/img/portrait.jpg`, `favicon.svg`.
- Absences: no DESIGN.md; no testimonials, press, case studies, or download links on the site; no unverified claims are to be added. Work-vault content must never be fabricated into the site.

## Product Principles

1. Identity before credentials — the person, voice, and craft come first; the verifiable record backs them up but never leads (user-confirmed).
2. Age well organically — content grows incrementally through lightweight data files and one-off Claude Code skills; no rebuild regime per content change (confirmed goal: ongoing presence).
3. One source of truth per content type — MDX for projects, `about.ts` for résumé data, BibTeX for publications. Edit data, never components.
4. Trustworthy by construction — work-vault IP is scrubbed before it enters the repo; nothing fabricated or unverified ships.
5. The crafted editorial world is deliberate and binding — changes to it are a discussed decision, never a side effect of a content task.
