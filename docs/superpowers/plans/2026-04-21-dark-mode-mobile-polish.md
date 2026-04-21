# Dark Mode + Mobile Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix dark-mode text visibility, polish nav/bio/footer on narrow screens, and add a scroll-reveal animation to the bio section.

**Architecture:** Four independent changes to three components and the Tailwind/CSS layer. The dark-mode fix (Task 1) is a prerequisite for correct visual verification of all subsequent tasks. Each task ends with a `npm run build` check and a commit.

**Tech Stack:** Astro 4, Tailwind CSS v3, vanilla JS Intersection Observer (no new dependencies).

---

## File map

| File | What changes |
|------|-------------|
| `src/styles/global.css` | Add RGB-channel CSS vars (`--tw-ink` etc.) for Tailwind dark-mode support |
| `tailwind.config.mjs` | Redefine semantic colors as `rgb(var(--tw-X) / <alpha-value>)` |
| `src/components/Nav.astro` | Responsive name (initials below 640px), fix toggle alignment |
| `src/components/About.astro` | Responsive bio grid, portrait shadow fix, scroll-reveal animation |
| `src/components/Footer.astro` | Stack vertically on mobile |

---

## Task 1: Fix dark-mode text — RGB-channel CSS variables

**Root cause:** Tailwind compiles `text-ink` to `color: rgb(30 30 28 / 1)` — a hardcoded value that ignores the `--color-ink` CSS variable. To make Tailwind classes theme-aware, redefine colors using `rgb(var(--tw-X) / <alpha-value>)` syntax, where `--tw-X` holds space-separated RGB channels that flip in `html.dark`.

**Files:**
- Modify: `src/styles/global.css`
- Modify: `tailwind.config.mjs`

