# AGENTS.md — speedrunlab.ai (for every coding agent: Claude Code, Codex, Cursor, Copilot)
`CLAUDE.md` in this folder is the single source of rules. Read it first, in full. This file is the cross-tool front door and never duplicates a rule.
Last synced with CLAUDE.md: 2026-10-19 · CLAUDE.md sha256 d9f706e0afa9 · main 63b3636 — by `~/.claude/scripts/close-out.sh --sync-agents`

## Where things are
- Rules: `CLAUDE.md` (this repo). State + history: Addy's private vault (`Projects/Speedrun.md`, `Sessions/Speedrun/`), written only via `~/.claude/scripts/obsidian-log.sh`.
- Site: static pages (home, papers, thank-you, privacy, terms, legal, site-map, data, ai-safety), `nav.js` + `footer.js` injected everywhere, `api/contact.js`, `images/`, `fonts/`; `design/` holds specs and never deploys. No framework, no build.

## Non-negotiables in one screen
- Push to `main` is production; author commits as Adnan Tanveer, stage files explicitly, and verify the new build is served before handing over a link (CLAUDE.md "Deploy").
- Repo-only files stay in `.vercelignore` (`CLAUDE.md`, `AGENTS.md`, `design/`, `tests/`) — anything else in the tree is served publicly.
- Grep every copy before claiming a change is done: the base nav lives in three pages' CSS, the Research flyout only in `nav.js`, the paper count in six strings (CLAUDE.md "Content that must stay consistent").
- The design follows apple.com; keep it that way (CLAUDE.md, Addy 2026-10-17).
- The phone nav is Apple glass (45% white), styled only in `nav.js` under `html[data-nav="glass"]`; bar height, content offsets and jump margins move together; the LinkedIn icon is #0A66C2 with white letters (CLAUDE.md).
- Nothing is "done" until `tests/audit.cjs` (every page × four viewports, sheets read phone first) and `tests/menus.cjs` (every menu pressed by touch and by mouse) have run green against production (CLAUDE.md "Testing before done").
- Two agents only (Anton, Joseph); no human hands in imagery; legal copy is drafted by Fable 5.1; never a bare `<nav>` below the top bar (CLAUDE.md).
- A new page is wired in six places (nav flyout, footer, site map, sitemap, redirects, llms.txt) and then requested in Search Console; internal links never use the apex or http host (CLAUDE.md "Search Console").
- Anything that opens on tap needs an explicit close on any press outside it; a `/#card` arrival jump is re-applied at `DOMContentLoaded`; hover opens only after real mouse movement (CLAUDE.md "Content that must stay consistent").
- Never change mission or brand copy, or deploy an image, without Addy's explicit approval (CLAUDE.md "Imagery").
- The contact form fails closed; a redesign keeps its field names, handler and Turnstile placement, and fields stay at 17px+; do not widen the CSP or re-add Google Fonts (CLAUDE.md "Contact form and security").

## Close-out
Run the `close-out` skill at the end of every session that shipped work. When it passes, become an IDLE Agent: release your own workspace, end with *"IDLE Agent — all done, all board clear, what's next!"*, and start nothing until Addy's next task (CLAUDE.md "Close-out and IDLE"; global rule 31). Every close-out updates all three — CLAUDE.md, the Obsidian vault and this file — before the IDLE line (global rule 32, Addy 2026-10-08).
