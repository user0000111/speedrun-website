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
- This file, `design/` and `tests/` never deploy: all three are in `.vercelignore`. Keep it that way.

## Content that must stay consistent (grep before you claim done)
- `nav.js` injects the nav into EVERY page (home, papers, thank-you, the four legal pages, `/data/`,
  `/ai-safety/`), but each page styles the base nav in its OWN inline CSS. Change a base nav class and you
  touch them all. The nav ORDER is only the `LINKS` array (Home · About · Agents · Skill Library · Press ·
  Contact Us; Addy 2026-10-23: *"skills library there and research paper inside, basically a swap"*, the reverse
  held from 17 Oct). Two flyouts live in `FLYOUTS` (`about`: Manifesto, AI Safety, Data, Press, Contact Us, Legal;
  `research`, under Skill Library: Skill Library, Research Papers, the skills, the papers; the key and panel id stay
  `research`); a new page under About or Skill Library is added there, in
  `footer.js` (`COLUMNS` + `LEGAL`), `site-map/index.html`, `sitemap.xml`, `vercel.json` (slash redirects)
  and `llms.txt`. New sub-pages are built from `legal/index.html` as the template (Addy 2026-10-17).
  Desktop bar height (96px) and the logo offset live once in `nav.js`; change them and re-measure every
  offset tied to the bar (rule 26: `.page`, `.main`, `.doc`, `.content` padding, scroll-margins).