- [ ] **Step 1: Add channel-format variables to global.css**

  In `src/styles/global.css`, add a new block immediately after the existing `/* --- Design tokens: light (default) --- */` `:root` block (keep the existing hex vars — they're still used by direct CSS). Insert:

  ```css
  /* --- Tailwind-compatible RGB channels (space-separated, no #) --- */
  :root {
      --tw-ink:        30 30 28;
      --tw-ink-soft:   58 58 55;
      --tw-paper:      232 230 227;
      --tw-paper-deep: 223 220 215;
      --tw-paper-soft: 242 240 236;
      --tw-teal:       46 140 166;
      --tw-teal-pale:  140 193 219;
      --tw-teal-deep:  31 107 128;
      --tw-muted:      107 103 98;
      --tw-coral:      216 138 115;
      --tw-ochre:      201 169 97;
      --tw-sage:       159 183 155;
      --tw-rust:       181 89 60;
  }

  html.dark {
      --tw-ink:        232 230 227;
      --tw-ink-soft:   190 186 180;
      --tw-paper:      20 20 22;
      --tw-paper-deep: 31 31 33;
      --tw-paper-soft: 28 28 30;
      --tw-teal:       127 198 224;
      --tw-teal-pale:  169 215 230;
      --tw-teal-deep:  62 155 181;
      --tw-muted:      138 134 127;
      --tw-coral:      228 164 147;
      --tw-ochre:      216 189 130;
      --tw-sage:       181 207 175;
      --tw-rust:       217 127 92;
  }
  ```

- [ ] **Step 2: Update Tailwind color definitions to use channels**

  Replace the entire `colors` block in `tailwind.config.mjs` with:

  ```js
  colors: {
      ink:        'rgb(var(--tw-ink) / <alpha-value>)',
      inkSoft:    'rgb(var(--tw-ink-soft) / <alpha-value>)',
      paper:      'rgb(var(--tw-paper) / <alpha-value>)',
      paperDeep:  'rgb(var(--tw-paper-deep) / <alpha-value>)',
      paperSoft:  'rgb(var(--tw-paper-soft) / <alpha-value>)',
      teal:       'rgb(var(--tw-teal) / <alpha-value>)',
      tealPale:   'rgb(var(--tw-teal-pale) / <alpha-value>)',
      tealDeep:   'rgb(var(--tw-teal-deep) / <alpha-value>)',
      coral:      'rgb(var(--tw-coral) / <alpha-value>)',
      ochre:      'rgb(var(--tw-ochre) / <alpha-value>)',
      sage:       'rgb(var(--tw-sage) / <alpha-value>)',
      rust:       'rgb(var(--tw-rust) / <alpha-value>)',
      muted:      'rgb(var(--tw-muted) / <alpha-value>)',
  },
  ```

- [ ] **Step 3: Verify build passes**

  ```bash
  cd C:/Users/lycha/Desktop/projects/lychan110.github.io && npm run build
  ```

  Expected: `[build] Complete!` with no errors. Tailwind may warn about unknown opacity values if any component uses a non-standard opacity — fix those if they appear by replacing with the nearest valid value.

- [ ] **Step 4: Visual check — start dev server, toggle dark mode, confirm text is light on dark**

  Open `http://localhost:4321`. Use the ☾ toggle. All text (headings, body, links, captions) should be `#E8E6E3` on the dark `#141416` background. The nav logo, section headings, bio text, ledger rows, and footer should all flip correctly.

- [ ] **Step 5: Commit**

  ```bash
  cd C:/Users/lycha/Desktop/projects/lychan110.github.io
  git add src/styles/global.css tailwind.config.mjs
  git commit -m "Fix dark-mode text: Tailwind colors now use RGB-channel CSS vars"
  ```

---

## Task 2: Nav — responsive name + toggle alignment

**Files:**
- Modify: `src/components/Nav.astro`

- [ ] **Step 1: Replace logo text with responsive spans and fix toggle**

  Replace the entire `<nav>` block in `src/components/Nav.astro` with:

  ```astro
  <nav
      class="sticky top-0 z-50 flex items-center justify-between px-page border-b border-rule"
      style="background: var(--color-nav-bg); backdrop-filter: blur(6px); min-height: 64px;"
  >
      <!-- Logo: full name above sm, initials below -->
      <a
          href="/"
          class="font-display text-[22px] font-medium tracking-[-0.3px] text-ink
                 no-underline hover:text-teal transition-colors duration-150 shrink-0"
      >
          <span class="hidden sm:inline">Yu-Chin Chan</span>
          <span class="sm:hidden">Y. (L.) C.</span>
      </a>

      <!-- Right side: nav links + theme toggle, all baseline-aligned -->
      <div class="flex items-center">
          <ul class="flex items-center list-none m-0 p-0">
              <li>
                  <a href="/" class={`nav-item ${current === 'about' ? 'active' : ''}`}>About</a>
              </li>
              <li>
                  <a href="/projects" class={`nav-item ${current === 'projects' ? 'active' : ''}`}>Projects</a>
              </li>
              <li>
                  <a href="/#publications" class={`nav-item ${current === 'publications' ? 'active' : ''}`}>Pubs</a>
              </li>
          </ul>
          <button
              id="theme-toggle"
              aria-label="Toggle theme"
              class="nav-item"
              style="background:none;border:none;cursor:pointer;"
          >
              <span id="theme-icon">☾</span>
          </button>
      </div>
  </nav>
  ```

  Key changes:
  - Logo uses `<span class="hidden sm:inline">` / `<span class="sm:hidden">` for the responsive name
  - "Publications" shortened to "Pubs" on all widths (saves ~50px)
  - Toggle button now uses `.nav-item` class — same padding/font-size as links, ensuring baseline alignment
  - `min-height: 64px` prevents height jitter when name switches

- [ ] **Step 2: Verify nav script still works**

  The `<script>` block at the bottom of Nav.astro is unchanged — `syncIcon()` sets the textContent directly so the ☾/☀ literal is fine. No changes needed there.

- [ ] **Step 3: Build check**

  ```bash
  cd C:/Users/lycha/Desktop/projects/lychan110.github.io && npm run build
  ```

  Expected: `[build] Complete!` with no errors.

- [ ] **Step 4: Visual check at narrow widths**

  In browser, resize window below 640px. Name should switch to "Y. (L.) C.". Links and toggle should sit in a clean horizontal row without wrapping.

- [ ] **Step 5: Commit**

  ```bash
  cd C:/Users/lycha/Desktop/projects/lychan110.github.io
  git add src/components/Nav.astro
  git commit -m "Nav: responsive initials below 640px, unify toggle alignment with nav-item class"
  ```

---

## Task 3: About — responsive bio grid + portrait shadow + scroll reveal

**Files:**
- Modify: `src/components/About.astro`

- [ ] **Step 1: Fix portrait shadow and make bio grid responsive**

  Find the `<!-- Bio + Portrait -->` section. Replace the `<div class="grid gap-[56px]" style="grid-template-columns: ...">` wrapper with:

  ```astro
  <div
      id="portrait-wrap"
      class="grid gap-[24px] md:gap-[56px]
             [grid-template-columns:110px_1fr]
             md:[grid-template-columns:minmax(220px,300px)_minmax(0,1fr)]"
  >
  ```

  On the portrait's inner `<div>` with the box-shadow, replace the hardcoded `#1E1E1C` with the CSS variable:

  ```astro
  <div
      class="relative overflow-hidden"
      style="aspect-ratio: 4/5; box-shadow: 0 1px 0 var(--color-ink), 0 18px 40px -24px rgba(0,0,0,0.35);"
  >
  ```

  On the bio `<div class="flex flex-col justify-center gap-5">`, add the id for the scroll observer:

  ```astro
  <div id="bio-reveal" class="flex flex-col justify-center gap-5">
  ```

- [ ] **Step 2: Add scroll-reveal CSS class to global.css**

  In `src/styles/global.css`, inside the `@layer components` block, add:

  ```css
  /* Bio scroll reveal — initial hidden state set by CSS, JS adds .is-visible */
  .bio-animate {
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 350ms ease, transform 350ms ease;
  }
  .bio-animate.is-visible {
      opacity: 1;
      transform: translateY(0);
  }
  ```

- [ ] **Step 3: Add bio-animate class to #bio-reveal in About.astro**

  Update the bio div opening tag (same element from Step 1):

  ```astro
  <div id="bio-reveal" class="bio-animate flex flex-col justify-center gap-5">
  ```

- [ ] **Step 4: Add Intersection Observer script to About.astro**

  At the very end of `About.astro` (after the last `</section>`), add:

  ```astro
  <script>
      const portrait = document.getElementById('portrait-wrap');
      const bio = document.getElementById('bio-reveal');
      if (portrait && bio) {
          const io = new IntersectionObserver(
              ([entry]) => {
                  if (entry.isIntersecting) {
                      bio.classList.add('is-visible');
                      io.disconnect();
                  }
              },
              { threshold: 0.2 }
          );
          io.observe(portrait);
      }
  </script>
  ```

- [ ] **Step 5: Build check**

  ```bash
  cd C:/Users/lycha/Desktop/projects/lychan110.github.io && npm run build
  ```

  Expected: `[build] Complete!` with no errors.

- [ ] **Step 6: Visual check**

  At full width: portrait column should be 220–300px, bio fills the rest.  
  At < 768px: portrait column is 110px, bio column fills remaining width without squeezing.  
  On page load: bio text is invisible. As you scroll the portrait into view (or it's already visible on page load), bio fades+slides in over 350ms. Verify in dark mode — bio text should be `#E8E6E3`.

- [ ] **Step 7: Commit**

  ```bash
  cd C:/Users/lycha/Desktop/projects/lychan110.github.io
  git add src/components/About.astro src/styles/global.css
  git commit -m "About: responsive bio grid, portrait shadow fix, scroll-reveal animation"
  ```

---

## Task 4: Footer — stack on mobile

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Replace flex layout in footer**

  Replace the inner `<div>` in `Footer.astro`:

  ```astro
  <footer class="px-page py-[28px] pb-[44px] border-t border-rule">
      <div class="flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:gap-0">
          <span class="font-mono text-[10px] tracking-[0.15em] uppercase opacity-70">
              © {year} Y. (L.) Chan
          </span>
          <span class="font-mono text-[10px] tracking-[0.15em] uppercase opacity-70">
              Set in Cormorant Garamond &amp; Lato
          </span>
          <a
              href="https://lychan110.github.io"
              class="font-mono text-[10px] tracking-[0.15em] uppercase opacity-70
                     hover:opacity-100 hover:text-teal transition-all no-underline"
          >
              lychan110.github.io
          </a>
      </div>
  </footer>
  ```

- [ ] **Step 2: Build check**

  ```bash
  cd C:/Users/lycha/Desktop/projects/lychan110.github.io && npm run build
  ```

  Expected: `[build] Complete!` with no errors.

- [ ] **Step 3: Visual check at narrow widths**

  Below 640px: three footer items should stack vertically, centered. Above 640px: they return to the spaced horizontal row.

- [ ] **Step 4: Commit**

  ```bash
  cd C:/Users/lycha/Desktop/projects/lychan110.github.io
  git add src/components/Footer.astro
  git commit -m "Footer: stack vertically on mobile, horizontal row above 640px"
  ```

---

## Task 5: Final push

- [ ] **Step 1: Push all commits to master**

  ```bash
  cd C:/Users/lycha/Desktop/projects/lychan110.github.io && git push origin master
  ```

  Expected: GitHub Actions triggers, deploys to `lychan110.github.io` within ~60 seconds.

- [ ] **Step 2: Smoke-test deployed site**

  Open `https://lychan110.github.io`. Toggle dark mode: all text visible, backgrounds correct. Resize to mobile: nav shows initials, bio column readable, footer stacks cleanly.
