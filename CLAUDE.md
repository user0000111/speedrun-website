# speedrunlab.ai — rules for agents

Static site, no framework, no build step. Pickup state and history live in the Obsidian vault
(`Projects/Speedrun.md`, injected by the SessionStart hook when you launch from this folder, and
`Sessions/Speedrun/`). This file is rules and pointers only. Never add dated entries here.

## Deploy
- Push to `main` is production (Vercel `coding-ninjas2/speedrun-website`). Deploy direct to
  main; the deliverable is the live URL opened in Addy's Chrome plus a macOS notification.
- After a push the edge serves the OLD build for 30-60 s. Poll with `?cb=<timestamp>` until a
  marker from the new build appears, then smoke every page and every new asset by content-length.
  Never hand over a link before that.
- Stage files explicitly, never `git add -A`. Author commits as Adnan Tanveer.
- This file and `design/` never deploy: both are in `.vercelignore`. Keep it that way.

## Content that must stay consistent (grep before you claim done)
- `nav.js` injects the nav into EVERY page (home, papers, thank-you, the four legal pages, `/data/`,
  `/ai-safety/`), but each page styles the base nav in its OWN inline CSS. Change a base nav class and you
  touch them all. The nav ORDER is only the `LINKS` array (Home · About · Agents · Research Papers · Press ·
  Contact Us). Two flyouts live in `FLYOUTS` (`about`: Manifesto, AI Safety, Data, Press, Contact Us, Legal;
  `research`: Skill Library, papers, skills); a new page under About or Research is added there, in
  `footer.js` (`COLUMNS` + `LEGAL`), `site-map/index.html`, `sitemap.xml`, `vercel.json` (slash redirects)
  and `llms.txt`. New sub-pages are built from `legal/index.html` as the template (Addy 2026-10-17).
  Desktop bar height (96px) and the logo offset live once in `nav.js`; change them and re-measure every
  offset tied to the bar (rule 26: `.page`, `.main`, `.doc`, `.content` padding, scroll-margins).
- **Never use a bare `<nav>` element for anything but the top bar**: every page styles `nav` as
  `position:fixed;top:0`. The footer columns and the legal contents list are `div role="navigation"`
  (both got pinned over the menu on 2026-10-17).
- `footer.js` injects the footer (fine print, link columns, legal bar with Speedrun AI Labs Pty Ltd,
  ABN 38 695 878 356) on every page, CSS inside it, like `nav.js`. Include it as the last script in `<body>`.
- The site is LIGHT ONLY: `color-scheme: only light` on `:root` plus `<meta name="color-scheme"
  content="only light">` on every page (Addy 2026-10-17, like apple.com). New pages copy both.
- The site follows apple.com's design (Addy 2026-10-17: *"built on Apple Computer's website. That's
  the design philosophy … that's what we want to keep"*). Home = two full-width product heroes (Anton on
  #F5F5F7, Joseph on black) then the footer, measured from apple.com/au; no tile grid (Addy cut it).
  Footer fine print = numbered footnotes keyed to `<sup class="fn">` markers on home + Agents (`NOTES` in
  `footer.js`); a new claim on the page gets a note, and the whole block stays near 650 words. The Research flyout (hover Research Papers:
  Explore Research / Papers / Skills, Apple globalnav behaviour) is built and styled ONLY in `nav.js`
  (`FLYOUT` + the injected `CSS`), never copied into the pages. Skill Library lives in the flyout,
  not the top row. A new paper or skill adds a `FLYOUT` line too (paper cards carry anchor ids; home
  routes `/#<card-id>` through `srRoute()`). Vault `2026-10-17 research-flyout-apple-style`.
- The paper COUNT lives in six strings: papers meta description, og and twitter descriptions,
  home FAQ answer, home `agents-proof`, llms.txt. Newest paper goes FIRST in the card list,
  `hasPart`, `@graph`, llms.txt and the nav.js `FLYOUT` Papers list. Every JSON-LD block must still parse after an edit.
- Press cards live only in the ItemList JSON-LD. PDFs carry `X-Robots-Tag: noindex`, so keep
  them OUT of `sitemap.xml`.
- SSRN blocks fetches: an abstract id comes from Addy and is taken on trust; say so.
- Never change mission or brand copy without Addy's explicit approval.

