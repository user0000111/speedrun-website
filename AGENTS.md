# AGENTS.md — speedrunlab.ai (for every coding agent: Claude Code, Codex, Cursor, Copilot)
`CLAUDE.md` in this folder is the single source of rules. Read it first, in full. This file is the cross-tool front door and never duplicates a rule.
Last synced with CLAUDE.md: 2026-10-08 · CLAUDE.md sha256 8f992921bb87 · main 45bc037 — by `~/.claude/scripts/close-out.sh --sync-agents`

## Where things are
- Rules: `CLAUDE.md` (this repo). State + history: Addy's private vault (`Projects/Speedrun.md`, `Sessions/Speedrun/`), written only via `~/.claude/scripts/obsidian-log.sh`.
- Site: static pages, `nav.js`, `api/contact.js`, `images/`, `fonts/`; `design/` holds specs and never deploys. No framework, no build.

## Non-negotiables in one screen
- Push to `main` is production; author commits as Adnan Tanveer, stage files explicitly, and verify the new build is served before handing over a link (CLAUDE.md "Deploy").
- Repo-only files stay in `.vercelignore` (`CLAUDE.md`, `AGENTS.md`, `design/`) — anything else in the tree is served publicly.
- Grep every copy before claiming a change is done: the nav lives in three pages' CSS, the paper count in six strings (CLAUDE.md "Content that must stay consistent").
- Never change mission or brand copy, or deploy an image, without Addy's explicit approval (CLAUDE.md "Imagery").
- The contact form fails closed; do not widen the CSP or re-add Google Fonts (CLAUDE.md "Contact form and security").

## Close-out
Run the `close-out` skill at the end of every session that shipped work. When it passes, become an IDLE Agent: release your own workspace, end with *"IDLE Agent — all done, all board clear, what's next!"*, and start nothing until Addy's next task (CLAUDE.md "Close-out and IDLE"; global rule 31). Every close-out updates all three — CLAUDE.md, the Obsidian vault and this file — before the IDLE line (global rule 32, Addy 2026-10-08).