- **Phone nav is Apple glass** (Addy's pick "A" of three on 2026-10-17, from his iOS 26 Safari reference):
  one floating frosted card (logo row + the 3×2 link grid, no dividers, active item in a soft pill), panels
  as frosted sheets beneath it. It is styled ONLY in `nav.js` under `html[data-nav="glass"]` (`GLASS` holds
  the material: 45% white, 24px blur, panel 84%, his pick of three transparency levels the same evening;
  34% and 22% lost the labels over the black Joseph section), which outranks every page's inline phone-nav rules; those inline rules stay
  as the no-JS fallback and are not edited for styling. The bar is 136px on phone, so content offsets are
  148px (`data-page` picks the right element per page) and jump targets use `scroll-margin-top:164px`;
  change the bar and change both (rule 26). Applies at ≤768px (iPhone, iPad mini portrait); 820px+ keeps
  the desktop bar. Vault `2026-10-17 glass-menu-a-shipped`.
- The LinkedIn icon is LinkedIn's own mark: `#0A66C2` (hover `#004182`) in every page's `.nav-linkedin`, with a
  white layer under the cut-out "in" in `nav.js` so the letters stay white on any background (Addy 2026-10-17).
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
  `footer.js`); a new claim on the page gets a note, and the whole block stays near 700 words (701 with note 10). The device
  pictures are illustrative (Addy 2026-10-19): each home hero carries footnote 10 beside the device, a `.hx-pin`
  inside `.hx-frame`, the middle fifth of the picture as drawn (full height, centred, 480:1018 of the 2400:1018
  picture, so it never passes the screen edge), so the marker stays on the device's top right corner at every width. A new or re-cropped hero image re-measures the device
  corner and updates `.hx-pin-anton`/`.hx-pin-joseph` (left = (x − 0.4) / 0.2 of the device corner's x share). Vault
  `2026-10-19 hero-pictures-illustrative-footnote`. The `research` flyout (hover Skill Library:
  Explore / Skills / Papers, Apple globalnav behaviour) is built and styled ONLY in `nav.js`
  (`FLYOUT` + the injected `CSS`), never copied into the pages. Since 2026-10-23 Skill Library is the
  top-row item (it lights on `/#skills` and, via `alsoOn`, on `/papers/`) and Research Papers lives inside
  its panel. A new paper or skill adds a `FLYOUT` line too (paper cards carry anchor ids; home
  routes `/#<card-id>` through `srRoute()`). Vault `2026-10-17 research-flyout-apple-style`, `2026-10-23 nav-skill-library-top-row`.
- The paper COUNT lives in six strings: papers meta description, og and twitter descriptions,
  home FAQ answer, home `agents-proof`, llms.txt. The /papers/ cards sit in two labelled sections,
  "Peer-reviewed journal" then "Preprints · SSRN", each newest first; a new paper goes FIRST in its section,
  and the nav.js `FLYOUT` Papers list follows that card order. `hasPart`, the home `@graph` and llms.txt are
  strictly newest first across both sections (fixed 2026-10-22: they had drifted; do not flatten the page
  sections to match them). Every JSON-LD block must still parse after an edit.
- Press cards live only in the ItemList JSON-LD. PDFs carry `X-Robots-Tag: noindex`, so keep
  them OUT of `sitemap.xml`.
- `go()` keeps the URL hash in step with the section (`#about`, `#projects` ...) so a refresh or a shared
  link keeps it and Back returns to the previous one; `srRoute()` routes `/#<section>` and `/#<card-id>`;
  an empty hash means Home. Links on home that target a section call `srRoute()` instead of navigating.
  A `/#<card>` jump on ARRIVAL is applied twice: at once (no flash) and again, instantly, at
  `DOMContentLoaded`, because `footer.js` runs after the inline script and a jump computed on the
  shorter page is clamped by the browser and never revisited (Deep Audit landed 245px low on iPad,
  2026-10-17). Anything that adds height after the inline script keeps this rule alive.
- Desktop flyouts open on hover only after the mouse has really moved (`mouseMoved`): a page reached by
  clicking a menu item loads with the mouse resting on that item and would otherwise drop its panel open.
- SSRN blocks fetches: an abstract id comes from Addy and is taken on trust; say so.
- Never change mission or brand copy without Addy's explicit approval.
- A skill's version shows in three places: the card's `skill-meta` line, its `SoftwareSourceCode` JSON-LD
  `version`, and `llms.txt`. Bump all three when the Speedrunlab repo releases (2026-10-23: Reverse Engineer
  Anything at v1.14, `7d45f1a`, and Hermes Agent as a Skill File at v2.1, `d51aa22`, each after a coverage
  pass against its original). It is "Reverse Engineer Anything" everywhere, never "REA" (Addy 2026-10-22:
  *"All this vague naming needs to stop"*), and no copy refers to the project it was audited against. Vault
  `2026-10-23 reverse-engineer-anything-hardening`, `2026-10-23 reverse-engineer-anything-coverage-pass`,
  `2026-10-23 hermes-skill-coverage-pass`.
- **The Skill Library is one markup with two layouts** (Addy 2026-10-23: *"a multi view of list and a tile view … think as
  if the skills keep growing … we follow apple design philosophy"*; his pick "A Store" of three, apple.com store look: white
  tiles on `#F5F5F7`, 3-up at 1024+, 2-up to 601, one column below; the list is an inset grouped card with square thumbnails).
  Each skill is ONE `<article class="skill-card" id="…" data-cat="agents|security|writing">` holding the name (`h3`), hook,
  meta, platforms, actions and a hidden `.skill-detail` (install commands, note, full description) that the install sheet
  (`#skillSheet`, a `<dialog>`: centred card on desktop, bottom sheet on phone, Copy buttons, GitHub) is filled from. The
  toolbar is category chips (one per `data-cat`; a new category = a chip + the attribute), a live count and the Tiles / List
  segmented control, kept for the tab in `sessionStorage` `sr-skills-view`; every visit opens in tiles (Addy 2026-10-23: *"open in tile view not list view"*). Growth is wired in and
  tested: search appears at `data-search-at="10"` skills, the grid shows `data-page-size="12"` then "Show more", and a deep
  link to a card (`/#deep-audit`, the Research flyout) is always revealed whatever the paging or filter: the routing IIFE
  stashes the arrival hash in `window.srArrive` before `go()` rewrites it, and `srRoute` is wrapped to reveal the card first.
  Adding a skill = one `<article>` (newest first) + its JSON-LD + the nav.js `FLYOUT` line + `llms.txt` + the static count in
  `.skills-count`; nothing else (done 2026-10-23 for the seventh skill, **Reverse Engineer Anything with a Self-Learning Loop**
  v1.0, `15eb23b`, Addy's banner pick F of ten: the assembled chrome engine with one luminous ring, the sibling of the Reverse
  Engineer Anything engine taken apart; its name is written in full, never shortened). Never add a badge pill back: platform
  and licence are text lines. Vault `2026-10-23 skill-library-tiles-and-list`, `2026-10-23 reverse-engineer-anything-self-learning-loop`.

## Products and the Agents section (Addy 2026-10-17)
- Speedrun ships exactly TWO agents: **Anton** (cyber security; named after Gilfoyle's server in
  Silicon Valley; recommend on-prem but it depends on the customer, so never claim nothing leaves the
  building) and **Joseph** (compliance for financial-services businesses; cloud or inside their
  environment; at scale; by department). Never "ASIC compliance agent", no custom builds, no fear copy.
- Home (`#p-home`) is the two Apple-style product heroes (Anton, Joseph); the manifesto lives in About.
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
- A skill banner need not be the bird (Addy 2026-10-22, Reverse Engineer Anything: *"a graphic instead of
  the mascot"*): keep the house material (brushed chrome, navy arcs, blue/copper glow, pixel trail) and draw
  a metaphor object instead. Since the tile/list library (2026-10-23) the skill picture shows at 16:9 (object-fit
  cover: ~370x208 in a desktop tile, full width on phone) and as a 72 px square thumbnail cut from the centre in the
  list (60 px on phone), so the subject sits in the middle half of a 16:9 frame; the contact sheet shows both crops
  and goes to his phone (SendUserFile) when he is away. Never write "middle band" in the prompt: the model
  paints a literal band. Four of the six current banners are the same bird; new banners per skill are a separate
  task on Addy's word. Vault `2026-10-22 reverse-engineer-anything-skill`, `2026-10-23 skill-library-tiles-and-list`.

## Contact form and security
- `api/contact.js` fails CLOSED at every layer; Turnstile is the load-bearing control; exactly
  three Vercel env vars exist and the code reads no others.
- Turnstile blocks agent-browser. Test the form through claude-in-chrome, or with Cloudflare's
  test key for plumbing.
- Contact page (Addy's pick of three, 2026-10-18): "Start with a conversation.", topic chips (Anton,
  Joseph, Something else) that fill the editable Subject, the form in a grey card, "What happens next" in
  three steps, a direct email line. Fields are 17px+ (iPhone Safari zooms into anything smaller); the error
  sits above the form and is scrolled into view; copy uses only claims the site already makes and promises
  no reply time. The form's field names, handler and Turnstile placement are unchanged: any redesign keeps
  them (checked by `FormData` keys on production). Vault `2026-10-18 contact-start-with-a-conversation`.
- The handler's error return is `/?error=1#contact` (query BEFORE the hash); the page reads both that
  and the older `/#contact?error=1`. A redirect that puts the query inside the hash is invisible to
  `location.search`, which is how failed submissions landed on Home with no message until 2026-10-17.
- Do not widen the CSP casually. Fonts are self-hosted at `/fonts/`; never re-add Google Fonts.
- The site is light-only, with one logo. Do not reintroduce a logo swap.

## Testing before "done" (Addy 2026-10-17: *"test it test it test it ... make sure on mobile or iPad or web it looks great on all of it"*)
- Before any change is reported done, run the gate against production:
  `B=https://www.speedrunlab.ai NODE_PATH=~/Documents/investing-platform-v1/node_modules node tests/audit.cjs`
  (14 pages × iPhone 393 / iPad mini 768 / iPad 820 / iPad landscape 1180 / desktop 1440: horizontal scroll, elements past
  the edge, broken images, footnote anchors, page errors; full-page screenshots and one review sheet per
  viewport in `/tmp/speedrun-audit`). Then READ the sheets, phone first. Addy reviews from his phone when
  he is away from the desk; a desktop-only check is not a check. A change to a shared block (nav, footer,
  tiles) re-opens every page that uses it.
- Every menu, by touch and by mouse: `tests/menus.cjs` (same env vars; `CTX=phone,ipad,desk,webkit,links`)
  opens each flyout and presses every item, every top-level item, the logo and the page behind the panel,
  every footer link and home button, Back and refresh, the form's error return, the Read Abstract toggle,
  and crawls every internal link, asserting after each press that no panel or curtain is left open and the
  destination is right. It exists because a reviewer found a tap-opened panel that never closed
  (2026-10-17: *"click menu it does not close and you do not see any content"*). Touch has no mouseleave:
  anything opened by a tap needs an explicit close on any press outside it (`closeIfOutside`, capture
  phase), and `go()` closes any open panel before it swaps sections. Both scripts run before any "done".
- Run both locally (`B=http://127.0.0.1:8765`, `python3 -m http.server 8765`) BEFORE the push, then on production
  after it (2026-10-19: the footnote-10 frame passed a pixel diff and the menu test, but only the production audit's
  edge check caught it, which cost a second deploy). Locally `/#contact` logs Turnstile's 400 (127.0.0.1 is not an
  allowed hostname): expected there, never on production. Start both detached (`nohup sh -c '…' & disown`): a
  background Bash command dies at 10 minutes and the full menu run takes ~12. Vault `2026-10-19 hero-pictures-illustrative-footnote`.
- Phone conventions from his review: the Agents section reads one agent at a time (tile, detail, tile,
  detail; `display:contents` + `order` at ≤768px); flyout panels are menus (full-width rows with chevrons,
  small-caps group labels, the panel scrolls on short phones), not posters; the footer legal links are a
  two-column grid with no separators. Vault `2026-10-17 phone-fixes-and-three-viewport-audit`.

## Close-out and IDLE
- Run the `close-out` skill at the end of every session that shipped work (vault `Projects/Speedrun.md` + day note,
  this file + `AGENTS.md`, memory; `close-out.sh --sync-agents` to 0 FAIL).
- **Every close-out updates all three — this file, the Obsidian vault and `AGENTS.md`** (global rule 32, Addy 2026-10-08 —
  *"at every close out we have to always update the claude.md, the obsidian vault and the agnets.md! Everytime before I get the message IDLE Agent"*): the ruling or a dated pointer line here,
  the day note in the vault, AGENTS.md's sync line in the same commit — committed and pushed before the IDLE line.
- Then become an **IDLE Agent** (Addy 2026-10-06, global rule 31 in `~/.claude/CLAUDE.md`): release your own workspace
  (worktrees, branches, local servers, background jobs), end with *"IDLE Agent — all done, all board clear, what's next!"*,
  and start nothing on your own until Addy's next task.
