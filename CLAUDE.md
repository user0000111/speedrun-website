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
- `nav.js` injects the nav into ALL THREE pages, but each page styles it in its OWN inline CSS.
  Change a nav class and you touch all three.
- The paper COUNT lives in six strings: papers meta description, og and twitter descriptions,
  home FAQ answer, home `agents-proof`, llms.txt. Newest paper goes FIRST in the card list,
  `hasPart`, `@graph` and llms.txt. Every JSON-LD block must still parse after an edit.
- Press cards live only in the ItemList JSON-LD. PDFs carry `X-Robots-Tag: noindex`, so keep
  them OUT of `sitemap.xml`.
- SSRN blocks fetches: an abstract id comes from Addy and is taken on trust; say so.
- Never change mission or brand copy without Addy's explicit approval.

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