## Products and the Agents section (Addy 2026-10-17)
- Speedrun ships exactly TWO agents: **Anton** (cyber security; named after Gilfoyle's server in
  Silicon Valley; recommend on-prem but it depends on the customer, so never claim nothing leaves the
  building) and **Joseph** (compliance for financial-services businesses; cloud or inside their
  environment; at scale; by department). Never "ASIC compliance agent", no custom builds, no fear copy.
- Home (`#p-home`) is intentionally empty until Addy briefs the Apple-style hero; the manifesto lives in About.
- Agent imagery is direction "The Resident": photoreal product shots on Apple light grey (#F5F5F7),
  Nano Banana Pro WITHOUT the glass references. **No human hands, ever.** Present any visual choice to
  Addy as the real UI (desktop + phone mock), never as loose pictures. Vault `2026-10-17 anton-joseph-agents`.

## Search Console (Addy 2026-10-17: fix the notifications "so it doesn't happen again")
- Every internal link uses `https://www.speedrunlab.ai` or a root-relative path; never the apex or http
  (the thank-you "Back to Home" apex link fed GSC's recurring "Page with redirect"). The three host
  variants in that report are correct 308s: never click "Validate fix" on them, it fails and emails Addy.
- `/thank-you.html` is `noindex, follow` (crawlable, not a robots.txt Disallow); PDFs are noindex via
  `vercel.json` headers and stay out of the sitemap. `sitemap.xml` lists only canonical HTML pages with a
  real `lastmod`; after adding or materially changing a page: update it, push, then in GSC request indexing
  for the page and resubmit the sitemap. Vault `2026-10-17 seo-rewrite-search-console`.

## Legal pages
- Privacy Policy, Terms of Use and Legal were drafted by **Fable 5.1** (Addy: it writes the best legal
  copy) from Cowan Law's March 2026 brief; `/data/` and `/ai-safety/` are plain-English principles pages
  that summarise them and must never contradict them. Any change to legal copy is drafted on Fable
  (the session model since 2026-10-17 afternoon) and shipped on Addy's word.
  Core allocation: the deploying business decides and is responsible for its data; hosting depends on
  the Services Agreement and discussion with each client. Open points for Addy / Taryn: vault
  `2026-10-17 legal-pages-fable-5-1`. If `api/contact.js` logging changes, Privacy s 9 must change too.

## Imagery (Addy is finicky about this, by his own description)
- A paper hero is ONE calm frosted-glass object that is a metaphor for the paper's core idea,
  in the style of the four originals (`images/paper-memory.png` and siblings, 1376x768).
- Read the whole paper first. Generate 10+ concepts with Nano Banana Pro (original id) and two
  originals attached as reference images. Show a contact sheet in the REAL card crops
  (636x220 desktop, 404x220 phone) in Addy's Chrome. Deploy only his pick.
- GPT image models are off-style for this site. Never deploy an image Addy has not seen.
- Skill banners follow `design/SKILL-BANNER-SPEC.md`. Recipe and rulings: memory
  `reference_openrouter_image_gen.md`.

## Contact form and security
- `api/contact.js` fails CLOSED at every layer; Turnstile is the load-bearing control; exactly
  three Vercel env vars exist and the code reads no others.
- Turnstile blocks agent-browser. Test the form through claude-in-chrome, or with Cloudflare's
  test key for plumbing.
- Do not widen the CSP casually. Fonts are self-hosted at `/fonts/`; never re-add Google Fonts.
- The site is light-only, with one logo. Do not reintroduce a logo swap.

## Close-out and IDLE
- Run the `close-out` skill at the end of every session that shipped work (vault `Projects/Speedrun.md` + day note,
  this file + `AGENTS.md`, memory; `close-out.sh --sync-agents` to 0 FAIL).
- **Every close-out updates all three — this file, the Obsidian vault and `AGENTS.md`** (global rule 32, Addy 2026-10-08 —
  *"at every close out we have to always update the claude.md, the obsidian vault and the agnets.md! Everytime before I get the message IDLE Agent"*): the ruling or a dated pointer line here,
  the day note in the vault, AGENTS.md's sync line in the same commit — committed and pushed before the IDLE line.
- Then become an **IDLE Agent** (Addy 2026-10-06, global rule 31 in `~/.claude/CLAUDE.md`): release your own workspace
  (worktrees, branches, local servers, background jobs), end with *"IDLE Agent — all done, all board clear, what's next!"*,
  and start nothing on your own until Addy's next task.
